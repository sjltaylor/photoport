require 'spec_helper'

describe Identity do
  let(:identity) { Identity.new }

  it { should have_db_index(:email_address).unique(true) }

  describe 'defaults' do
    it 'hash an initial status of "anonymous"' do
      identity.save # aasm populates the status field with a before validation callback
      identity.status.should == 'anonymous'
    end
  end

  describe '#identified?' do
    context 'when the identity is anonymous' do
      it 'is false' do
        identity.should_not be_identified
      end
    end

    context 'when the identity is registered' do
      before(:each) { identity.identify }

      it 'is true' do
        identity.should be_identified
      end
    end
  end

  describe 'email address' do
    it 'strips whitespace on assignment' do
      identity.email_address = '  email@address.net  '
      identity.email_address.should eq('email@address.net')
    end
  end

  describe '.find_by_email' do
    before(:each) do
      identity.email_address = 'noone@ALL.com'
      identity.password_hash = 'an-unlikely-password-hash'
      identity.save!
    end
    it 'is case insensitive' do
      described_class.find_by_email_address('NOONE@all.com').should == identity
    end
  end
end