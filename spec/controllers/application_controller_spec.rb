require 'spec_helper'

describe ApplicationController do

  describe 'rescuing from exceptions' do
    it { should rescue_from(Sentry::NotAllowed).with(:render_404) }
    it { should rescue_from(ActiveRecord::RecordNotFound).with(:render_404) }
    it { should rescue_from(ActionController::RoutingError).with(:render_404) }
  end

  describe '#services' do
    it 'is a sentry' do
      controller.send(:services).should be_instance_of Sentry
    end
  end
end
