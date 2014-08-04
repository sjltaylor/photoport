
window.showSliderView = function () {
  Collections.page.show(Collections.sliderView);
  window.showSliderView = function () {};
}

Collections.Controller = {
  show: function (id) {
    Collections.landing.done(function (app) {
      var collection = app.library.collections().get(id);
      if (!collection.view) {
        collection.view = app.Show.Controller.makePhotoportView({
          collection: collection,
          identity: app.identity,
          uploadPanelConfig: app.library.get('upload_panel_config')
        });
      }

      app.page.show(app.sliderView);
      app.sliderView.slideToPhotoport(collection.view);
    });
  },
  collections: function () {
    Collections.landing.done(function (app) {
      app.page.show(app.sliderView);
      app.sliderView.slideToIndex();
    });
  },
  sign_in: function () {
    Collections.landing.done(function (app) {
      app.page.show(app.signInView);
    });
  }
};
