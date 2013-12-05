PhotoportCMS.module('CollectionsApp', function(CollectionsApp, PhotoportCMS, Backbone, Marionette, $, _){

  CollectionsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "": "editor"
    }
  });

  var api = {
    'editor': function(){
      CollectionsApp.Editor.Controller.show();
    }
  };

  PhotoportCMS.addInitializer(function () {
    new CollectionsApp.Router({
      controller: api
    });
  });
});