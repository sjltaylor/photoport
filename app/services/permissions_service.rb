class PermissionsService
  class NotAllowed < StandardError; end

  def download_photo?(context)
    user  = context[:user]
    photo = context[:photo]

    user == photo.collection.creator
  end

  def add_photo?(context)
    user       = context[:user]
    collection = context[:collection]

    user == collection.creator
  end

  def remove_photo?(context)
    user  = context[:user]
    photo = context[:photo]

    user == photo.creator
  end

  def raise_unless_allowed(operation, context)
    raise NotAllowed unless send("#{operation}?", context)
    return context
  end
end