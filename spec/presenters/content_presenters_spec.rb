require 'spec_helper'

describe ContentPresenters do
  let(:name) { 'example-name' }
  let(:url_helper) { double(:url_helper) }
  let(:aws_s3_upload_panel_config) { double(:aws_s3_upload_panel_config) }
  let(:presenters) { Class.new.include(described_class).resolve(url_helper: url_helper, aws_s3_upload_panel_config: aws_s3_upload_panel_config) }
  let(:collection) do
    double(:collection,
      id: 16329,
      name: name,
      photos: (1..10).map{|i| double("photo_#{i}")},
      allow_public_access: true)
  end

  describe '#collection(collection)' do
    let(:collection_presentation) { presenters.collection(collection) }
    let(:add_photo_url) { 'add/photo/url' }
    let(:show_collection_path) { 'show/collection/path' }
    let(:edit_collection_path) { 'edit/collection/path' }
    let(:collection_edit_photos_path) { 'edit/collection/photos/path' }

    before(:each) { allow(presenters).to receive(:photo).and_return(:photo_presentation) }
    before(:each) { allow(url_helper).to receive(:collection_photos_url).with(collection, format: :json).and_return(add_photo_url) }
    before(:each) { allow(url_helper).to receive(:collection_path).with(collection).and_return(show_collection_path) }
    before(:each) { allow(url_helper).to receive(:edit_collection_path).with(collection).and_return(edit_collection_path) }
    before(:each) { allow(url_helper).to receive(:collection_edit_photos_path).with(collection).and_return(collection_edit_photos_path) }

    it 'includes the id' do
      expect(collection_presentation[:id]).to be collection.id
    end
    it 'includes photos' do
      expect(collection_presentation[:photos]).to(eq(collection.photos.map{:photo_presentation}))
    end
    it 'includes a url to add a new photo' do
      expect(collection_presentation[:add]).to be add_photo_url
    end
    it 'includes a url to the collection' do
      expect(collection_presentation[:href]).to be show_collection_path
    end
    it 'includes an edit url for the collection' do
      expect(collection_presentation[:edit]).to be edit_collection_path
    end
    it 'includes an edit photos url for the collection' do
      expect(collection_presentation[:edit_photos]).to be collection_edit_photos_path
    end
    it 'includes the allow_public_access flag' do
      expect(collection_presentation[:allow_public_access]).to be true
    end
    context 'when the collection has a name' do
      it 'includes the collections name' do
        expect(collection.name).to eq name
      end
    end
    context 'when the collection does not have a name' do
      let(:name) { nil }
      it 'includes a computed name like "collection :id"' do
        expect(collection_presentation[:name]).to eq 'collection 16329'
      end
    end
  end

  describe '#photo(photo)' do
    let(:photo_file_url) { 'url/to/image' }
    let(:photo_url) { 'url/to/photo' }
    let(:photo) { double(:photo, collection: double(:collection), id: 443) }
    before(:each) { allow(url_helper).to receive(:collection_photo_url).with(photo.collection, photo, format: :jpg).and_return(photo_file_url) }
    before(:each) { allow(url_helper).to receive(:collection_photo_url).with(photo.collection, photo, format: :json).and_return(photo_url) }

    let(:photo_presentation) { presenters.photo(photo) }

    it 'includes a url of the image file' do
      expect(photo_presentation[:download]).to be photo_file_url
      expect(url_helper).to have_received(:collection_photo_url).with(photo.collection, photo, format: :jpg)
    end

    it 'includes a url of the photo data' do
      expect(photo_presentation[:url]).to be photo_url
      expect(url_helper).to have_received(:collection_photo_url).with(photo.collection, photo, format: :json)
    end

    it 'includes the photo id' do
      expect(photo_presentation[:id]).to be photo.id
    end
  end

  describe '#landing(identity:, collections:, session_id:)' do
    let(:stranger?) { false }
    let(:aws_s3_upload_panel_config) { double(:aws_s3_upload_panel_config) }
    let(:session_id) { double(:session_id) }
    let(:collections) { [double(:collection_1), double(:collections_2)] }
    let(:identity) { double(:identity, stranger?: stranger?) }
    let(:identity_presentation) { double(:identity_presentation) }
    let(:collections_path) { double(:collections_path) }
    let(:new_collection_path) { double(:new_collection_path) }
    before(:each) { allow(presenters).to receive(:aws_s3_upload_panel_config).with(identity: identity, session_id: session_id).and_return(aws_s3_upload_panel_config) }
    before(:each) { allow(presenters).to receive(:identity).with(identity).and_return(identity_presentation) }
    before(:each) do
      collections.each do |collection|
        allow(presenters).to receive(:collection).with(collection).and_return(collection)
      end
    end
    before(:each) do
      allow(url_helper).to receive(:collections_path).at_least(1).times.with(any_args).and_return(collections_path)
      allow(url_helper).to receive(:new_collection_path).with(no_args).and_return(new_collection_path)
    end

    def landing
      presenters.landing(collections: collections, identity: identity, session_id: session_id)
    end

    it 'includes the identity presentation of the identity' do
      expect(landing[:identity]).to be identity_presentation
      expect(presenters).to have_received(:identity).with(identity)
    end

    it 'includes the index path' do
      expect(landing[:index]).to be collections_path
      expect(url_helper).to have_received(:collections_path).with(no_args)
    end

    context 'when the identity represents a stranger' do
      let(:stranger?) { true }

      it 'returns no add url for collections' do
        expect(landing).not_to have_key(:add)
      end
      it 'returns no new url for collections' do
        expect(landing).not_to have_key(:new)
      end
      it 'includes no upload panel configuration' do
        expect(landing).not_to have_key(:upload_panel_config)
      end
      it 'includes no collections' do
        expect(landing).not_to have_key(:collections)
      end
    end

    context 'when the identity does not represent a stranger' do
      let(:add_url) { 'add/url/json' }

      before(:each) do
        allow(url_helper).to receive(:collections_path).with(format: :json).and_return(add_url)
      end

      it 'returns the add url for collections' do
        expect(landing[:add]).to be add_url
      end
      it 'includes the upload panel configuration' do
        expect(landing[:upload_panel_config]).to be aws_s3_upload_panel_config
      end
      it 'includes the collections mapped to collection presentations' do
        expect(landing[:collections]).to eq collections
        expect(presenters).to have_received(:collection).with(collections[0])
        expect(presenters).to have_received(:collection).with(collections[1])
      end
    end
  end
end
