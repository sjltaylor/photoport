class LandingController < ApplicationController
  skip_before_filter :authenticate

  def index
    respond_to do |format|

      format.html do
        redirect_to(controller: :collections, action: :index)
      end

      format.json do
        payload  = presenters.landing(**services.show_default_data(identity: identity).merge(session_id: session.id))
        render json: payload
      end
    end
  end
end
