require 'spec_helper'

describe PermissionsService do
  let(:permissions) { subject }

  describe '#download_photo?' do
    let(:collection) { double(:collection, creator: creator) }
    let(:photo) { double(:photo, collection: collection) }
    let(:identity) { double(:identity) }

    let(:return_value) { download_photo? }

    def download_photo?
      permissions.download_photo?(identity: identity, photo: photo)
    end

    context 'when the identity is the creator of the collection to which the photo belongs' do
      let(:creator) { identity }

      it 'returns true' do
        return_value.should be true
      end
    end
    context 'when the identity is not creator of the collection to which the photo belongs' do
      let(:creator) { double(:another_identity) }

      it 'returns false' do
        return_value.should be false
      end
    end
  end

  describe '#add_photo?' do
    let(:collection) { double(:collection, creator: creator) }
    let(:identity) { double(:identity) }
    let(:return_value) { add_photo? }

    def add_photo?
      permissions.add_photo?(identity: identity, collection: collection)
    end

    context 'when the identity is the creator of the collection' do
      let(:creator) { identity }

      it 'returns true' do
        return_value.should be true
      end
    end
    context 'when the identity is not the creator of the collection' do
      let(:creator) { double(:another_identity) }

      it 'returns false' do
        return_value.should be false
      end
    end
  end

  describe '#remove_photo?' do
    let(:photo) { double(:photo, creator: creator) }
    let(:identity) { double(:identity) }
    let(:return_value) { remove_photo? }

    def remove_photo?
      permissions.remove_photo?(identity: identity, photo: photo)
    end

    context 'when the identity is the creator of the photo' do
      let(:creator) { identity }

      it 'returns true' do
        return_value.should be true
      end
    end
    context 'when the identity is not the creator of the photo' do
      let(:creator) { double(:another_identity) }

      it 'returns false' do
        return_value.should be false
      end
    end
  end

  describe '#raise_unless_allowed' do
    let(:context) { double(:context) }
    let(:operation_name) { :restricted_operation }
    let(:predicate_name) { :restricted_operation? }
    let(:allowed) { true }
    before(:each) { permissions.stub(predicate_name).and_return(allowed) }

    def raise_unless_allowed
      permissions.raise_unless_allowed(operation_name, context)
    end

    describe 'parameter passing' do
      before(:each) { raise_unless_allowed }

      it 'passes the context to the predicate' do
        permissions.should have_received(predicate_name).with(context)
      end
    end

    context 'when the operation is allowed' do

      # it returns parametes so that any resources which had to be
      # retrived, such as database records, can be reused by the
      # calling function
      it 'returns the parameters' do
        raise_unless_allowed.should be context
      end
    end

    context 'when the operation is prohibited' do
      let(:allowed) { false }

      it 'raises a PermissionsService::NotAllowed' do
        expect{raise_unless_allowed}.to raise_error(PermissionsService::NotAllowed)
      end
    end
  end
end