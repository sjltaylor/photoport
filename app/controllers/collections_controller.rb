class CollectionsController < ApplicationController
  def new
    render(locals: {collection: collection_presenter.full(user_service.show_default_data(user: stored_user))})
  end
end
