class Photo < ActiveRecord::Base
  extend Dragonfly::Model

  belongs_to :collection

  dragonfly_accessor :photo, app: :photoport_cms

  validates :photo_uid, presence: true
  validates :collection, presence: true

  def creator
    collection.creator
  end
end
