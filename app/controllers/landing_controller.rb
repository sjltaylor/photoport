class LandingController < ApplicationController
  def index
    redirect_to collections_path
  end
end
