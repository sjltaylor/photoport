class CollectionsController < ApplicationController  
  def create
    respond_to do |format|
      format.json do
        payload  = presenters.collection(services.create_collection(identity: identity, name: params[:name]))
        render json: payload
      end
    end
  end

  def show
    application
  end

  def new
    application
  end
end
