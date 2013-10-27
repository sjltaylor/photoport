require 'spec_helper'

describe ApplicationController do
  describe 'rescuing from exceptions' do
    it { should rescue_from(PermissionsService::NotAllowed).with(:render_404) }
    it { should rescue_from(ActiveRecord::RecordNotFound).with(:render_404) }
    it { should rescue_from(ActionController::RoutingError).with(:render_404) }
  end

  describe '#stored_user' do
    let(:user_signed_in) { false }
    let(:current_user) { nil }

    def stored_user
      controller.stored_user
    end

    before(:each) do
      controller.stub(:current_user).and_return(current_user)
      controller.stub(:user_signed_in?).and_return(user_signed_in)
    end

    context 'when the user is registered' do
      let(:user_signed_in) { true }
      let(:current_user) { double(:current_user) }

      it 'returns the #current_user' do
        stored_user.should_not be_nil
        stored_user.should be current_user
      end
    end

    context 'when the user is not registered' do
      let(:user_service) { double(:user_service) }
      let(:new_user) { double(:new_user, id: '1657') }

      describe 'first visit' do
        before(:each) {controller.stub(:users).and_return(user_service) }
        before(:each) { user_service.stub(:create_user).with(no_args).and_return(new_user) }

        it 'creates and returns a user' do
          stored_user.should be new_user
          user_service.should have_received(:create_user).with(no_args)
        end
        it 'stores the strangers_user_id in the session' do
          stored_user
          controller.session[:strangers_user_id].should be new_user.id
        end
      end

      describe 'repeat visits' do
        before(:each) { controller.session.stub(:[]).with(:strangers_user_id).and_return(new_user.id) }
        before(:each) { User.stub(:find).with(new_user.id).and_return(new_user) }

        it 'returns the strangers user record corresponding to the strangers_user_id in the session' do
          stored_user.should be new_user
          User.should have_received(:find).with(new_user.id)
        end
      end
    end
  end
end
