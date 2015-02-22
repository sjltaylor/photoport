class ApplicationController < ActionController::Base
  before_filter :authenticate

  protect_from_forgery

  rescue_from ActionController::RoutingError, :with => :render_404 unless Rails.env.development?
  rescue_from ActiveRecord::RecordNotFound  , :with => :render_404

  if Rails.env.development?
    rescue_from Sentry::NotAllowed, :with => :render_403
  else
    rescue_from Sentry::NotAllowed, :with => :render_404
  end

  def render_404
    respond_to do |format|
      format.html { render status: :not_found, template: '404' }
      format.all  { render status: :not_found, nothing: true }
    end
  end

  def render_403
    Rails.logger.info($!.inspect)
    head status: :forbidden
  end

  protected

  def identity
    @identity ||= services.lookup_identity(id: session[:identity_id])
  end

  def authenticate
    if identity.stranger?
      respond_to do |format|
        format.html { redirect_to hello_path  }
        format.json { render nothing: true, status: 401  }
      end
    end
  end

  def services
    @services ||= Sentry.new(
      Services.from('app/services').resolve(
        dragonfly_photos_app: Dragonfly.app(:photoport_cms),
        url_helper: self))
  end

  def presenters
    @presenters ||= Services.from('app/presenters').resolve(
      url_helper: self,
      aws_config: AWS_CONFIG)
  end

  def application
    respond_to do |format|
      format.html { render 'collections/app' }
    end
  end
end
