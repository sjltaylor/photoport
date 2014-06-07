class CollectionsController < ApplicationController
  def start
    respond_to do |format|
      format.json do
        identity = request_identity
        payload  = presenters.landing(**services.show_default_data(identity: identity).merge(identity: identity, session_id: session.id))
        render json: payload
      end
    end
  end

  def new
    application
  end

  def index
    application
  end
end
