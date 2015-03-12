module CmsServices
  def add_photo(identity:, file_key:, collection:)
    collection.photos.create(photo_uid: file_key).tap{|photo| photo.save!}
  end

  def create_collection(identity:, name: nil)
    identity.collections.create(name: name)
  end

  def update_collection(identity:, collection:, updates:)
    collection.update(updates)
    collection
  end

  def destroy_collection(identity:, collection:)
    collection.destroy
    nil
  end

  def show_default_data(identity:)
    stranger_data = {
      identity: identity
    }

    return stranger_data if identity.stranger?

      stranger_data.merge(collections: identity.collections)
  end

  def remove_photo(identity:, photo:)
    photo.destroy
  end
end
