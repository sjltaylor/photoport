require 'spec_helper'

describe IdentificationServices do
  let(:services) { Class.new.include(described_class).resolve }

  describe '#create_identity' do
    let(:identity) { services.create_identity }
    it 'creates and returns a new identity' do
      identity.should be_instance_of Identity
      identity.should_not be_new_record
    end
    it 'creates an initial collection for that identity' do
      identity.collections.count.should be 1
    end
  end

  describe '#identify(identity: identity, credentials: credentials)' do
    let(:credentials) { { email_address: 'email@address.net', password: 'plaintext' } }
    let(:barely_secure_password) { true }
    let(:existing_identities_password_hash) { BCrypt::Password.create(credentials[:password]) }
    let(:existing_identity) do
      identity = Identity.new
      identity.stub(:password_hash => existing_identities_password_hash)
      identity.stub(:save!).and_return(true)
      identity
    end
    let(:identity) do
      identity = Identity.new
      identity.stub(:save!).and_return(true)
      identity
    end

    before(:each) { PasswordSec.stub(:barely_secure_password?).with(credentials[:password]).and_return(barely_secure_password) }
    before(:each) { Identity.stub(:find_by_email_address).with(credentials[:email_address]).and_return(existing_identity) }

    def identify
      services.identify(identity: identity, credentials: credentials)
    end

    shared_examples_for 'successful identification' do
      it 'indicates there was no error' do
        identify[:error].should be_nil
      end
    end

    shared_examples_for 'unsuccessful identification' do
      it 'returns the identity' do
        identify[:identity].should be identity
      end
      it 'indicates there was an error' do
        identify[:error].should eq(error_code)
      end
      it 'includes an error message' do
        identify[:message].should eq(error_message)
      end
    end

    describe 'when the identity exists already' do
      let(:success_message) { I18n.t('identify.login') }

      before(:each) do
        Collection.stub_chain(:where, :update_all)
      end

      include_examples 'successful identification'
      it 'indicates the identity is not a new identity' do
        identify[:new_identity].should be false
      end
      it 'returns the existing identity' do
        identify[:identity].should be existing_identity
      end
      it 'merges the anonymous identity into the existing identity' do
        q = double(:query)
        Collection.stub(:where).with(creator_id: identity.id).and_return(q)
        q.stub(:update_all).with(creator_id: existing_identity.id).and_return(q)
        identity.stub(:destroy!)

        identify

        Collection.should have_received(:where).with(creator_id: identity.id)
        q.should have_received(:update_all).with(creator_id: existing_identity.id)
        identity.should have_received(:destroy!)
      end

      describe 'but the password doesnt match' do
        let(:existing_identities_password_hash) { BCrypt::Password.create('something-else') }
        let(:error_message) { I18n.t('password.mismatch') }
        let(:error_code) { 'password.mismatch' }
        include_examples 'unsuccessful identification'
        it 'indicates the identity is not a new identity' do
          identify[:new_identity].should be false
        end
        it 'does not transfer the anonymous identities collections with the existing identities before checking the password' do
          identify
          Collection.should_not have_received(:where)
        end
      end
    end

    describe 'when the identity does not exist already' do
      let(:existing_identity) { nil }
      include_examples 'successful identification'
      it 'sets the email address' do
        identify
        identity.email_address.should == credentials[:email_address]
      end
      describe 'storing the new password' do
        it 'is done securely' do
          pwd = 'ciphertext'
          BCrypt::Password.stub(:create).with(credentials[:password]).and_return('ciphertext')
          identity = identify[:identity]
          BCrypt::Password.should have_received(:create).with(credentials[:password])
          identity.password_hash.should eq(pwd)
        end
      end
      it 'returns the identity' do
        identify[:identity].should be identity
      end
      it 'saves the updated identity record' do
        identify[:identity].should have_received(:save!)
      end
      it 'indicates the identity is a new identity' do
        identify[:new_identity].should be true
      end
      it 'transitions the identity record to an identified state' do
        identity.stub(:identify).and_call_original
        identify
        identity.should have_received(:identify)
      end

      describe 'but the password is not strong enough' do
        let(:barely_secure_password) { false }
        let(:error_message) { I18n.t('password.too_weak') }
        let(:error_code) { 'password.too_weak' }

        include_examples 'unsuccessful identification'
        it 'indicates the identity is a new identity' do
          identify[:new_identity].should be true
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
