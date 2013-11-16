require 'spec_helper'

describe BrowsingService do
  let(:browsing_service) do
    described_class.resolve(
      permissions_service: double(:permissions_service, raise_unless_allowed: context),
      dragonfly_photos_app: double(:dragonfly_photos_app))
  end

  describe '#download_photo' do
    let(:user) { double(:user) }
    let(:photo) { double(:photo, photo_uid: 'example_photo_uid') }
    let(:context) { { user: user, photo: photo } }
    let(:expected_path) { 'example/path' }
    let(:return_value) { download_photo }

    def download_photo
      browsing_service.download_photo(context)
    end

    before(:each) do
      dragonfly_double = double(:dragonfly_double)

      browsing_service.dragonfly_photos_app.stub(:fetch).with(photo.photo_uid).and_return(dragonfly_double)

      dragonfly_double.stub(:thumb).with('600x').and_return(dragonfly_double)
      dragonfly_double.stub(:jpg).and_return(dragonfly_double)
      dragonfly_double.stub(:file).and_return(double(:photo_file, path: expected_path))
    end

    before(:each) { return_value }

    it 'checks for permissions to download' do
      browsing_service.permissions_service.should have_received(:raise_unless_allowed).with(:download_photo, context)
    end

    it 'returns the path of the resized, converted photo file' do
      return_value.should be expected_path
    end
  end
end