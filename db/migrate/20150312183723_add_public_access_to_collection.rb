class AddPublicAccessToCollection < ActiveRecord::Migration
  def change
    change_table :collections do |t|
      t.boolean :allow_public_access
    end
  end
end
