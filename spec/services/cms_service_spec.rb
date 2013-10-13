require 'spec_helper'

describe CmsService do
  let(:cms_service) do
    collection_presenter = double(:collection_presenter)
    photo_presenter      = double(:photo_presenter)

    described_class.resolve(
      collection_presenter: collection_presenter,
      photo_presenter: photo_presenter)
  end

  describe '#create_collection' do
    let(:file_key_of_first_photo) { nil }
    let(:user) { nil }
    let(:collections) { Collection }
    let(:full_collection_presentation) { double(:full_collection_presentation) }
    let(:new_collection_record) { double(:new_collection_record) }
    let(:session_id) { DateTime.now.to_f.to_s }
    let(:return_value) { create_collection }

    def create_collection
      cms_service.create_collection(session_id, user, file_key_of_first_photo)
    end

    before(:each) do
      collections.stub(:create).and_return(new_collection_record)
      cms_service.collection_presenter.stub(:full).with(new_collection_record).and_return(full_collection_presentation)
      cms_service.stub(:add_photo)
      return_value
    end

    context 'with a registered user' do
      let(:collections) { double(:collections, create: new_collection_record) }
      let(:user) { double(:user, collections: collections) }

      it 'creates a new collection associated with the user' do
        user.collections.should have_received(:create).with(no_args)
      end
      context 'with a first photo' do
        let(:file_key_of_first_photo) { 'file-key-of-first-photo' }
        it 'adds a photo to the collection' do
          cms_service.should have_received(:add_photo).with(new_collection_record, file_key_of_first_photo)
        end
      end
    end
    context 'without a registered user' do
      it 'creates a new anonymous collection keyed with the session id' do
        collections.should have_received(:create).with(session_id: session_id)
      end
      context 'with a first photo' do
        let(:file_key_of_first_photo) { 'file-key-of-first-photo' }
        it 'adds a photo to the collection' do
          cms_service.should have_received(:add_photo).with(new_collection_record, file_key_of_first_photo)
        end
      end
    end
    it 'returns the full presentation of the collection' do
      return_value.should be full_collection_presentation
    end
  end

  describe '#add_photo' do
    let(:file_key) { 'test-file-key' }
    let(:full_photo_presentation) { double(:full_photo_presentation) }
    let(:new_photo_record) { double(:new_photo_record) }
    let(:collection) { double(:collection, photos: double(:photos, create: new_photo_record))}
    let(:return_value) { add_photo }

    def add_photo
      cms_service.add_photo(collection, file_key)
    end

    before(:each) do
      cms_service.photo_presenter.stub(:full).with(new_photo_record).and_return(full_photo_presentation)
      return_value
    end

    it 'calls the photo presenter' do
      cms_service.photo_presenter.should have_received(:full).with(new_photo_record)
    end

    it 'returns a photo presentation' do
      return_value.should be full_photo_presentation
    end

    it 'adds the photo to the collection' do
      collection.photos.should have_received(:create).with(file_key: file_key)
    end
  end
end