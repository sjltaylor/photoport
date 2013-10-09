PhotoportCMS.module('CollectionsApp', function(CollectionsApp, PhotoportCMS, Backbone, Marionette, $, _){

  CollectionsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "": "new"
    }
  });

  var api = {
    'new': function(){
      CollectionsApp.New.Controller.show();
    }
  };

  PhotoportCMS.addInitializer(function () {
    new CollectionsApp.Router({
      controller: api
    });
  });
});