require 'spec_helper'

describe PasswordSec do
  describe '#secure_password?(password)' do
    # passwords must be at least 8 characters
    # include uppercase, lowercase, numbers and nonalphanumeric chars
    # must be no longer than 160 characters (DoS vulnerability)
    rejectable_examples = [
      'password',
      'nothing_upper_case',
      'noNUMBERS',
      '21039182', #numbers only
      'noSPEC1ALchars',
      '!!specials but no caps or nums',
      'sh0RT!',
      '@noNUMBERS',
      'se7en7!',
      ('1sixty!CHS' * 16) + '1'
    ]

    acceptable_examples = [
      '8charsINCL@@@',
      'M1nimal!',
      'ej467%HJEK2193@£.Pl',
      '1sixty!CHS' * 16
    ]

    def secure_password?(candidate)
      described_class.secure_password?(candidate)
    end

    rejectable_examples.each do |candidate|
      it "rejects an insufficiently strong password: '#{candidate}'" do
        secure_password?(candidate).should be false
      end
    end

    acceptable_examples.each do |candidate|
      it "accepts a sufficiently strong password: '#{candidate}'" do
        secure_password?(candidate).should be true
      end
    end
  end
  describe '#barely_secure_password?(password)' do
    # passwords must be at least 8 characters
    rejectable_examples = [
      'passwor',
      '1234567'
    ]

    acceptable_examples = [
      'password',
      '12345678',
      '8charsINCL@@@',
      'M1nimal!',
      'ej467%HJEK2193@£.Pl',
      '1sixty!CHS' * 16
    ]

    def barely_secure_password?(candidate)
      described_class.barely_secure_password?(candidate)
    end

    rejectable_examples.each do |candidate|
      it "rejects an insufficiently strong password: '#{candidate}'" do
        barely_secure_password?(candidate).should be false
      end
    end

    acceptable_examples.each do |candidate|
      it "accepts a sufficiently strong password: '#{candidate}'" do
        barely_secure_password?(candidate).should be true
      end
    end
  end
end