require 'spec_helper'

describe Collection do
  describe 'schema' do
    it { should have_db_index(:session_id).allow_nil(false) }
    it { should validate_presence_of :name }
  end
end