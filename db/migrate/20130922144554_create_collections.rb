class CreateCollections < ActiveRecord::Migration
  def change
    create_table :collections do |t|
      t.references :creator
      t.string :name

      t.timestamps
    end
  end
end
