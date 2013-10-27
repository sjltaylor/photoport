require 'spec_helper'

describe Photo do
  describe 'validations' do
    it { should validate_presence_of(:collection) }
    it { should validate_presence_of(:photo_uid)  }
  end
end
