class PhotosController < ApplicationController
  respond_to :json, only: [:create, :destroy]

  def create
    photo = cms_service.add_photo(
      identity: request_identity,
      collection: Collection.find(params[:collection_id]),
      file_key: params[:file_key])

    render json: collection_presenter.photo(photo)
  end

  def show
    respond_to do |format|
      photo = Photo.find(params[:id])
      format.jpg do
        path = browsing_service.download_photo(identity: request_identity, photo: photo)
        send_file path, type: 'image/jpeg', disposition: 'inline', filename: "#{photo.id}.jpg"
      end
      format.json do
        render json: collection_presenter.photo(photo)
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        cms_service.remove_photo(identity: request_identity, photo: Photo.find(params[:id]))
        render json: {}
      end
    end
  end
end
