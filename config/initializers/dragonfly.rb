require 'dragonfly/rails/images'
require_relative 'aws' unless Kernel.const_defined? :AWS_CONFIG

Dragonfly[:photoport_cms].configure_with(:imagemagick).tap do |app|
  app.datastore =  Dragonfly::DataStorage::S3DataStore.new(AWS_CONFIG.photos.to_hash.slice(:bucket_name, :access_key_id, :secret_access_key, :region))
  app.configure do |c|
    c.url_format = '/photos/:job/:basename.:format'
  end
  app.define_macro(ActiveRecord::Base, :image_accessor)
end
