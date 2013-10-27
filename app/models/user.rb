class User < ActiveRecord::Base
  include AASM

  # TODO: list...
  #
  # * user should have email and password if they are registered
  # * when a user completed the sign up form and any confirmation email they should become registered? => true
  #

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :validatable
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :trackable, :confirmable

  has_many :collections, foreign_key: :creator_id

  aasm(column: :status) do
    state :stranger, initial: true
    state :registered

    event :register do
      transitions from: :stranger, to: :registered
    end
  end
end
