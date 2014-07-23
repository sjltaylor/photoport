require 'spec_helper'

describe Collection do
  let(:collection) { subject }
  describe 'validations' do
    it { should validate_presence_of(:creator) }
  end
end
