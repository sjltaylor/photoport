module RequestIdentity
  protected

  def request_identity
    identity_id = session[:identity_id]
    identity    = Identity.find_by_id(identity_id) unless identity_id.blank?

    return identity unless identity.blank?

    return services.create_identity.tap do |new_identity|
      session[:identity_id] = new_identity.id
    end
  end
end
