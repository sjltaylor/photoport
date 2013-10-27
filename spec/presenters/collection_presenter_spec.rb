require 'spec_helper'

describe CollectionPresenter do
  let(:url_helper) { double(:url_helper) }
  let(:collection_presenter) { described_class.resolve(url_helper: url_helper) }
  let(:collection) { double(:collection, id: 3232, photos: (1..10).map{|i| double("photo_#{i}")}) }

  describe '#full' do
    let(:full) { collection_presenter.full(collection) }
    let(:add_photo_url) { 'add/photo/url' }

    before(:each) { collection_presenter.photo_presenter.stub(:full).and_return(:photo_presentation) }
    before(:each) { url_helper.stub(:collection_photos_url).with(collection).and_return(add_photo_url) }

    it 'includes the id' do
      full[:id].should be collection.id
    end
    it 'includes photos' do
      full[:photos].should(eq(collection.photos.map{:photo_presentation}))
    end
    it 'includes a url to add a new photo' do
      full[:add].should be add_photo_url
    end
  end
end