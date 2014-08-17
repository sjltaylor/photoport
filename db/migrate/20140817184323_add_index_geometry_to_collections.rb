class AddIndexGeometryToCollections < ActiveRecord::Migration
  def change
    add_column :collections, :index_geometry, :text
  end
end
