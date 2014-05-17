//= require application
//= require ./collections
//= require_tree ./servers
//= require_tree ./backbone.marionette

Collections.addRegions({
  mainRegion: "#main"
});

Collections.addInitializer(function () {
  new Collections.Router({
    controller: Collections.Controller
  });
});

Collections.on('initialize:after', function(){
  if (Backbone.history) {
    Backbone.history.start({pushState: true});
  }
});

jQuery(document).ready(function () {
  Collections.start();
});