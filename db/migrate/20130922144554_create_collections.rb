class CreateCollections < ActiveRecord::Migration
  def change
    create_table :collections do |t|
      t.references :creator
      t.string :session_id
      t.string :name

      t.timestamps
    end

    add_index :collections, :session_id
  end
end
