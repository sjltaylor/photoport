class CollectionsController < ApplicationController
  def create
    respond_to do |format|
      format.json do
        payload  = presenters.collection(services.create_collection(identity: identity, name: params[:name]))
        render json: payload
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        services.update_collection(identity: identity, collection: collection, updates: params.permit(:name))
        render json: {}
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        services.destroy_collection(identity: identity, collection: collection)
        render json: {}
      end
    end
  end

  def show
    application
  end

  protected

  def collection
    @collection ||= identity.collections.find(params[:id])
  end
end
