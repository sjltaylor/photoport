module Presenters
  protected

  def photo_presenter
    @photo_presenter ||= PhotoPresenter.resolve(url_helper: self)
  end

  def collection_presenter
    @collection_presenter ||= CollectionPresenter.resolve(url_helper: self)
  end

  def user_presenter
    @user_presenter ||= UserPresenter.resolve(url_helper: self)
  end
end