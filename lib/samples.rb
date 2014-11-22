class Samples

  def single_id
    raise 'more than one identity' if Identity.count > 1
    raise 'no identity' if Identity.count == 0
    identity = Identity.first

    image_files = Dir["../samples/furry/*.jpg"]

    s3 = AWS::S3.new
    bucket = s3.buckets[AWS_CONFIG.bucket_name]

    keys = []

    image_files.each_with_index do |file, i|
      key = "samples/furry_#{i}.jpg"
      keys << key
      obj = bucket.objects[key]
      obj.write(file: file)
    end

    4.times do
      collection = services.create_collection(identity: identity)
      keys.each do |key|
        services.add_photo(identity: identity, collection: collection, file_key: key)
      end
    end
  end

  def services
    Services.from('app/services').resolve(
      dragonfly_photos_app: Dragonfly.app(:photoport_cms),
      aws_config: AWS_CONFIG,
      url_helper: self)
  end
end
