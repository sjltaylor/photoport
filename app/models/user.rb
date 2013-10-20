class User < ActiveRecord::Base
  include AASM

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :trackable, :confirmable, :validatable

  has_many :collections

  aasm(column: :status) do
    state :stranger, initial: true
    state :registered

    event :register do
      transitions from: :stranger, to: :registered
    end
  end
end
