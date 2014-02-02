class CreateIdentities < ActiveRecord::Migration
  def change
    create_table(:identities) do |t|
      t.string :email_address
      t.string :password_hash

      t.timestamps
    end

    add_index :identities, :email_address, unique: true
  end
end
