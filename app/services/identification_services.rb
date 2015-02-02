require 'bcrypt'

module IdentificationServices

  def create_identity
    Identity.create
  end

  def lookup_identity(id:)
    Identity.find_by_id(id) || Identity.new
  end

  def identify(identity:, credentials:)
    password      = credentials[:password]
    email_address = credentials[:email_address]

    result = Blobject.new(identity: identity, new_identity: false)

    result.error, result.message = validate_email_address(email_address)

    return result.to_hash if result.error.present?

    existing_identity = Identity.find_by_email_address(email_address)

    result.new_identity = existing_identity.nil?

    if result.new_identity
      if PasswordSec.barely_secure_password?(password)
        result.identity.email_address = email_address
        result.identity.password_hash = BCrypt::Password.create(password)
        result.identity.identify
        result.identity.save!
      else
        result.error = 'password.too_weak'
        result.message = I18n.t(result.error)
      end
    else
      if BCrypt::Password.new(existing_identity.password_hash) == password
        Collection.where(creator_id: identity.id).update_all(creator_id: existing_identity.id)
        identity.destroy! if identity != existing_identity
        result.identity = existing_identity
        result.message = I18n.t('identify.login')
      else
        result.error = 'password.mismatch'
        result.message = I18n.t(result.error)
      end
    end

    return result.to_hash
  end

  protected
  def validate_email_address(email_address)
    return 'email_address.missing', I18n.t('email_address.missing') if email_address.blank?
    return 'email_address.invalid', I18n.t('email_address.invalid') unless email_address =~ /\A.+@.+\Z/
  end
end
