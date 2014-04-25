require 'spec_helper'

describe IdentificationPresenters do
  let(:identify_url) { 'identify-url' }
  let(:sign_out_url) { 'sign-out-url' }
  let(:url_helper) { double(:url_helper) }
  let(:identity_presenter) { Class.new.include(described_class).resolve(url_helper: url_helper) }
  let(:identity) { double(:identity, status: 'anonymous', identified?: false) }

  before(:each) { url_helper.stub(:identify_url).with(format: :json).and_return(identify_url) }
  before(:each) { url_helper.stub(:sign_out_url).with(format: :json).and_return(sign_out_url) }

  describe '#identity' do
    let(:identity_presentation) { identity_presenter.identity(identity) }

    it 'includes the identity status' do
      identity_presentation[:status].should == identity.status
    end
    it 'includes an identify url' do
      identity_presentation[:identify].should == identify_url
    end
    it 'includes a sign_out url' do
      identity_presentation[:sign_out].should == sign_out_url
    end

    context 'when the identity is anonymous' do
      it 'does not include an email address' do
        identity_presentation.should_not have_key(:email_address)
      end
    end

    context 'when the identity is identified' do
      let(:identity) { double(:identity, status: 'identified', identified?: true, email_address: 'email@address.net') }

      it 'includes the email address of the identity' do
        identity_presentation[:email_address].should == identity.email_address
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

    before(:each) { identity_presenter.stub(:identity).and_return(identity_presentation) }

    it 'includes the message' do
      identification_attempt_presentation[:message].should_not be_nil
      identification_attempt_presentation[:message].should be identification_attempt_result[:message]
    end
    it 'includes the new_identity flag' do
      identification_attempt_presentation[:new_identity].should_not be_nil
      identification_attempt_presentation[:new_identity].should be identification_attempt_result[:new_identity]
    end
    it 'includes any error' do
      identification_attempt_presentation[:error].should_not be_nil
      identification_attempt_presentation[:error].should be identification_attempt_result[:error]
    end
    describe 'when the identification attempt result has an identity' do
      it 'includes an identity presentation of the identity' do
        identification_attempt_presentation[:identity].should_not be_nil
        identification_attempt_presentation[:identity].should be identity_presentation
        identity_presenter.should have_received(:identity).with(identification_attempt_result[:identity])
      end
    end
    describe 'when the identification attempt does not have an identity' do
      let(:identity) { nil }
      it 'does not includes an identity presentation' do
        identification_attempt_result[:identity].should be_nil
      end
    end
  end
end
