PhotoportCMS = new Marionette.Application();

PhotoportCMS.addRegions({
  mainRegion: "#main"
});

PhotoportCMS.on('initialize:after', function(){
  if (Backbone.history) {
    Backbone.history.start();
  }
});