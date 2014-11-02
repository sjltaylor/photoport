//= require templates/index_view

Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {
  Show.IndexView = Marionette.LayoutView.extend({
    className: 'index-view',
    template: 'index_view',
    ui: {
      controls: '.c-controls',
    },
    regionClass: Collections.PageRegion,
    regions: {
      primaryNavigationRegion: '#primary_navigation',
      //identityStatusRegion: '#identity_status',
      listContainerRegion: '#list_container'
    },
    initialize: function (opts) {
      //this.identityStatusView = opts.identityStatusView;
      this.listView = opts.listView;
    },
    onRender: function () {
      //this.identityStatusRegion.show(this.identityStatusView);
      this.listContainerRegion.show(this.listView);
    },
    onResize: function (dimensions) {
      this.listView.resize({
        width: dimensions.width,
        height: dimensions.height - this.ui.controls.height()
      });
    }
  });
});
