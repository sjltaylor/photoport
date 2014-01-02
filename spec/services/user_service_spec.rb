require 'spec_helper'

describe UserService do
  let(:user_service) { described_class.resolve }

  describe '#create_user' do
    let(:user) { user_service.create_user }
    it 'creates and returns a new user' do
      user.should be_instance_of User
      user.should_not be_new_record
    end
    it 'creates an initial collection for that user' do
      user.collections.count.should be 1
    end
  end

  describe '#show_default_data' do
    let(:user) { double(:user) }

    def show_default_data
      user_service.show_default_data(user: user)
    end

    before(:each) do
      user.stub(:collections => collections)
    end

    context 'when the user has collections' do
      let(:collections) { ['first', 'second'] }
      it 'returns the first' do
        show_default_data.should be collections[0]
      end
    end
    context 'when the user has no collections' do
      let(:collections) { double(:collections, :empty? => true) }
      let(:new_collection) { double(:new_collection) }

      before(:each) do
        collections.stub(:first => new_collection)
        user.collections.stub(:create => new_collection)
      end

      it 'creates a collection' do
        show_default_data
        collections.should have_received(:create)
      end
      it 'returns the newly created collection' do
        show_default_data.should be new_collection
      end
    end
  end
end