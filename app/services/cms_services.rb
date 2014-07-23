module CmsServices
  def add_photo(identity:, file_key:, collection:)
    collection.photos.create(photo_uid: file_key).tap{|photo| photo.save!}
  end

  def create_collection(identity:, name: nil)
    identity.collections.create(name: name)
  end

  def show_default_data(identity:)
    create_collection(identity: identity) if identity.collections.empty?
    {
      collections: identity.collections,
      identity: identity
    }
  end

  def remove_photo(identity:, photo:)
    photo.destroy
  end
end
