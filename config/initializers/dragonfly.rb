require 'dragonfly'

# Configure
Dragonfly.app(:photoport_cms).configure do
  plugin :imagemagick

  protect_from_dos_attacks true
  secret "f1dd3faa33f429028826267884db7fa806afe844b8e88cb6f100a486169ea8d8"

  url_format '/photos/:job/:name.:format'

  datastore(:s3, AWS_CONFIG.photos.to_hash.slice(:bucket_name, :access_key_id, :secret_access_key, :region))
end

# Logger
Dragonfly.logger = Rails.logger

# Mount as middleware
Rails.application.middleware.use Dragonfly::Middleware, :photoport_cms

# Add model functionality
if defined?(ActiveRecord::Base)
  ActiveRecord::Base.extend Dragonfly::Model
  ActiveRecord::Base.extend Dragonfly::Model::Validations
end
