class CmsService

  depends_on :collection_presenter, :photo_presenter

  def create_collection session_id, user, file_key_of_first_photo
    collection = if user.nil?
      Collection.create(session_id: session_id)
    else
      user.collections.create
    end

    add_photo(collection, file_key_of_first_photo) unless file_key_of_first_photo.nil?

    return collection_presenter.full(collection)
  end

  def add_photo collection, file_key
    photo_presenter.full(collection.photos.create(file_key: file_key))
  end
end