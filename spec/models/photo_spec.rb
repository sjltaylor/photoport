require 'spec_helper'

describe Photo do
  describe 'validations' do
    it { should validate_presence_of(:collection) }
    it { should validate_presence_of(:photo_uid)  }
  end
  describe '#creator' do
    let(:photo) { subject }
    let(:creator) { double(:creator) }
    let(:collection) { double(:collection) }

    before(:each) do
      allow(photo).to receive(:collection).and_return(collection)
      allow(collection).to receive(:creator).and_return(creator)
    end

    it 'returns the creator of the collection to which the photo belongs' do
      expect(photo.creator).to be collection.creator
    end
  end
end
