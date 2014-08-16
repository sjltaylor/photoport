require 'spec_helper'

describe RequestIdentity do
  let(:instance) { Object.new.extend(RequestIdentity) }
  let(:services) { double(:services) }
  before(:each) { allow(instance).to receive(:services).and_return(services) }

  describe '#request_identity' do
    let(:session) { { identity_id: identity_id } }

    before(:each) { allow(instance).to receive(:session).and_return(session) }

    def request_identity
      instance.send :request_identity
    end

    shared_examples 'creates a new identity' do
      let(:new_identity) { double(:new_identity, id: 1443) }

      before(:each) { allow(services).to receive(:create_identity).with(no_args).and_return(new_identity) }

      it 'creates and returns a identity' do
        expect(request_identity).to be new_identity
        expect(services).to have_received(:create_identity).with(no_args)
      end
      it 'stores the new identitys id in the session' do
        request_identity
        expect(session[:identity_id]).to be 1443
      end
    end

    context 'when the identity has visited previously' do
      let(:identity_id) { 4444 }
      let(:identity) { double(:identity) }
      before(:each) { allow(Identity).to receive(:find_by_id).with(identity_id).and_return(identity) }

      it 'returns the identity' do
        expect(request_identity).to be identity
      end

      it 'calls the Identity store with the id from the session' do
        request_identity
        expect(Identity).to have_received(:find_by_id).with(identity_id)
      end
    end

    context 'when the identity has not visited previously' do
      let(:identity_id) { nil }
      include_examples 'creates a new identity'
    end

    context 'when the identity does not exist' do
      let(:identity_id) { '1432' }
      include_examples 'creates a new identity'
    end
  end
end
