class TestHooksController < ApplicationController
  def reset
    return root unless request.headers["REMOTE_HOST"] == '127.0.0.1'
    return root unless URI(request.headers["REQUEST_URI"]).host == "localhost"
    Identity.destroy_all
    return root
  end

  protected
  def root
    redirect_to :root
  end
end
