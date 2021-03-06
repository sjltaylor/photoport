require 'spec_helper'

describe IdentificationPresenters do
  let(:identify_url) { 'identify-url' }
  let(:goodbye_url) { 'sign-out-url' }
  let(:url_helper) { double(:url_helper) }
  let(:identity_presenter) { Class.new.include(described_class).resolve(url_helper: url_helper) }
  let(:identity) { double(:identity, status: 'anonymous', identified?: false) }

  before(:each) { allow(url_helper).to receive(:identify_url).with(format: :json).and_return(identify_url) }
  before(:each) { allow(url_helper).to receive(:goodbye_url).with(format: :json).and_return(goodbye_url) }

  describe '#identity' do
    let(:identity_presentation) { identity_presenter.identity(identity) }

    it 'includes the identity status' do
      expect(identity_presentation[:status]).to eq identity.status
    end
    it 'includes an identify url' do
      expect(identity_presentation[:identify]).to eq identify_url
    end
    it 'includes a goodbye url' do
      expect(identity_presentation[:goodbye]).to eq goodbye_url
    end

    context 'when the identity is anonymous' do
      it 'does not include an email address' do
        expect(identity_presentation).to_not have_key(:email_address)
      end
    end

    context 'when the identity is identified' do
      let(:identity) { double(:identity, status: 'identified', identified?: true, email_address: 'email@address.net') }

      it 'includes the email address of the identity' do
        expect(identity_presentation[:email_address]).to eq identity.email_address
      end
    end
  end

  describe '#identification_attempt' do
    let(:identity) { double(:identity) }
    let(:identification_attempt_presentation) { identity_presenter.identification_attempt(identification_attempt_result) }
    let(:identification_attempt_result) do
      {
        identity: identity,
        new_identity: double(:new_identity_flag),
        error: 'error-code',
        message: 'message-about failure'
      }
    end
    let(:identity_presentation) { double(:identity_presentation) }
    let(:collections_path) { 'collections/path' }

    before(:each) do
      allow(identity_presenter).to receive(:identity).and_return(identity_presentation)
      allow(url_helper).to receive(:collections_path).and_return(collections_path)
    end

    it 'includes the message' do
      expect(identification_attempt_presentation[:message]).to_not be_nil
      expect(identification_attempt_presentation[:message]).to be identification_attempt_result[:message]
    end
    it 'includes the new_identity flag' do
      expect(identification_attempt_presentation[:new_identity]).to_not be_nil
      expect(identification_attempt_presentation[:new_identity]).to be identification_attempt_result[:new_identity]
    end
    it 'includes any error' do
      expect(identification_attempt_presentation[:error]).to_not be_nil
      expect(identification_attempt_presentation[:error]).to be identification_attempt_result[:error]
    end
    describe 'when the identification attempt result has an identity' do
      it 'includes an identity presentation of the identity' do
        expect(identification_attempt_presentation[:identity]).to_not be_nil
        expect(identification_attempt_presentation[:identity]).to be identity_presentation
        expect(identity_presenter).to have_received(:identity).with(identification_attempt_result[:identity])
      end
      it 'includes the collections index' do
        expect(identification_attempt_presentation[:index]).to be collections_path
      end
    end
    describe 'when the identification attempt does not have an identity' do
      let(:identity) { nil }
      it 'does not includes an identity presentation' do
        expect(identification_attempt_result[:identity]).to be_nil
      end
    end
  end
end
