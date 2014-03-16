class CollectionsController < ApplicationController
  def new
    render(locals: {collection: presenters.collection(services.show_default_data(identity: request_identity))})
  end
end
