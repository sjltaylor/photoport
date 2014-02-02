module PasswordSec
  extend self
  SECURE_RGX=/^(?=.*[A-Z].*)(?=.*[!@#$&*].*)(?=.*[0-9].*)(?=.*[a-z].*).{8,160}$/.freeze
  BARELY_SECURE_RGX=/^.{8,160}$/.freeze


  def secure_password?(password)
    !!SECURE_RGX.match(password)
  end

  def barely_secure_password?(password)
    !!BARELY_SECURE_RGX.match(password)
  end
end