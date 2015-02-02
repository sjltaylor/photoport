module ApplicationHelper

  def identity
    identity = super
    presenters.identity(identity)
  end

  def templates *args
    args.map do |template_name|
      render template: File.join('templates', template_name.to_s)
    end.join("\n").html_safe
  end

  protected

  def presenters
    @presenters ||= Services.from('app/presenters').resolve(url_helper: self)
  end

  def services
    @services ||= Services.from('app/services').resolve(
      dragonfly_photos_app: Dragonfly.app(:photoport_cms),
      url_helper: self).protect
  end
end
