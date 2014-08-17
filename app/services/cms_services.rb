module CmsServices
  def add_photo(identity:, file_key:, collection:)
    collection.photos.create(photo_uid: file_key).tap{|photo| photo.save!}
  end

  def create_collection(identity:, index_geometry:, name: nil )
    identity.collections.create(name: name, index_geometry: index_geometry)
  end

  def show_default_data(identity:)
    {
      collections: identity.collections,
      identity: identity
    }
  end

  def remove_photo(identity:, photo:)
    photo.destroy
  end
end
