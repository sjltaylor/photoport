class IdentitiesController < ApplicationController
  def identify
    identification_attempt = services.identify(identity: request_identity, credentials: params[:credentials].symbolize_keys)

    identity = identification_attempt[:identity]

    status_code = case(identification_attempt)
    when there_was_a_problem_with_the_credentials
      422
    when a_stranger_identified_themselves_successfully
      session[:identity_id] = identity.id
      201
    when an_existing_user_identified_themselves_successfully
      session[:identity_id] = identity.id
      200
    end

    payload = presenters.identification_attempt(identification_attempt)

    render status: status_code, json: payload
  end

  def sign_out
    session.delete :identity_id
    redirect_to :root
  end

  protected

  def a_stranger_identified_themselves_successfully
    -> (r) { !r[:error] && r[:new_identity] }
  end
  def there_was_a_problem_with_the_credentials
    -> (r) { r[:error] }
  end
  def an_existing_user_identified_themselves_successfully
    -> (r) { !r[:error] && !r[:new_identity] }
  end
end
