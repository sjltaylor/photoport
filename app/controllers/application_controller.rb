class ApplicationController < ActionController::Base
  protect_from_forgery

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

  def stored_user
    return current_user if user_signed_in?
    return User.find(session[:strangers_user_id]) unless session[:strangers_user_id].blank?
    return user_service.create_user.tap do |new_user|
      session[:strangers_user_id] = new_user.id
    end
  end

  def cms_service
    @cms_service ||= CmsService.resolve
  end

  def browsing_service
    @browsing_service ||= BrowsingService.resolve(dragonfly_photos_app: Dragonfly[:photoport_cms])
  end

  def user_service
    @user_service ||= UserService.resolve
  end

  def photo_presenter
    @photo_presenter ||= PhotoPresenter.resolve(url_helper: self)
  end

  def collection_presenter
    @collection_presenter ||= CollectionPresenter.resolve(url_helper: self)
  end
end
