class CollectionsController < ApplicationController
  skip_filter :authenticate, only: [:show, :index]

  def index
    respond_to do |format|
      format.html do
        redirect_to(hello_path) and return if identity.stranger?
        application
      end
      format.json do
        payload  = presenters.landing(**services.show_default_data(identity: identity).merge(session_id: session.id))
        render json: payload
      end
    end
  end

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
        services.update_collection(identity: identity, collection: collection, updates: params.permit(:name, :allow_public_access))
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

  def edit
    application
  end

  def show
    respond_to do |format|
      result = services.show_collection(identity: identity, collection: Collection.find(params[:id]))

      format.html do
        redirect_to(:root) and return if result[:not_permitted]
      end

      format.json do
        render(status: result[:not_permitted], json: {}) and return if result[:not_permitted]
        render json: presenters.collection(result[:collection])
      end
    end
  end

  protected

  def collection
    @collection ||= identity.collections.find(params[:id])
  end
end
