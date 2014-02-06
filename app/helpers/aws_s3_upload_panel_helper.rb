require 'base64'
require 'ostruct'

module AwsS3UploadPanelHelper
  def aws_s3_upload_panel
    @aws_s3_upload_panel ||= AwsS3UploadPanelConfiguration.new(session)
  end

  class AwsS3UploadPanelConfiguration
    include RequestIdentity
    attr_accessor :session

    def initialize(session)
      self.session = session
    end

    def policy
      {
        # make sure the expiration time is in exactly the format used by AWS S3
        expiration: (DateTime.now.utc + 1.day).strftime('%FT%T.000Z'),
        conditions: [
          {acl: 'bucket-owner-full-control'},
          {bucket: s3.bucket_name},
          # without these conditions in place, S3 returns a 403
          ['starts-with', '$Content-Type', 'image/'],
          ['starts-with', '$key', 'ul/']
        ]
      }
    end

    def encode_policy(policy)
      Base64.strict_encode64(JSON.dump(policy).encode('UTF-8'))
    end

    def signature(encoded_policy)
      Base64.strict_encode64(OpenSSL::HMAC.digest('SHA1',  s3.secret_access_key.encode('UTF-8'), encoded_policy))
    end

    def config
      encoded_policy = encode_policy(self.policy)
      signature      = signature(encoded_policy)

      {
        'url' => "http://#{s3.bucket_name}.s3.amazonaws.com",
        'upload_form_data' => {
          'key'            => upload_key,
          'acl'            => 'bucket-owner-full-control',
          'AWSAccessKeyId' => s3.access_key_id,
          'signature'      => signature,
          'policy'         => encoded_policy
        }
      }
    end

    protected
    def upload_key
      if request_identity.identified?
        "ul/user/#{request_identity.id}"
      else
        "ul/session/#{session.id}"
      end
      .concat('/{fileKey}')
    end
    def s3
      @s3 ||= AWS_CONFIG.photos
    end
  end
end