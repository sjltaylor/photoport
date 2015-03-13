class AddPublicAccessToCollection < ActiveRecord::Migration
  def change
    change_table :collections do |t|
      t.boolean :enable_public_access
    end
  end
end
