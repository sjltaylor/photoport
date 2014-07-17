
window.showSliderView = function () {
  Collections.page.show(Collections.sliderView);
  window.showSliderView = function () {};
}

Collections.Controller = {
  show: function (id) {
    this.load().done(function (landing) {
      var collection = Collections.library.get(id);
      if (!collection.view) {
        collection.view = Collections.Show.Controller.makePhotoportView({
          collection: collection,
          identity: landing.identity
        });
      }

      Collections.page.show(Collections.sliderView);
      Collections.sliderView.slideToPhotoport(collection.view);
    });
  },
  collections: function () {
    this.load().done(function (landing) {
      Collections.page.show(Collections.sliderView);
      Collections.sliderView.slideToIndex();
    });
  },
  sign_in: function () {
    this.load().done(function (landing) {
      Collections.page.show(Collections.signInView);
    });
  },
  load: function () {
    var deferred = new $.Deferred();

    Collections.landingDeferred.done(function (landing) {
      Collections.indexView.setUrl(landing.index);
      deferred.resolve({
        landing: landing,
        identity: Collections.identity,
        identifyView: Collections.identifyView
      });
    });

    return deferred.promise();
  }
};
