PhotoportCMS.module('CollectionsApp', function(CollectionsApp, PhotoportCMS, Backbone, Marionette, $, _){

  CollectionsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "": "create"
    }
  });

  var api = {
    'create': function(){
      CollectionsApp.Create.Controller.show();
    }
  };

  PhotoportCMS.addInitializer(function () {
    new CollectionsApp.Router({
      controller: api
    });
  });
});