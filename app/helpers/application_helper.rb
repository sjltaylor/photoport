require 'base64'
require 'ostruct'

module ApplicationHelper

  AWS_S3_ACCESS_SECRET = 'vi4pgymqfmRoEIhUupSMfL+182SFuuC6QIGWHVZV'.encode('UTF-8').freeze

  def aws_s3_authentication
    OpenStruct.new.tap do |auth|
      expiration = (DateTime.now.utc + 1.day).strftime('%FT%T.000Z')
      auth.policy = Base64.strict_encode64(JSON.dump({
        expiration: expiration,
        conditions: [
          {acl: 'bucket-owner-full-control'},
          {bucket: 'photoport-eu'},
          ['starts-with', '$Content-Type', 'image/'],
          ['starts-with', '$key', 'sessions/']
        ]
      }).encode('UTF-8'))

      auth.signature = Base64.strict_encode64(OpenSSL::HMAC.digest('SHA1', AWS_S3_ACCESS_SECRET, auth.policy))
    end
  end

  def aws_s3_upload_json
    auth = aws_s3_authentication
    {
      'url' => 'http://photoport-eu.s3.amazonaws.com',
      'upload_form_data' => {
        'key'            => "sessions/#{request.session_options[:id]}/image-${filename}",
        'acl'            => 'bucket-owner-full-control',
        'AWSAccessKeyId' => 'AKIAIYDT4S7DNGAO7DQA',
        'signature'      => auth.signature,
        'policy'         => auth.policy
      }
    }.to_json.html_safe
  end

  def templates *args
    args.map do |template_name|
      render template: File.join('templates', template_name.to_s)
    end.join("\n").html_safe
  end
end
