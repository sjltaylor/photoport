require 'spec_helper'

describe CollectionsController do
  describe '#new' do
    let(:collection_presentation) {double(:collection_presentation)}
    let(:show_default_data) { double(:show_default_data)}
    let(:stored_user) {double(:stored_user) }
    let(:user_service) { double(:user_service)}
    let(:collection_presenter) {double(:collection_presenter)}

    before(:each) do
      controller.stub(:stored_user => stored_user)
      controller.stub(:collection_presenter => collection_presenter)
      collection_presenter.stub(:full => collection_presentation)
      controller.stub(:user_service => user_service)
      user_service.stub(:show_default_data).with(user: stored_user).and_return(show_default_data)
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