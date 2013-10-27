class CollectionPresenter
  depends_on :url_helper, :photo_presenter

  def full(collection)
    {
      id: collection.id,
      photos: collection.photos.map{|p| photo_presenter.full(p)},
      add: url_helper.collection_photos_url(collection)
    }
  end
end