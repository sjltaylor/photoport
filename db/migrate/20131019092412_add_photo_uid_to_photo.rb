class AddPhotoUidToPhoto < ActiveRecord::Migration
  def change
    add_column :photos, :photo_uid, :string
  end
end
