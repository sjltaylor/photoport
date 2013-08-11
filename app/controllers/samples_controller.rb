class SamplesController < ApplicationController
  def show
    render params[:sample_name]
  end
end