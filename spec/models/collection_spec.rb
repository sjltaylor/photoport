require 'spec_helper'

describe Collection do
  let(:collection) { subject }

  describe 'schema' do
    it { should have_db_index(:session_id) }
    context 'with no creator_id and no session_id' do
      it { should_not be_valid }
    end
    context 'with a creator_id but no session_id' do
      before(:each) { collection.creator_id = 1 }
      it { should be_valid }
    end
    context 'with no creator_id but a session_id' do
      before(:each) { collection.session_id = 1 }
      it { should be_valid }
    end
    context 'with a creator_id and a session_id' do
      before(:each) { collection.creator_id = collection.session_id = 1 }
      it { should be_valid }
    end
  end
end