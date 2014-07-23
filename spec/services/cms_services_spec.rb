require 'spec_helper'

describe CmsServices do
  let(:services) { Class.new.include(described_class).resolve }
  let(:identity) { double(:identity) }

  describe '#add_photo' do
    let(:file_key) { 'test-file-key' }
    let(:new_photo_record) { double(:new_photo_record) }
    let(:collection) { double(:collection, photos: double(:photos, create: new_photo_record))}
    let(:return_value) { add_photo }
    let(:context) { { identity: identity, collection: collection, file_key: file_key } }

    def add_photo
      services.add_photo(context)
    end

    before(:each) { new_photo_record.stub(:save!) }

    before(:each) do
      return_value
    end

    it 'returns the photo' do
      return_value.should be new_photo_record
    end

    it 'saves the photo' do
      new_photo_record.should have_received(:save!)
    end

    it 'adds the photo to the collection' do
      collection.photos.should have_received(:create).with(photo_uid: file_key)
    end
  end
  describe '#remove_photo' do
    let(:photo) { double(:photo) }
    let(:return_value) { remove_photo }
    let(:context) { { identity: identity, photo: photo } }

    before(:each) { photo.stub(destroy: photo) }
    before(:each) { return_value }

    def remove_photo
      services.remove_photo(context)
    end

    it 'removes the photo' do
      photo.should have_received(:destroy).with(no_args)
    end
    it 'returns the removed photo' do
      return_value.should eq photo
    end
  end
  describe '#show_default_data' do
    let(:identity) { double(:identity) }
    let(:context) { { identity: identity } }
    let(:collections) { [double(:collection)] }

    def show_default_data
      services.show_default_data(identity: identity)
    end

    before(:each) do
      identity.stub(:collections => collections)
    end

    it 'returns the identity' do
      show_default_data[:identity].should be identity
    end

    context 'when the identity has collections' do
      let(:collections) { ['first', 'second'] }
      it 'returns all collections' do
        show_default_data[:collections].should be collections
      end
    end
    context 'when the identity has no collections' do
      let(:new_collection) { double(:new_collection) }
      let(:collections) { [new_collection] }

      before(:each) do
        identity.collections.stub(:empty? => true)
        services.stub(:create_collection).with(identity: identity).and_return(new_collection)
      end

      it 'creates a collection' do
        show_default_data
        services.should have_received(:create_collection).with(identity: identity)
      end
      it 'returns the newly created collection' do
        show_default_data[:collections].should eq(collections)
      end
    end
  end
  describe '#create_collection' do
    let(:name) { 'example-name' }
    let(:collection) { double(:collection, name: name, id: id) }
    let(:id) { 123 }
    let(:collections) { double(:collections) }

    before(:each) do
      identity.stub(:collections => collections)

      collections.stub(:create).with(any_args).and_return(collection)
    end

    def create_collection
      services.create_collection(identity: identity, name: name)
    end

    describe 'the newly created collection' do
      context 'when a name is specified' do
        it 'creates the collection with the specified name' do
          create_collection
          collections.should have_received(:create).with(name: name)
        end
      end
      context 'when a name is not specified' do
        def create_collection
          services.create_collection(identity: identity)
        end
        it 'creates the collection without a name' do
          create_collection
          collections.should have_received(:create).with(name: nil)
        end
      end
      it 'returns the collection' do
        create_collection.should be collection
      end
    end
  end
end
