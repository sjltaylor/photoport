require 'spec_helper'

describe CollectionsController do
  let(:cms_service)  { double(:cms_service)  }
  let(:session_id)   { double(:session_id)   }
  let(:current_user) { double(:current_user) }

  before(:each) do
    controller.session.stub(id: session_id)
    controller.stub(current_user: current_user)
    controller.stub(cms: cms_service)
  end

  describe '#create' do
    let(:file_key) { 'test-file-key' }
    let(:cms_service_result) { double(:cms_service_result) }

    before(:each) do
      cms_service.stub(:create_collection).and_return(cms_service_result)
      controller.stub(:render)
      post(:create, file_key: file_key)
    end

    it 'calls the cms service to create the collection' do
      cms_service.should have_received(:create_collection).with(session_id, current_user, file_key)
    end
    it 'renders the result from the cms service as json' do
      controller.should have_received(:render).with(json: cms_service_result)
    end
    it { should respond_with(:ok) }
  end
end