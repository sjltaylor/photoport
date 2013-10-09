(function () {

  function headers () {
    return {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    };
  }

  PhotoportCMS.server = {
    addPhoto: function (parameters) {
      var addPhotoEndpoint = PHOTOPORT_CMS.endpoints.addPhoto;
      return $.ajax({
        type: "POST",
        url: addPhotoEndpoint,
        headers: headers(),
        data: parameters
      });
    }
  };
})();