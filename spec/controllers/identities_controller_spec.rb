require 'spec_helper'

describe IdentitiesController do
  describe '#identify' do
    let(:error) { nil }
    let(:new_identity) { false }
    let(:request_identity) { double(:request_identity) }
    let(:identification_service) { double(:identification_service) }
    let(:identification_presenter) { double(:identification_presenter) }
    let(:identification_attempt) { { new_identity: new_identity, error: error } }
    let(:identification_attempt_presentation) { double(:identification_attempt_presentation) }
    let(:credentials) { { email_address: 'email@address.meow', password: 'iamyourfather'}.stringify_keys }
    let(:response_status_code) { @response_status_code }

    before(:each) do
      controller.stub(:request_identity => request_identity)
      controller.stub(:identification_presenter => identification_presenter)
      identification_presenter.stub(:identification_attempt => identification_attempt_presentation)
      controller.stub(:identification_service => identification_service)
      controller.stub(:render) {|opts|  @response_status_code ||= opts[:status] }
      identification_service.stub(:identify).and_return(identification_attempt)
    end

    before(:each) { identify }

    def identify
      post 'create', credentials: credentials
    end

    it 'calls the identification service with the given credentials' do
      identification_service.should have_received(:identify).with(identity: request_identity, credentials: credentials.symbolize_keys)
    end

    it 'renders the identification attempt presentation as a json payload' do
      controller.should have_received(:render).with(status: anything, json: identification_attempt_presentation)
    end

    describe 'response status code' do
      describe 'when the user exists already' do
        it 'responds with 200' do
          response_status_code.should == 200
        end
        describe 'but there is a problem with credentials' do
          let(:error) { 'une problema' }

          it 'responds 422' do
            response_status_code.should == 422
          end
        end
      end

      describe 'when the user has not identified themselves before' do
        let(:new_identity) { true }

        it 'responds with 201' do
          response_status_code.should == 201
        end
        describe 'but there is a problem with credentials' do
          let(:error) { "c'est ne pas bon" }

          it 'responds 422' do
            response_status_code.should == 422
          end
        end
      end
    end
  end
end