class AwsConfig < Blobject; end

AWS_CONFIG = AwsConfig.new(YAML.load_file(Rails.root.join('config/aws.yml'))[Rails.env]).freeze
