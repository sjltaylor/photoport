class BrowsingService

  depends_on :dragonfly_photos_app, :permissions_service

  # prepares a photo as a jpeg file for download and returns it's path
  # Context:
  #   * `session_id` (required)
  #   * `user`
  #   * `photo` (required)
  def download_photo(context)
    permissions_service.raise_unless_allowed(:download_photo, context)
    dragonfly_photos_app.fetch(context[:photo].photo_uid).thumb('600x').encode('jpg').file.path
  end
end
