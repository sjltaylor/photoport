class ApplicationController < ActionController::Base
  protect_from_forgery

  def cms
    @cms ||= CmsService.resolve
  end
end
