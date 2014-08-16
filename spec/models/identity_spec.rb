require 'spec_helper'

describe Identity do
  let(:identity) { Identity.new }

  it { should have_db_index(:email_address).unique(true) }

  describe 'defaults' do
    it 'hash an initial status of "anonymous"' do
      identity.save # aasm populates the status field with a before validation callback
      expect(identity.status).to eq 'anonymous'
    end
  end

  describe '#identified?' do
    context 'when the identity is anonymous' do
      it 'is false' do
        expect(identity).to_not be_identified
      end
    end

    context 'when the identity is registered' do
      before(:each) { identity.identify }

      it 'is true' do
        expect(identity).to be_identified
      end
    end
  end

  describe 'email address' do
    it 'strips whitespace on assignment' do
      identity.email_address = '  email@address.net  '
      expect(identity.email_address).to eq('email@address.net')
    end
  end

  describe '.find_by_email' do
    before(:each) do
      identity.email_address = 'noone@ALL.com'
      identity.password_hash = 'an-unlikely-password-hash'
      identity.save!
    end
    it 'is case insensitive' do
      expect(described_class.find_by_email_address('NOONE@all.com')).to eq identity
    end
  end
end
