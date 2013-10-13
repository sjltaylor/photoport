class CollectionsController < ApplicationController
  respond_to :json, only: :create

  def new
  end

  def create
    payload = cms.create_collection(session.id, current_user, params["file_key"])
    render json: payload
  end
end
