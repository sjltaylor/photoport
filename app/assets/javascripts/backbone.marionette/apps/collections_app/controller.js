Collections.Controller = {
  show: function () {
    this.load().done(function (landing) {
      //Collections.page.show(Collections.Show.Controller.show(landing));
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
      deferred.resolve({
        landing: landing,
        identity: Collections.identity,
        identifyView: Collections.identifyView
      });
    });

    return deferred.promise();
  }
};
