class ApplicationController < ActionController::Base
  protect_from_forgery

  include Services
  include Presenters
  include RequestIdentity

  rescue_from ActionController::RoutingError, :with => :render_404 unless Rails.env.development?
  rescue_from ActiveRecord::RecordNotFound  , :with => :render_404

  if Rails.env.development?
    rescue_from PermissionsService::NotAllowed, :with => :render_403
  else
    rescue_from PermissionsService::NotAllowed, :with => :render_404
  end

  def render_404
    render status: :not_found, template: '404'
  end

  def render_403
    head status: :forbidden
  end
end
