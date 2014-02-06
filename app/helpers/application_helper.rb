module ApplicationHelper
  include Services
  include Presenters
  include RequestIdentity

  def request_identity
    request_identity = super
    identification_presenter.identity(request_identity)
  end

  def templates *args
    args.map do |template_name|
      render template: File.join('templates', template_name.to_s)
    end.join("\n").html_safe
  end
end
