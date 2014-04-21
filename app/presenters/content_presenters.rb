module ContentPresenters
  depends_on :url_helper

  def collection(collection)
    {
      id:     collection.id,
      photos: collection.photos.map{|p| photo(p)},
      add:    url_helper.collection_photos_url(collection)
    }
  end

  def photo(photo)
    {
      id:       photo.id,
      url:      url_helper.collection_photo_url(photo.collection, photo, format: :json),
      download: url_helper.collection_photo_url(photo.collection, photo, format: :jpg)
    }
  end

  def landing(collection:, identity:, session_id:)
    {
      collection:          self.collection(collection),
      identity:            self.identity(identity),
      upload_panel_config: aws_s3_upload_panel_config(identity: identity, session_id: session_id)
    }
  end
end