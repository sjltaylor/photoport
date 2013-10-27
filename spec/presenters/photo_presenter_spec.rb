require 'spec_helper'

describe PhotoPresenter do
  let(:url_helper) { double(:url_helper) }
  let(:photo_presenter) { described_class.resolve(url_helper: url_helper) }
  let(:photo) { double(:photo, collection: double(:collection), id: 443) }

  describe '#full' do
    let(:photo_file_url) { 'url/to/photo' }
    before(:each) { url_helper.stub(:collection_photo_url).with(photo.collection, photo, format: :json).and_return(photo_file_url) }

    let(:full) { photo_presenter.full(photo) }

    it 'includes a url of the image file' do
      full[:download].should be photo_file_url
      url_helper.should have_received(:collection_photo_url).with(photo.collection, photo, format: :json)
    end
    it 'includes the photo id' do
      full[:id].should be photo.id
    end
  end
end