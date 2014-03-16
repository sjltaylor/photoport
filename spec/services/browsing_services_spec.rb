require 'spec_helper'

describe BrowsingServices do
  let(:services) do
    Class.new.include(described_class).resolve(
      dragonfly_photos_app: double(:dragonfly_photos_app))
  end

  describe '#download_photo' do
    let(:identity) { double(:identity) }
    let(:photo) { double(:photo, photo_uid: 'example_photo_uid') }
    let(:context) { { identity: identity, photo: photo } }
    let(:expected_path) { 'example/path' }
    let(:return_value) { download_photo }

    def download_photo
      services.download_photo(context)
    end

    before(:each) do
      dragonfly_double = double(:dragonfly_double)

      services.dragonfly_photos_app.stub(:fetch).with(photo.photo_uid).and_return(dragonfly_double)

      dragonfly_double.stub(:thumb).with('600x').and_return(dragonfly_double)
      dragonfly_double.stub(:encode).with('jpg').and_return(dragonfly_double)
      dragonfly_double.stub(:file).and_return(double(:photo_file, path: expected_path))
    end

    before(:each) { return_value }

    it 'returns the path of the resized, converted photo file' do
      return_value.should be expected_path
    end
  end
end