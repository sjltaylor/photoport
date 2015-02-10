class Identity < ActiveRecord::Base
  include AASM

  has_many :collections, foreign_key: :creator_id, dependent: :destroy

  aasm(column: :status) do
    state :anonymous, initial: true
    state :identified

    event :identify do
      transitions from: [:anonymous, :identified], to: :identified
    end
  end

  def email_address=(email_address)
    email_address.strip!
    super
  end

  def stranger?
    new_record?
  end

  def self.find_by_email_address(email_address)
    where("lower(email_address) = lower(?)", email_address).first
  end
end
