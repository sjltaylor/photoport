module ContentPresenters
  depends_on :url_helper

  def collection(collection)
    {
      id:     collection.id,
      photos: collection.photos.map{|p| photo(p)},
      add:    url_helper.collection_photos_url(collection, format: :json),
      show:   url_helper.collection_path(collection)
    }
  end

  def photo(photo)
    {
      id:       photo.id,
      url:      url_helper.collection_photo_url(photo.collection, photo, format: :json),
      download: url_helper.collection_photo_url(photo.collection, photo, format: :jpg)
    }
  end

  def landing(collections:, identity:, session_id:)
    {
      collections:         collections.map{|collection| self.collection(collection)},
      identity:            self.identity(identity),
      index:               url_helper.root_path,
      upload_panel_config: aws_s3_upload_panel_config(identity: identity, session_id: session_id)
    }
  end
end
