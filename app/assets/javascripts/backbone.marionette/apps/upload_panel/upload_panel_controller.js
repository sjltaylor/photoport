PhotoportCMS.module('UploadPanel', function (UploadPanel, PhotoportCMS, Backbone, Marionette, $, _) {

  function S3Upload () {

  }

  var uploadFilesToS3 = function (files) {

    var config     = AWS_S3_UPLOAD_PANEL_CONFIG;
    var uploadData = config["upload_form_data"];

    function onDone(data, statusText, jqXHR){
      console.warn("DONE!", arguments);
      var uploadedFileKey = jqXHR.photoportCmsMetadata.uploadedFileKey;

      PhotoportCMS.server.addPhoto({ 'file_key': uploadedFileKey }).done(function () {
        console.warn("CALLED SERVER WITH KEY: ", uploadedFileKey, arguments);
      }).fail(function () {
        console.warn("FAILED CALL TO SERVER", arguments);
      });
    }

    function onFail(data, statusText, jqXHR){
      console.warn("FAILED!", arguments);
    }

    var deferreds = [];

    function addUploadDataToFormData (formData, key) {
      formData.append(key, uploadData[key]);
    }

    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      var sanitizedFilename = file.name.replace(/[^\w]*/g, '');
      var fileKey = [window.PHOTOPORT_CMS.userId, sanitizedFilename, file.lastModifiedDate.valueOf(), (new Date().valueOf())].join('-');

      var formData = new FormData();

      Object.keys(uploadData).forEach(addUploadDataToFormData.bind(this, formData));

      formData.append("Content-Type", file.type);
      formData.append("file", file);

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
    makeView: function () {
      var uploadPanel = new UploadPanel.View();
      uploadPanel.on("files:selected", function (files) {
        uploadFilesToS3(files);
      });
      return uploadPanel;
    }
  };
});