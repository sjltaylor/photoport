require 'spec_helper'

describe ContentPresenters do
  let(:name) { 'example-name' }
  let(:url_helper) { double(:url_helper) }
  let(:aws_s3_upload_panel_config) { double(:aws_s3_upload_panel_config) }
  let(:presenters) { Class.new.include(described_class).resolve(url_helper: url_helper, aws_s3_upload_panel_config: aws_s3_upload_panel_config) }
  let(:collection) { double(:collection, id: 16329, name: name, photos: (1..10).map{|i| double("photo_#{i}")}) }

  describe '#collection(collection)' do
    let(:collection_presentation) { presenters.collection(collection) }
    let(:add_photo_url) { 'add/photo/url' }
    let(:show_collection_path) { 'show/collection/path' }

    before(:each) { presenters.stub(:photo).and_return(:photo_presentation) }
    before(:each) { url_helper.stub(:collection_photos_url).with(collection, format: :json).and_return(add_photo_url) }
    before(:each) { url_helper.stub(:collection_path).with(collection).and_return(show_collection_path) }

    it 'includes the id' do
      collection_presentation[:id].should be collection.id
    end
    it 'includes photos' do
      collection_presentation[:photos].should(eq(collection.photos.map{:photo_presentation}))
    end
    it 'includes a url to add a new photo' do
      collection_presentation[:add].should be add_photo_url
    end
    it 'includes a url to show the collection' do
      collection_presentation[:show].should be show_collection_path
    end
    context 'when the collection has a name' do
      it 'includes the collections name' do
        collection.name.should == name
      end
    end
    context 'when the collection does not have a name' do
      let(:name) { nil }
      it 'includes a computed name like "Collection :id"' do
        collection_presentation[:name].should == 'Collection 16329'
      end
    end
  end

  describe '#photo(photo)' do
    let(:photo_file_url) { 'url/to/image' }
    let(:photo_url) { 'url/to/photo' }
    let(:photo) { double(:photo, collection: double(:collection), id: 443) }
    before(:each) { url_helper.stub(:collection_photo_url).with(photo.collection, photo, format: :jpg).and_return(photo_file_url) }
    before(:each) { url_helper.stub(:collection_photo_url).with(photo.collection, photo, format: :json).and_return(photo_url) }

    let(:photo_presentation) { presenters.photo(photo) }

    it 'includes a url of the image file' do
      photo_presentation[:download].should be photo_file_url
      url_helper.should have_received(:collection_photo_url).with(photo.collection, photo, format: :jpg)
    end

    it 'includes a url of the photo data' do
      photo_presentation[:url].should be photo_url
      url_helper.should have_received(:collection_photo_url).with(photo.collection, photo, format: :json)
    end

    it 'includes the photo id' do
      photo_presentation[:id].should be photo.id
    end
  end

  describe '#landing(identity:, collections:, session_id:)' do
    let(:aws_s3_upload_panel_config) { double(:aws_s3_upload_panel_config) }
    let(:session_id) { double(:session_id) }
    let(:collections) { [double(:collection_1), double(:collections_2)] }
    let(:identity) { double(:identity) }
    let(:identity_presentation) { double(:identity_presentation) }
    let(:root_path) { double(:root_path) }
    before(:each) { presenters.stub(:aws_s3_upload_panel_config).with(identity: identity, session_id: session_id).and_return(aws_s3_upload_panel_config) }
    before(:each) { presenters.stub(:identity).with(identity).and_return(identity_presentation) }
    before(:each) do
      collections.each do |collection|
        presenters.stub(:collection).with(collection).and_return(collection)
      end
    end
    before(:each) do
      url_helper.stub(:root_path).and_return(root_path)
    end

    def landing
      presenters.landing(collections: collections, identity: identity, session_id: session_id)
    end

    it 'includes the upload panel configuration' do
      landing[:upload_panel_config].should be aws_s3_upload_panel_config
    end
    it 'includes the collections mapped to collection presentations' do
      landing[:collections].should eq collections
      presenters.should have_received(:collection).with(collections[0])
      presenters.should have_received(:collection).with(collections[1])
    end
    it 'includes the identity presentation of the identity' do
      landing[:identity].should be identity_presentation
      presenters.should have_received(:identity).with(identity)
    end
    it 'includes the index path' do
      landing[:index].should be root_path
      url_helper.should have_received(:root_path).with(no_args)
    end
  end
end
