require 'spec_helper'

describe ApplicationController do
  describe 'rescuing from exceptions' do
    it { should rescue_from(PermissionsService::NotAllowed).with(:render_404) }
    it { should rescue_from(ActiveRecord::RecordNotFound).with(:render_404) }
    it { should rescue_from(ActionController::RoutingError).with(:render_404) }
  end
end
