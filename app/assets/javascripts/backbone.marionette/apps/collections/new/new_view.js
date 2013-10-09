//= require 'templates/collections/new'

PhotoportCMS.module('CollectionsApp.New', function (New, PhotoportCMS, Backbone, Marionette, $, _) {

  New.Layout = Marionette.Layout.extend({
    template: "collections/new",
    className: 'collections-new-view',
    regions: {
      contentRegion: "#page_body"
    }
  });
});