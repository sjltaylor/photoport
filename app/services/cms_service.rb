class CmsService
  depends_on :permissions_service

  def add_photo(context)
    file_key   = context[:file_key]
    collection = context[:collection]

    permissions_service.raise_unless_allowed(:add_photo, context)
    collection.photos.create(photo_uid: file_key).tap{|photo| photo.save!}
  end

  def show_default_data(context={})
    identity = context[:identity]
    identity.collections.create if identity.collections.empty?
    return identity.collections.first
  end

  def remove_photo(context)
    permissions_service.raise_unless_allowed(:remove_photo, context)
    context[:photo].destroy
  end
end