module PermissionsServices
  extend Sentry::PermissionsDsl

  def allow_download_photo?(identity:, photo:)
    identity == photo.collection.creator
  end

  def allow_add_photo?(identity:, collection:, file_key:)
    identity == collection.creator
  end

  def allow_remove_photo?(identity:, photo:)
    identity == photo.creator
  end

  def allow_update_collection?(identity:, collection:, updates:)
    identity == collection.creator
  end

  def allow_destroy_collection?(identity:, collection:)
    identity == collection.creator
  end

  allow :create_identity
  allow :show_default_data
  allow :lookup_identity
  allow :identify
  allow :create_collection
  allow :show_collection
end
