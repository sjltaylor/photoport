require 'spec_helper'

describe RequestIdentity do
  let(:instance) { Object.new.extend(RequestIdentity) }
  let(:identity_service) { double(:identity_service) }
  before(:each) { instance.stub(:identity_service).and_return(identity_service) }

  describe '#request_identity' do
    let(:session) { { identity_id: identity_id } }

    before(:each) { instance.stub(:session).and_return(session) }

    def request_identity
      instance.send :request_identity
    end

    context 'when the identity has visited previously' do
      let(:identity_id) { 4444 }
      let(:identity) { double(:identity) }
      before(:each) { Identity.stub(:find).with(identity_id).and_return(identity) }

      it 'returns the identity' do
        request_identity.should be identity
      end

      it 'calls the Identity store with the id from the session' do
        request_identity
        Identity.should have_received(:find).with(identity_id)
      end
    end

    context 'when the identity has not visited previously' do
      let(:identity_id) { nil }
      let(:new_identity) { double(:new_identity, id: 1443) }

      before(:each) { identity_service.stub(:create_identity).with(no_args).and_return(new_identity) }

      it 'creates and returns a identity' do
        request_identity.should be new_identity
        identity_service.should have_received(:create_identity).with(no_args)
      end
      it 'stores the new identitys id in the session' do
        request_identity
        session[:identity_id].should be 1443
      end
    end
  end
end