(function () {

  function headers () {
    return {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    };
  }

  PhotoportCMS.server = {
    addPhoto: function (collection, fileKey) {
      return $.ajax({
        type: "POST",
        url: collection.get('add'),
        headers: headers(),
        data: { file_key: fileKey }
      });
    }
  };
})();