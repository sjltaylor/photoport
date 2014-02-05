class CollectionsController < ApplicationController
  def new
    render(locals: {collection: collection_presenter.collection(cms_service.show_default_data(identity: request_identity))})
  end
end
