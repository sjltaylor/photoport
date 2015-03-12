require 'spec_helper'

describe PermissionsServices do
  let(:permissions) { Class.new.include(described_class).resolve }

  describe '#allow_download_photo?' do
    let(:collection) { double(:collection, creator: creator) }
    let(:photo) { double(:photo, collection: collection) }
    let(:identity) { double(:identity) }

    def allow_download_photo?
      permissions.allow_download_photo?(identity: identity, photo: photo)
    end

    context 'when the identity is the creator of the collection to which the photo belongs' do
      let(:creator) { identity }

      it 'returns true' do
        expect(allow_download_photo?).to be true
      end
    end
    context 'when the identity is not creator of the collection to which the photo belongs' do
      let(:creator) { double(:another_identity) }

      it 'returns false' do
        expect(allow_download_photo?).to be false
      end
    end
  end

  describe '#allow_add_photo?' do
    let(:collection) { double(:collection, creator: creator) }
    let(:identity) { double(:identity) }

    def allow_add_photo?
      permissions.allow_add_photo?(identity: identity, collection: collection, file_key: 'example-file-key')
    end

    context 'when the identity is the creator of the collection' do
      let(:creator) { identity }

      it 'returns true' do
        expect(allow_add_photo?).to be true
      end
    end
    context 'when the identity is not the creator of the collection' do
      let(:creator) { double(:another_identity) }

      it 'returns false' do
        expect(allow_add_photo?).to be false
      end
    end
  end

  describe '#allow_remove_photo?' do
    let(:photo) { double(:photo, creator: creator) }
    let(:identity) { double(:identity) }

    def allow_remove_photo?
      permissions.allow_remove_photo?(identity: identity, photo: photo)
    end

    context 'when the identity is the creator of the photo' do
      let(:creator) { identity }

      it 'returns true' do
        expect(allow_remove_photo?).to be true
      end
    end
    context 'when the identity is not the creator of the photo' do
      let(:creator) { double(:another_identity) }

      it 'returns false' do
        expect(allow_remove_photo?).to be false
      end
    end
  end

  describe '#allow_update_collection?' do
    let(:collection) { double(:collection, creator: creator) }
    let(:identity) { double(:identity) }
    let(:updates) { double(:updates) }

    def allow_update_collection?
      permissions.allow_update_collection?(identity: identity, collection: collection, updates: updates)
    end

    context 'when the identity is the creator of the collection' do
      let(:creator) { identity }

      it 'returns true' do
        expect(allow_update_collection?).to be true
      end
    end
    context 'when the identity is not the creator of the collection' do
      let(:creator) { double(:another_identity) }

      it 'returns false' do
        expect(allow_update_collection?).to be false
      end
    end
  end

  describe '#allow_destroy_collection?' do
    let(:collection) { double(:collection, creator: creator) }
    let(:identity) { double(:identity) }

    def allow_destroy_collection?
      permissions.allow_destroy_collection?(identity: identity, collection: collection)
    end

    context 'when the identity is the creator of the collection' do
      let(:creator) { identity }

      it 'returns true' do
        expect(allow_destroy_collection?).to be true
      end
    end
    context 'when the identity is not the creator of the collection' do
      let(:creator) { double(:another_identity) }

      it 'returns false' do
        expect(allow_destroy_collection?).to be false
      end
    end
  end
end
