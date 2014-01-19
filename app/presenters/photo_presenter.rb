class PhotoPresenter
  depends_on :url_helper

  def full(photo)
    {
      id: photo.id,
      url: url_helper.collection_photo_url(photo.collection, photo, format: :json),
      download: url_helper.collection_photo_url(photo.collection, photo, format: :jpg)
    }
  end
end