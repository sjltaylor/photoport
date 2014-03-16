require 'bcrypt'

module IdentificationServices

  def create_identity
    Identity.create.tap {|identity| identity.collections.create }
  end

  def identify(identity:, credentials:)
    password      = credentials.fetch(:password)
    email_address = credentials.fetch(:email_address)

    existing_identity = Identity.find_by_email_address(email_address)

    new_identity = existing_identity.nil?

    if new_identity
      if PasswordSec.barely_secure_password?(password)
        identity.email_address = email_address
        identity.password_hash = BCrypt::Password.create(password)
        identity.identify
        identity.save!
        message = I18n.t('identify.new')
      else
        error = 'identify.weak_password'
        message = I18n.t(error)
      end
    else
      if BCrypt::Password.new(existing_identity.password_hash) == password
        Collection.where(creator_id: identity.id).update_all(creator_id: existing_identity.id)
        identity.destroy!
        identity = existing_identity
        message = I18n.t('identify.login')
      else
        error = 'identify.password_mismatch'
        message = I18n.t(error)
      end
    end

    {
      identity: identity,
      new_identity: new_identity,
      error: error,
      message: message
    }
  end
end
