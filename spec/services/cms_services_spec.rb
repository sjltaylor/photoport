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

    before(:each) { allow(new_photo_record).to receive(:save!) }

    before(:each) do
      return_value
    end

    it 'returns the photo' do
      expect(return_value).to be new_photo_record
    end

    it 'saves the photo' do
      expect(new_photo_record).to have_received(:save!)
    end

    it 'adds the photo to the collection' do
      expect(collection.photos).to have_received(:create).with(photo_uid: file_key)
    end
  end
  describe '#remove_photo' do
    let(:photo) { double(:photo) }
    let(:return_value) { remove_photo }
    let(:context) { { identity: identity, photo: photo } }

    before(:each) { allow(photo).to receive(:destroy).and_return(photo) }
    before(:each) { return_value }

    def remove_photo
      services.remove_photo(context)
    end

    it 'removes the photo' do
      expect(photo).to have_received(:destroy).with(no_args)
    end
    it 'returns the removed photo' do
      expect(return_value).to eq photo
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
      allow(identity).to receive(:collections).and_return(collections)
    end

    it 'returns the identity' do
      expect(show_default_data[:identity]).to be identity
    end

    context 'when the identity has collections' do
      let(:collections) { ['first', 'second'] }
      it 'returns all collections' do
        expect(show_default_data[:collections]).to be collections
      end
    end
  end
  describe '#create_collection' do
    let(:name) { 'example-name' }
    let(:collection) { double(:collection, name: name, id: id) }
    let(:id) { 123 }
    let(:collections) { double(:collections) }

    before(:each) do
      allow(identity).to receive(:collections).and_return(collections)

      allow(collections).to receive(:create).with(any_args).and_return(collection)
    end

    def create_collection
      services.create_collection(identity: identity, name: name)
    end

    describe 'the newly created collection' do
      context 'when a name is specified' do
        it 'creates the collection with the specified name' do
          create_collection
          expect(collections).to have_received(:create).with(name: name)
        end
      end
      context 'when a name is not specified' do
        def create_collection
          services.create_collection(identity: identity)
        end
        it 'creates the collection without a name' do
          create_collection
          expect(collections).to have_received(:create).with(name: nil)
        end
      end
      it 'returns the collection' do
        expect(create_collection).to be collection
      end
    end
  end
end
