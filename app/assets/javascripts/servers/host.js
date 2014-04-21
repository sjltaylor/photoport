(function () {

  function headers () {
    return {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    };
  }

  PhotoportCMS.host = {
    photos: {
      create: function (collection, fileKey) {
        return $.ajax({
          type: "POST",
          url: collection.get('add'),
          headers: headers(),
          data: { file_key: fileKey },
          dataType: 'json',
          cache: false
        });
      },
      remove: function (photo) {
        return $.ajax({
          type: "DELETE",
          url: photo.get('url'),
          headers: headers(),
          dataType: 'json',
          cache: false
        });
      }
    },
    landing: function () {
      return $.ajax({
        type: "GET",
        url: '/start.json',
        headers: headers(),
        dataType: 'json',
        cache: false
      });
    },
    users: {
      identify: function (user, credentials) {
        return $.ajax({
          type: "POST",
          url: user.get('identify'),
          headers: headers(),
          data: { credentials: credentials },
          dataType: 'json',
          cache: false
        });
      }
    }
  };
})();
