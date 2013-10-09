if ENV['SERVER_ROOT_URL'].nil?
  raise 'SERVER_ROOT_URL environment variable required but not set.'
end

SERVER_ROOT_URL = ENV['SERVER_ROOT_URL']

puts "Integration specs running against '#{SERVER_ROOT_URL}'"

module Routes
  extend self

  module DSL
    extend self
    def routes
      Routes
    end
  end

  def server_url_for *path_segments
    File.join(SERVER_ROOT_URL, *path_segments)
  end
end

RSpec.configure do |config|
  config.include Routes::DSL
end