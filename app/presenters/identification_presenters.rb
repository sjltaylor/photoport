module IdentificationPresenters
  depends_on :url_helper

  def identity(identity)
    p = {
      status: identity.status,
      identify: url_helper.identify_url(format: :json),
      goodbye: url_helper.goodbye_url(format: :json)
    }

    p[:email_address] = identity.email_address if identity.identified?

    p
  end

  def identification_attempt(identification_attempt_result)
    unless identification_attempt_result[:identity].nil?
      identity = self.identity(identification_attempt_result[:identity])
    end
    identification_attempt_result.slice(:error, :message, :new_identity).merge({
      identity: identity
    })
  end
end
