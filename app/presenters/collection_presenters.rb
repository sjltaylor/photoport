module CollectionPresenters
  depends_on :url_helper

  def collection(collection)
    {
      id: collection.id,
      photos: collection.photos.map{|p| photo(p)},
      add: url_helper.collection_photos_url(collection)
    }
  end

  def photo(photo)
    {
      id: photo.id,
      url: url_helper.collection_photo_url(photo.collection, photo, format: :json),
      download: url_helper.collection_photo_url(photo.collection, photo, format: :jpg)
    }
  end
end