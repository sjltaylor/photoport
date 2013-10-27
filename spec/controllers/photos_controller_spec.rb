require 'spec_helper'

describe PhotosController do
  let(:browsing_service) { double(:browsing_service) }
  let(:cms_service) { double(:cms_service) }
  let(:photo_presenter) { double(:photo_presenter) }

  let(:stored_user) { double(:stored_user) }

  before(:each) { controller.stub(:stored_user).and_return(stored_user) }
  before(:each) { controller.stub(:browsing_service).and_return(browsing_service) }
  before(:each) { controller.stub(:cms_service).and_return(cms_service) }
  before(:each) { controller.stub(:photo_presenter).and_return(photo_presenter) }

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

      before(:each) { browsing_service.stub(:download_photo).with(user: stored_user, photo: photo).and_return(file_path) }

      before(:each) { show }

      def show
        get :show, format: :jpg, id: photo_id, collection_id: 132
      end

      it 'calls the browsing service with the stored_user and the photo record' do
        browsing_service.should have_received(:download_photo).with(user: stored_user, photo: photo)
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
      let(:full_photo_presentation) { double(:full_photo_presentation) }

      before(:each) { photo_presenter.stub(:full).with(photo).and_return(full_photo_presentation) }
      before(:each) { controller.stub(:render) }
      before(:each) { show }

      def show
        get :show, format: :json, id: photo_id, collection_id: 132
      end

      it 'calls the photo_presenter for the full presentaion of the photo record' do
        photo_presenter.should have_received(:full).with(photo)
      end

      it 'renders the full photo presentation' do
        controller.should have_received(:render).with(json: full_photo_presentation)
      end
    end
  end

  describe '#create' do
    let(:file_key) { 'test-file-key' }
    let(:collection_id) { 'collection-id' }
    let(:collection) { double(:collection) }
    let(:new_photo) { double(:new_photo) }
    let(:add_photo_parameters) { { collection: collection, user: stored_user, file_key: file_key } }
    let(:full_photo_presentation) { double(:full_photo_presentation) }

    before(:each) { Collection.stub(:find).with(collection_id).and_return(collection) }
    before(:each) { cms_service.stub(:add_photo).with(add_photo_parameters).and_return(new_photo) }
    before(:each) { photo_presenter.stub(:full).with(new_photo).and_return(full_photo_presentation) }
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

    it 'calls for a full presentation of the photo' do
      photo_presenter.should have_received(:full).with(new_photo)
    end

    it 'renders the full presentation of the photo' do
      controller.should have_received(:render).with(json: full_photo_presentation)
    end
  end
end
