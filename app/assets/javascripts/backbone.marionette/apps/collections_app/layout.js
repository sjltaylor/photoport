//= require 'templates/collections/app'

Collections.module('Collections.AppLayout', function (AppLayout, Collections, Backbone, Marionette, $, _) {

  Collections.AppLayout = Marionette.Layout.extend({
    template: "collections/app",
    regions: {
      contentRegion: {
        selector: "#page_body",
        regionType: Collections.PageRegion
      }
    }
  });
});