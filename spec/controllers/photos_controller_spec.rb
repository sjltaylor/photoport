require 'spec_helper'

describe PhotosController do
  let(:browsing_service) { double(:browsing_service) }
  let(:cms_service) { double(:cms_service) }
  let(:collection_presenter) { double(:collection_presenter) }

  let(:request_identity) { double(:request_identity) }

  before(:each) { controller.stub(:request_identity).and_return(request_identity) }
  before(:each) { controller.stub(:browsing_service).and_return(browsing_service) }
  before(:each) { controller.stub(:cms_service).and_return(cms_service) }
  before(:each) { controller.stub(:collection_presenter).and_return(collection_presenter) }

  describe '#show' do
    let(:photo_id) { '5565' }
    let(:photo) { double(:photo, id: photo_id) }

    before(:each) { Photo.stub(:find).with(photo_id).and_return(photo) }

    context 'format jpg' do
      let(:file_path) { 'file-path' }
      let(:send_file_options) { @send_file_args[1] }

      before(:each) do
        controller.stub(:send_file) do |*args|
          @send_file_args = args
          controller.render(nothing: true)
        end
      end

      before(:each) { browsing_service.stub(:download_photo).with(identity: request_identity, photo: photo).and_return(file_path) }

      before(:each) { show }

      def show
        get :show, format: :jpg, id: photo_id, collection_id: 132
      end

      it 'calls the browsing service with the request_identity and the photo record' do
        browsing_service.should have_received(:download_photo).with(identity: request_identity, photo: photo)
      end

      it 'sends the file to the client' do
        controller.should have_received(:send_file).with(file_path, instance_of(Hash))
      end

      describe 'send file options' do

        it 'is to be displayed inline' do
          send_file_options[:disposition].should == 'inline'
        end
        it 'has a suggested name of the photo id with a jpg extension' do
          send_file_options[:filename].should == "#{photo.id}.jpg"
        end
        it 'is of content type image/jpeg' do
          send_file_options[:type].should == 'image/jpeg'
        end
      end
    end
    context 'format json' do
      let(:photo_presentation) { double(:photo_presentation) }

      before(:each) { collection_presenter.stub(:photo).with(photo).and_return(photo_presentation) }
      before(:each) { controller.stub(:render) }
      before(:each) { show }

      def show
        get :show, format: :json, id: photo_id, collection_id: 132
      end

      it 'calls the collection_presenter for the photo presentaion of the photo record' do
        collection_presenter.should have_received(:photo).with(photo)
      end

      it 'renders the photo presentation' do
        controller.should have_received(:render).with(json: photo_presentation)
      end
    end
  end

  describe '#create' do
    let(:file_key) { 'test-file-key' }
    let(:collection_id) { 'collection-id' }
    let(:collection) { double(:collection) }
    let(:new_photo) { double(:new_photo) }
    let(:add_photo_parameters) { { collection: collection, identity: request_identity, file_key: file_key } }
    let(:photo_presentation) { double(:photo_presentation) }

    before(:each) { Collection.stub(:find).with(collection_id).and_return(collection) }
    before(:each) { cms_service.stub(:add_photo).with(add_photo_parameters).and_return(new_photo) }
    before(:each) { collection_presenter.stub(:photo).with(new_photo).and_return(photo_presentation) }
    before(:each) { controller.stub(:render) }

    before(:each) { create }

    def create
      post :create, format: :json, collection_id: collection_id, file_key: file_key
    end

    it 'looks up the collection by id' do
      Collection.should have_received(:find).with(collection_id)
    end

    it 'calls the cms service to add the photo to the collection' do
      cms_service.should have_received(:add_photo).with(add_photo_parameters)
    end

    it 'calls for a presentation of the photo' do
      collection_presenter.should have_received(:photo).with(new_photo)
    end

    it 'renders the presentation of the photo' do
      controller.should have_received(:render).with(json: photo_presentation)
    end
  end

  describe '#destroy' do
    let(:photo) { double(:photo) }
    let(:id) { 'fake-id' }

    before(:each) { Photo.stub(:find).with(id).and_return(photo) }
    before(:each) { cms_service.stub(:remove_photo) }
    before(:each) { controller.stub(:render) }
    before(:each) { destroy }

    def destroy
      delete :destroy, format: :json, id: id, collection_id: 'fake-collection-id'
    end

    it 'calls the cms service to delete the photo' do
      cms_service.should have_received(:remove_photo).with(identity: request_identity, photo: photo)
    end
    it 'renders and empty json object' do
      controller.should have_received(:render).with(json: {})
    end
  end
end
