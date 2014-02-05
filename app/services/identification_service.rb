require 'bcrypt'

class IdentificationService
  include BCrypt

  def record_new_identity(context={})
    Identity.create.tap {|identity| identity.collections.create }
  end
  def identify(context={})
    identity      = context[:identity]
    password      = context[:credentials][:password]
    email_address = context[:credentials][:email_address]

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
      if Password.new(existing_identity.password_hash) == password
        # identities collections become owned by exiting identities
        Collection.where(creator_id: identity.id).update_all(creator_id: existing_identity.id)
        identity.destroy!
        identity = existing_identity
        message = I18n.t('identify.login')
      else
        error = 'identify.password_mismatch'
        message = I18n.t(error)
      end
      # match the passwords using secure password comparison from PasswordSec
      # set an error and return if the password don't match
      # merge
    end

    {
      identity: identity,
      new_identity: new_identity,
      error: error,
      message: message
    }
  end
end
