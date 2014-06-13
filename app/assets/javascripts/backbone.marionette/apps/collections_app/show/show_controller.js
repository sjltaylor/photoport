Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {

  Show.Controller = {
    show: function (opts) {
      var landing = opts.landing,
          layout = opts.layout,
          identity = opts.identity,
          identifyView = opts.identifyView;

      var collection = new Collections.Collection(landing.collection);

      var uploadPanel =  Collections.UploadPanel.Controller.makeView({
        collection: collection
      });

      var photoportContainerView = Collections.PhotoportContainer.Controller.makeView({
        collection: collection,
        identity: identity,
        uploadPanel: uploadPanel
      });

      photoportContainerView.on('save', function () {
        layout.contentRegion.show(identifyView);
      });

      layout.contentRegion.show(photoportContainerView);
    },
    makeIndexView: function (opts) {
      return new Show.IndexView(opts);
    },
    makeSliderView: function (opts) {
      return new Show.SliderView(opts);
    }
  };
});
