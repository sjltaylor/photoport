require 'spec_helper'

describe 'getting started' do
  describe 'by uploading photo(s)' do
    context 'when there is a mix of photo and non-photo files' do
      it 'uploads the photos and ignores non-photos'
    end

    context 'when there are no photo files' do
      it "displays an error message 'no photos!'"
    end

    describe 'the photoport' do
      it 'shows the photos'
    end
  end
end