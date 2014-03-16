module BrowsingServices

  depends_on :dragonfly_photos_app

  # prepares a photo as a jpeg file for download and returns it's path
  # Context:
  #   * `session_id` (required)
  #   * `user`
  #   * `photo` (required)
  def download_photo(identity:, photo:)
    dragonfly_photos_app.fetch(photo.photo_uid).thumb('600x').encode('jpg').file.path
  end
end
