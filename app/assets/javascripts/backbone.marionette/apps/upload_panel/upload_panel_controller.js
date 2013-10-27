PhotoportCMS.module('UploadPanel', function (UploadPanel, PhotoportCMS, Backbone, Marionette, $, _) {

  var uploadFilesToS3 = function (collection, files) {

    var config     = PHOTOPORT_CMS.uploadPanelConfig;
    var uploadData = config["upload_form_data"];

    function onDone(data, statusText, jqXHR){
      console.warn("DONE!", arguments);
      var uploadedFileKey = jqXHR.photoportCmsMetadata.uploadedFileKey;

      PhotoportCMS.server.addPhoto(collection, uploadedFileKey).success(function (data) {
        console.warn("CALLED SERVER WITH KEY: ", uploadedFileKey, arguments);
        console.warn("SERVER RESPONSE:", data);
      }).fail(function () {
        console.warn("FAILED CALL TO SERVER", arguments);
      });
    }

    function onFail(data, statusText, jqXHR) {
      console.warn("FAILED!", arguments);
    }

    var deferreds = [];

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

      var formData = new FormData();

      formData.append('key',            uploadData['key'].replace('{fileKey}', fileKey));
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

      deferred.photoportCmsMetadata = { uploadedFileKey: fileKey };
      deferreds.push(deferred);
    }

    jQuery.when.apply(null, deferreds).done(onDone).fail(onFail);
  };

  UploadPanel.Controller = {
    makeView: function (collection) {
      var uploadPanel = new UploadPanel.View();
      uploadPanel.on("files:selected", function (files) {
        uploadFilesToS3(collection, files);
      });
      return uploadPanel;
    }
  };
});