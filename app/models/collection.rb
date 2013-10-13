class Collection < ActiveRecord::Base
  has_many :photos, dependent: :destroy, autosave: true
  belongs_to :creator, class_name: 'User'
  validates :session_id, presence: true, unless: :creator_id?
  validates :creator_id, presence: true, unless: :session_id?
end
