class Collection < ActiveRecord::Base
  has_many :photos, dependent: :destroy, autosave: true
  belongs_to :creator, class_name: 'Identity'
  validates :creator, presence: true
end
