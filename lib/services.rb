module Services
  protected

  def cms_service
    @cms_service ||= CmsService.resolve
  end

  def browsing_service
    @browsing_service ||= BrowsingService.resolve(dragonfly_photos_app: Dragonfly[:photoport_cms])
  end

  def user_service
    @user_service ||= UserService.resolve
  end
end