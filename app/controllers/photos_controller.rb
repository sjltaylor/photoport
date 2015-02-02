class PhotosController < ApplicationController
  respond_to :json, only: [:create, :destroy]

  def create
    photo = services.add_photo(
      identity: identity,
      collection: Collection.find(params[:collection_id]),
      file_key: params[:file_key])

    render json: presenters.photo(photo)
  end

  def show
    respond_to do |format|
      photo = Photo.find(params[:id])
      format.jpg do
        path = services.download_photo(identity: identity, photo: photo)
        send_file path, type: 'image/jpeg', disposition: 'inline', filename: "#{photo.id}.jpg"
      end
      format.json do
        render json: presenters.photo(photo)
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        services.remove_photo(identity: identity, photo: Photo.find(params[:id]))
        render json: {}
      end
    end
  end
end
