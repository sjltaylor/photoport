class IdentificationPresenter
  depends_on :url_helper

  def identity(identity)
    {
      status: identity.status,
      identify: url_helper.identify_url
    }
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