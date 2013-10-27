class CollectionsController < ApplicationController
  def new
    render(locals: {collection: collection_presenter.full(stored_user.collections.first)})
  end
end
