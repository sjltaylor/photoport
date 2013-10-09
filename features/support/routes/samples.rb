module Routes
  def sample name
    server_url_for('samples', name.to_s)
  end
end