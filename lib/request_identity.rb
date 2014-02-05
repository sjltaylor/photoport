module RequestIdentity
  protected

  def request_identity
    identity_id = session[:identity_id]

    return Identity.find(identity_id) unless identity_id.blank?
    return identification_service.create_identity.tap do |new_identity|
      session[:identity_id] = new_identity.id
    end
  end
end