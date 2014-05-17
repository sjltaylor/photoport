(function () {

  Collections.s3 = {
    uploadPhotos: function (config, files) {
      var uploadData = config["upload_form_data"];

      var promises = [];

      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        var sanitizedFilename = file.name.replace(/[^\w]*/g, '');
        var fileExtension     = ''.concat(/(?:\.([^.]+))?$/.exec(file.name)[1]).toLowerCase();

        var fileKey = [
          sanitizedFilename,
          file.lastModifiedDate.valueOf(),
          new Date().valueOf(),
          fileExtension
        ].join('.');

        fileKey = uploadData['key'].replace('{fileKey}', fileKey);

        var formData = new FormData();

        formData.append('key',            fileKey);
        formData.append('acl',            uploadData['acl']);
        formData.append('AWSAccessKeyId', uploadData['AWSAccessKeyId']);
        formData.append('signature',      uploadData['signature']);
        formData.append('policy',         uploadData['policy']);
        formData.append("Content-Type",   file.type);
        formData.append("file",           file);

        deferred = jQuery.ajax({
          url: config.url,
          type: "POST",
          data: formData,
          cache: false,
          contentType: false,
          processData: false
        });

        deferred.CollectionsMetadata = { fileKey: fileKey };
        promises.push(deferred.promise());
      }

      return promises;
    }
  };
})();


