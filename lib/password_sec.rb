module PasswordSec
  extend self
  SECURE_RGX=/^(?=.*[A-Z].*)(?=.*[!@#$&*].*)(?=.*[0-9].*)(?=.*[a-z].*).{8,160}$/.freeze
  BARELY_SECURE_RGX=/^.{8,160}$/.freeze


  # taken as-is from devise.rb in devise revision 2aedb1bf795947f189183fbd1e479719463f6395
  # https://github.com/plataformatec/devise
  # constant-time comparison algorithm to prevent timing attacks
  def self.secure_compare(a, b)
    return false if a.blank? || b.blank? || a.bytesize != b.bytesize
    l = a.unpack "C#{a.bytesize}"

    res = 0
    b.each_byte { |byte| res |= byte ^ l.shift }
    res == 0
  end

  def secure_password?(password)
    !!SECURE_RGX.match(password)
  end

  def barely_secure_password?(password)
    !!BARELY_SECURE_RGX.match(password)
  end
end