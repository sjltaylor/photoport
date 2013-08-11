//= require 'templates/collections/create'

PhotoportCMS.module('CollectionsApp.Create', function (Create, PhotoportCMS, Backbone, Marionette, $, _) {

  Create.Layout = Marionette.Layout.extend({
    template: "collections/create",
    className: 'collections-create-view',
    regions: {
      contentRegion: "#page_body"
    }
  });
});