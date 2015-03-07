class LandingController < ApplicationController
  skip_before_filter :authenticate, only: :start

  def index
    respond_to do |format|
      format.html do
        application
      end
    end
  end
  def start
    respond_to do |format|
      format.json do
        payload  = presenters.landing(**services.show_default_data(identity: identity).merge(session_id: session.id))
        render json: payload
      end
    end
  end
end
