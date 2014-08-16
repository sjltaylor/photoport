require 'spec_helper'

describe IdentificationServices do
  let(:services) { Class.new.include(described_class).resolve }

  describe '#create_identity' do
    let(:identity) { services.create_identity }
    it 'creates and returns a new identity' do
      expect(identity).to be_instance_of Identity
      expect(identity).to_not be_new_record
    end
  end

  describe '#identify(identity: identity, credentials: credentials)' do
    let(:credentials) { { email_address: 'email@address.net', password: 'plaintext' } }
    let(:barely_secure_password) { true }
    let(:existing_identities_password_hash) { BCrypt::Password.create(credentials[:password]) }
    let(:existing_identity) do
      identity = Identity.new
      allow(identity).to receive(:password_hash).and_return(existing_identities_password_hash)
      allow(identity).to receive(:save!).and_return(true)
      identity
    end
    let(:identity) do
      identity = Identity.new
      allow(identity).to receive(:save!).and_return(true)
      identity
    end

    before(:each) { allow(PasswordSec).to receive(:barely_secure_password?).with(credentials[:password]).and_return(barely_secure_password) }
    before(:each) { allow(Identity).to receive(:find_by_email_address).with(credentials[:email_address]).and_return(existing_identity) }

    def identify
      services.identify(identity: identity, credentials: credentials)
    end

    shared_examples_for 'successful identification' do
      it 'indicates there was no error' do
        expect(identify[:error]).to be_nil
      end
    end

    shared_examples_for 'unsuccessful identification' do
      it 'returns the identity' do
        expect(identify[:identity]).to be identity
      end
      it 'indicates there was an error' do
        expect(identify[:error]).to eq(error_code)
      end
      it 'includes an error message' do
        expect(identify[:message]).to eq(error_message)
      end
    end

    describe 'when the identity exists already' do
      let(:success_message) { I18n.t('identify.login') }

      before(:each) do
        where = double(:where)
        allow(where).to receive(:update_all)
        allow(Collection).to receive(:where).and_return(where)
      end

      include_examples 'successful identification'
      it 'indicates the identity is not a new identity' do
        expect(identify[:new_identity]).to be false
      end
      it 'returns the existing identity' do
        expect(identify[:identity]).to be existing_identity
      end
      it 'merges the anonymous identity into the existing identity' do
        q = double(:query)
        allow(Collection).to receive(:where).with(creator_id: identity.id).and_return(q)
        allow(q).to receive(:update_all).with(creator_id: existing_identity.id).and_return(q)
        allow(identity).to receive(:destroy!)

        identify

        expect(Collection).to have_received(:where).with(creator_id: identity.id)
        expect(q).to have_received(:update_all).with(creator_id: existing_identity.id)
        expect(identity).to have_received(:destroy!)
      end

      describe 'but the password doesnt match' do
        let(:existing_identities_password_hash) { BCrypt::Password.create('something-else') }
        let(:error_message) { I18n.t('password.mismatch') }
        let(:error_code) { 'password.mismatch' }
        include_examples 'unsuccessful identification'
        it 'indicates the identity is not a new identity' do
          expect(identify[:new_identity]).to be false
        end
        it 'does not transfer the anonymous identities collections with the existing identities before checking the password' do
          identify
          expect(Collection).to_not have_received(:where)
        end
      end
    end

    describe 'when the identity does not exist already' do
      let(:existing_identity) { nil }
      include_examples 'successful identification'
      it 'sets the email address' do
        identify
        expect(identity.email_address).to eq credentials[:email_address]
      end
      describe 'storing the new password' do
        it 'is done securely' do
          pwd = 'ciphertext'
          allow(BCrypt::Password).to receive(:create).with(credentials[:password]).and_return('ciphertext')
          identity = identify[:identity]
          expect(BCrypt::Password).to have_received(:create).with(credentials[:password])
          expect(identity.password_hash).to eq(pwd)
        end
      end
      it 'returns the identity' do
        expect(identify[:identity]).to be identity
      end
      it 'saves the updated identity record' do
        expect(identify[:identity]).to have_received(:save!)
      end
      it 'indicates the identity is a new identity' do
        expect(identify[:new_identity]).to be true
      end
      it 'transitions the identity record to an identified state' do
        allow(identity).to receive(:identify).and_call_original
        identify
        expect(identity).to have_received(:identify)
      end

      describe 'but the password is not strong enough' do
        let(:barely_secure_password) { false }
        let(:error_message) { I18n.t('password.too_weak') }
        let(:error_code) { 'password.too_weak' }

        include_examples 'unsuccessful identification'
        it 'indicates the identity is a new identity' do
          expect(identify[:new_identity]).to be true
        end
      end
    end

    describe 'when the email address is not valid' do
      let(:credentials) { { email_address: 'email', password: '' } }
      let(:error_message) { I18n.t('email_address.invalid') }
      let(:error_code) { 'email_address.invalid' }

      include_examples 'unsuccessful identification'
    end
    describe 'when the email address is missing' do
      let(:error_message) { I18n.t('email_address.missing') }
      let(:error_code) { 'email_address.missing' }

      describe 'represented as an empty string' do
        let(:credentials) { { email_address: '', password: '' } }
        include_examples 'unsuccessful identification'
      end

      describe 'represented as a missing entry' do
        let(:credentials) { { password: '' } }
        include_examples 'unsuccessful identification'
      end
    end
  end
end
