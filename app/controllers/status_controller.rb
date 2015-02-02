class StatusController < ApplicationController
  skip_before_filter :authenticate
  def index
    head 200
  end
end
