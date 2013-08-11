PhotoportCMS.module('UploadPanel', function (UploadPanel, PhotoportCMS, Backbone, Marionette, $, _) {

  var uploadFilesToS3 = function (files) {

    var config     = AWS_S3_UPLOAD_PANEL_CONFIG;
    var uploadData = config["upload_form_data"];

    function onDone(){
      console.warn("DONE!", arguments);
    }

    function onFail(){
      console.warn("FAILED!", arguments);
    }

    var deferreds = [];

    function addUploadDataToFormData (formData, key) {
      formData.append(key, uploadData[key]);
    }

    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      var formData = new FormData();

      Object.keys(uploadData).forEach(addUploadDataToFormData.bind(this, formData));

      formData.append("Content-Type", file.type);
      formData.append("file", file);

      deferreds.push(jQuery.ajax({
        url: config.url,
        type: "POST",
        data: formData,
        cache: false,
        contentType: false,
        processData: false
      }));
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