class PermissionsService
  class NotAllowed < StandardError; end

  def download_photo?(context)
    identity = context[:identity]
    photo    = context[:photo]

    identity == photo.collection.creator
  end

  def add_photo?(context)
    identity   = context[:identity]
    collection = context[:collection]

    identity == collection.creator
  end

  def remove_photo?(context)
    identity = context[:identity]
    photo    = context[:photo]

    identity == photo.creator
  end

  def raise_unless_allowed(operation, context)
    raise NotAllowed unless send("#{operation}?", context)
    return context
  end
end