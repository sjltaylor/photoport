class TestHooksController < ApplicationController
  before_filter :check_env

  def reset
    Identity.destroy_all
    redirect_to :root
  end

  def clear_session
    reset_session
    redirect_to :root
  end

  protected

  def check_env
    raise_error unless request.headers["REMOTE_HOST"] == '127.0.0.1'
    raise_error unless URI(request.headers["REQUEST_URI"]).host == "localhost"
    raise_error unless Rails.env.test? or Rails.env.development?
  end

  def raise_error
    raise 'wrong env'
  end
end
