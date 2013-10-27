require 'spec_helper'

describe User do
  let(:user) { User.new }

  describe 'defaults' do
    it 'hash an initial status of "stranger"' do
      user.save # aasm populates the status field with a before validation callback
      user.status.should == 'stranger'
    end
  end

  describe '#registered?' do
    context 'when the user is anonymous' do
      it 'is false' do
        user.should_not be_registered
      end
    end

    context 'when the user is registered' do
      before(:each) { user.register }

      it 'is true' do
        user.should be_registered
      end
    end
  end
end