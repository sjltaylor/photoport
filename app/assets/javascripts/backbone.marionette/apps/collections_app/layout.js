//= require 'templates/collections/app'
//= require backbone.marionette/page_region

Collections.module('Collections.AppLayout', function (AppLayout, Collections, Backbone, Marionette, $, _) {

  Collections.AppLayout = Marionette.Layout.extend({
    template: 'collections/app',
    regions: {
      contentRegion: {
        selector: '#main',
        regionType: Collections.PageRegion
      },
      identityStatus: {
        selector: '#identity_status',
        regionType: Collections.PageRegion
      },
      primaryNavigation: {
        selector: '#primary_navigation',
        regionType: Collections.PageRegion
      }
    }
  });
});
