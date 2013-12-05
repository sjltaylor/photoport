//= require 'templates/collections/editor'

PhotoportCMS.module('CollectionsApp.Editor', function (Editor, PhotoportCMS, Backbone, Marionette, $, _) {

  Editor.Layout = Marionette.Layout.extend({
    template: "collections/editor",
    className: 'collection-editor-view',
    regions: {
      contentRegion: "#page_body"
    }
  });
});