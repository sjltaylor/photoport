class CollectionsController < ApplicationController
  def new
    respond_to do |format|
      format.html { render }
      format.json do
        identity = request_identity
        payload  = presenters.landing(**services.show_default_data(identity: request_identity).merge(identity: identity, session_id: session.id))
        render json: payload
      end
    end
  end
end
