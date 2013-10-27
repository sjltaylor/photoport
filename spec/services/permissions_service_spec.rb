require 'spec_helper'

describe PermissionsService do
  let(:permissions) { subject }

  describe '#download_photo?' do
    let(:collection) { double(:collection, creator: creator) }
    let(:photo) { double(:photo, collection: collection) }
    let(:user) { double(:user) }

    let(:return_value) { download_photo? }

    def download_photo?
      permissions.download_photo?(user: user, photo: photo)
    end

    context 'when the user is the creator of the collection to which the photo belongs' do
      let(:creator) { user }

      it 'returns true' do
        return_value.should be true
      end
    end
    context 'when the user is not creator of the collection to which the photo belongs' do
      let(:creator) { double(:another_user) }

      it 'returns false' do
        return_value.should be false
      end
    end
  end

  describe '#add_photo?' do
    let(:collection) { double(:collection, creator: creator) }
    let(:user) { double(:user) }

    let(:return_value) { add_photo? }

    def add_photo?
      permissions.add_photo?(user: user, collection: collection)
    end

    context 'when the user is the creator of the collection' do
      let(:creator) { user }

      it 'returns true' do
        return_value.should be true
      end
    end
    context 'when the user is not the creator of the collection' do
      let(:creator) { double(:another_user) }

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