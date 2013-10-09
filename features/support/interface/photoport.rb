module Interface
  module Photoport
    def image
      attribute('background-image')
    end
  end

  def photoport
    find(:css, '.photoport-donkery').extend(Photoport)
  end
end