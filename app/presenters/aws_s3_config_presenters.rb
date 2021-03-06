module AwsS3ConfigPresenters
  depends_on :aws_config

  def aws_s3_upload_panel_config(identity:, session_id:)
    encoded_policy = encode_policy(policy)
    signature      = self.signature(encoded_policy)
    aws_config     = self.aws_config

    {
      'url' => "http://#{aws_config.bucket_name}.s3.amazonaws.com",
      'upload_form_data' => {
        'key'            => s3_upload_key(identity: identity, session_id: session_id),
        'acl'            => 'bucket-owner-full-control',
        'AWSAccessKeyId' => aws_config.access_key_id,
        'signature'      => signature,
        'policy'         => encoded_policy
      }
    }
  end

  protected

  def policy
    {
      # make sure the expiration time is in exactly the format used by AWS S3
      expiration: (DateTime.now.utc + 1.day).strftime('%FT%T.000Z'),
      conditions: [
        {acl: 'bucket-owner-full-control'},
        {bucket: aws_config.bucket_name},
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
    Base64.strict_encode64(OpenSSL::HMAC.digest('SHA1',  aws_config.secret_access_key.encode('UTF-8'), encoded_policy))
  end

  def s3_upload_key(identity:, session_id:)
    if identity.identified?
      "ul/user/#{identity.id}"
    else
      "ul/session/#{session_id}"
    end
    .concat('/{fileKey}')
  end
end
