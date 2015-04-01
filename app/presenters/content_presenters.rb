module ContentPresenters
  depends_on :url_helper

  def collection(collection)
    name = collection.name
    name = "collection #{collection.id}" if name.blank?

    {
      id:                   collection.id,
      name:                 name,
      photos:               collection.photos.map{|p| photo(p)},
      add:                  url_helper.collection_photos_url(collection, format: :json),
      href:                 url_helper.collection_path(collection),
      edit:                 url_helper.edit_collection_path(collection),
      edit_photos:          url_helper.collection_edit_photos_path(collection),
      allow_public_access: collection.allow_public_access
    }
  end

  def photo(photo)
    {
      id:       photo.id,
      url:      url_helper.collection_photo_url(photo.collection, photo, format: :json),
      download: url_helper.collection_photo_url(photo.collection, photo, format: :jpg)
    }
  end

  def landing(collections: [], identity:, session_id:)
    presentation = {
      identity:            self.identity(identity),
      index:               url_helper.collections_path
    }

    return presentation if identity.stranger?

    presentation.merge({
      collections:         collections.map{|collection| self.collection(collection)},
      add:                 url_helper.collections_path(format: :json),
      upload_panel_config: aws_s3_upload_panel_config(identity: identity, session_id: session_id)
    })
  end
end
