Collections.Photo = Backbone.Model.extend({
  contentDescriptor: function () {
    if (this.__contentDescriptor__ === undefined) {
      var contentDescriptor = {
        backgroundImage: this.get('download'),
        photo: this
      };

      this.__contentDescriptor__ = contentDescriptor;
    }

    return this.__contentDescriptor__;
  }
});
