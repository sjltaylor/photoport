class ApplicationController < ActionController::Base
  protect_from_forgery

  include RequestIdentity

  rescue_from ActionController::RoutingError, :with => :render_404 unless Rails.env.development?
  rescue_from ActiveRecord::RecordNotFound  , :with => :render_404

  if Rails.env.development?
    rescue_from Sentry::NotAllowed, :with => :render_403
  else
    rescue_from Sentry::NotAllowed, :with => :render_404
  end

  def render_404
    render status: :not_found, template: '404'
  end

  def render_403
    Rails.logger.info($!.inspect)
    head status: :forbidden
  end

  protected

  def services
    @services ||= Sentry.new(
      Services.from('app/services').resolve(
        dragonfly_photos_app: Dragonfly.app(:photoport_cms),
        url_helper: self))
  end

  def presenters
    @presenters ||= Services.from('app/presenters').resolve(url_helper: self)
  end

  def application
    respond_to do |format|
      format.html { render 'collections/app' }
    end
  end
end
