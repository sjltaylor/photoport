class Photo < ActiveRecord::Base
  belongs_to :collection

  image_accessor :photo

  validates :photo_uid, presence: true
  validates :collection, presence: true

  def creator
    collection.creator
  end
end
