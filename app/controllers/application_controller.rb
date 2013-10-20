class ApplicationController < ActionController::Base
  protect_from_forgery

  rescue_from ActionController::RoutingError, :with => :render_404
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

  def stored_user
    return current_user if user_signed_in?
    return User.find(session[:strangers_user_id]) unless session[:strangers_user_id].blank?
    return User.create.tap do |new_user|
      session[:strangers_user_id] = new_user.id
    end
  end

  def cms
    @cms ||= CmsService.resolve
  end
end
