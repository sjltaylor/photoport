require 'spec_helper'

describe CollectionsController do
  describe '#new' do
    let(:landing_presentation) {double(:landing_presentation)}
    let(:show_default_data) { Hash.new }
    let(:request_identity) {double(:request_identity) }
    let(:services) { double(:services)}
    let(:presenters) { double(:presenters) }

    before(:each) do
      controller.stub(:request_identity => request_identity)
      controller.stub(:presenters => presenters)
      presenters.stub(:landing => landing_presentation)
      controller.stub(:services => services)
      services.stub(:show_default_data).with(identity: request_identity).and_return(show_default_data)
      controller.stub(:render)
    end

    context '.json format' do
      it 'renders a presentation of the users default collection' do
        get('new', format: :json)
        controller.should have_received(:render).with(json: landing_presentation)
      end
    end
  end
end