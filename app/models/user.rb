class User < ActiveRecord::Base
  include AASM

  has_many :collections, foreign_key: :creator_id

  aasm(column: :status) do
    state :stranger, initial: true
    state :registered

    event :register do
      transitions from: :stranger, to: :registered
    end
  end

  def email_address=(email_address)
    email_address.strip!
    super
  end

  def self.find_by_email_address(email_address)
    User.where("lower(email_address) = lower(?)", email_address).first
  end
end
