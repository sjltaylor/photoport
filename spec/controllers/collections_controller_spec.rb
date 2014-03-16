require 'spec_helper'

describe CollectionsController do
  describe '#new' do
    let(:collection_presentation) {double(:collection_presentation)}
    let(:show_default_data) { double(:show_default_data)}
    let(:request_identity) {double(:request_identity) }
    let(:services) { double(:services)}
    let(:presenters) {double(:presenters)}

    before(:each) do
      controller.stub(:request_identity => request_identity)
      controller.stub(:presenters => presenters)
      presenters.stub(:collection => collection_presentation)
      controller.stub(:services => services)
      services.stub(:show_default_data).with(identity: request_identity).and_return(show_default_data)
      controller.stub(:render)
    end

    it 'renders a presentation of the users default collection' do
      expected_args = {
        locals: {
          collection: collection_presentation
        }
      }

      get('new')

      controller.should have_received(:render).with(expected_args)
    end
  end
end