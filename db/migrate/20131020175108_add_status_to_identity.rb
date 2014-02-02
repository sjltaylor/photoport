class AddStatusToIdentity < ActiveRecord::Migration
  def change
    add_column :identities, :status, :string
  end
end
