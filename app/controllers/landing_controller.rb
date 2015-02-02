class LandingController < ApplicationController
  skip_before_filter :authenticate

  def index
    respond_to do |format|

      format.html do
        collections = services.show_default_data(identity: identity)[:collections]
        redirect_to(controller: :collections, action: :new) and return if collections.blank?
        redirect_to collections.first
      end

      format.json do
        payload  = presenters.landing(**services.show_default_data(identity: identity).merge(session_id: session.id))
        render json: payload
      end
    end
  end
end
