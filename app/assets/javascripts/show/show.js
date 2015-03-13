$(function () {
  var container = $('.photoport-container');

  var photoport = new Photoport({
    container: container[0],
    keyboardNavigationEnabled: true
  });

  var updateSize = function () {
    container.add('body').width(window.innerWidth).height(window.innerHeight);
    photoport.resize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  $(window).resize(updateSize);
  updateSize();

  $.ajax({
    dataType: 'json'
  }).done(function (collection) {
    window.title = collection.name;
    collection.photos.forEach(function (photo) {
      photoport.append({
        backgroundImage: photo.download
      });
    });
  });
})
