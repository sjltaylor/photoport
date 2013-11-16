class PhotoPresenter
  depends_on :url_helper

  def full(photo)
    {
      id: photo.id,
      download: url_helper.collection_photo_url(photo.collection, photo, format: :jpg)
    }
  end
end