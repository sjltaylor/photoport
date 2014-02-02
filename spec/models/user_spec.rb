require 'spec_helper'

describe User do
  let(:user) { User.new }

  it { should have_db_index(:email_address).unique(true) }

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

  describe 'email address' do
    it 'strips whitespace on assignment' do
      user.email_address = '  email@address.net  '
      user.email_address.should eq('email@address.net')
    end
  end

  describe '.find_by_email' do
    before(:each) do
      user.email_address = 'noone@ALL.com'
      user.password_hash = 'an-unlikely-password-hash'
      user.save!
    end
    it 'is case insensitive' do
      User.find_by_email_address('NOONE@all.com').should == user
    end
  end
end