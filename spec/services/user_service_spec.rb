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
end