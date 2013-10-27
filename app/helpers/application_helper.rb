module ApplicationHelper

  def photoport_cms_user
    {
      'userId'    => user_signed_in? ? current_user.id : nil,
      'sessionId' => session.id
    }
  end

  def templates *args
    args.map do |template_name|
      render template: File.join('templates', template_name.to_s)
    end.join("\n").html_safe
  end
end
