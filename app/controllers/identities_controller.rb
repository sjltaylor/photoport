class IdentitiesController < ApplicationController
  def create
    identification_attempt = services.identify(identity: request_identity, credentials: params[:credentials].symbolize_keys)

    status_code = case(identification_attempt)
    when there_was_a_problem_with_the_credentials
      422
    when a_stranger_identified_themselves_successfully
      201
    when an_existing_user_identified_themselves_successfully
      200
    end

    payload = presenters.identification_attempt(identification_attempt)

    render status: status_code, json: payload
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
