module Presenters
  protected

  def photo_presenter
    @photo_presenter ||= PhotoPresenter.resolve(url_helper: self)
  end

  def collection_presenter
    @collection_presenter ||= CollectionPresenter.resolve(url_helper: self)
  end

  def identification_presenter
    @identification_presenter ||= IdentificationPresenter.resolve(url_helper: self)
  end
end