//= require ../../../support/env
//= require backbone.marionette/apps/photoport_container/photoport_container_controller
//= require backbone.marionette/apps/edit_panel/edit_panel_controller

describe('photoport container controller', function () {
  var controller = PhotoportCMS.PhotoportContainer.Controller;
  describe('makeView()', function () {
    var fakeView, collection, fakeContentDescriptor;
    beforeEach(function () {
      collection = new PhotoportCMS.Collection({photos: []});
      fakeView = new PhotoportCMS.PhotoportContainer.View({
        uploadPanel: { photoportContentDescriptor: {}}
      });
      spyOn(PhotoportCMS.PhotoportContainer, 'View').andReturn(fakeView);
      fakeContentDescriptor = {};
      spyOn(fakeView, 'add');
      spyOn(fakeView, 'remove');
      spyOn(controller, 'contentDescriptorFor').andReturn(fakeContentDescriptor);
    });
    function makeView() {
      return controller.makeView({collection: collection});
    }
    it('returns a view', function () {
      expect(makeView()).toBe(fakeView);
    });
    it('populates the view', function () {
      spyOn(controller, 'populate');
      makeView();
      expect(controller.populate).toHaveBeenCalledWith(fakeView, collection);
    });
    it('adds new photos to the view', function () {
      makeView();
      var fakePhoto = {};
      collection.photos.trigger('add', fakePhoto);
      expect(fakeView.add).toHaveBeenCalledWith(fakeContentDescriptor);
    });
    it('removes removed photos from the view', function () {
      makeView();
      var fakePhoto = {};
      collection.photos.trigger('remove', fakePhoto);
      expect(fakeView.remove).toHaveBeenCalledWith(fakeContentDescriptor);
    });
    it('shows an edit panel when the view emits an edit event', function () {
      var fakeEditPanel = jasmine.createSpyObj('fake EditPanel', ['render']);
      fakeEditPanel.render.andReturn(fakeEditPanel);
      spyOn(PhotoportCMS.EditPanel.Controller, 'makeView').andReturn(fakeEditPanel);
      spyOn(fakeView, 'showPanel');
      makeView();
      fakeView.trigger('edit', {});
      expect(fakeView.showPanel).toHaveBeenCalledWith(fakeEditPanel);
      expect(fakeEditPanel.render).toHaveBeenCalled();
    });
  });
  describe('contentDescriptorFor(photo)', function () {
    var photo, photoUrl;
    beforeEach(function () {
      photoUrl = 'http://localhost/photos/1';
      photo = new PhotoportCMS.Photo({
        download: photoUrl
      });
    });
    it('creates and returns a contentDescriptor for the photo', function () {
      var rtn = controller.contentDescriptorFor(photo);
      expect(typeof rtn).toBe('object');
      expect(rtn).not.toBe(photo);
    });
    describe('photo contentDescriptor', function () {
      it('is assigned to the photo instance', function () {
        var rtn = controller.contentDescriptorFor(photo);
        expect(photo.contentDescriptor).toBe(rtn);
      });
      it('has the image download url as the backgroundImage attribute', function () {
        expect(controller.contentDescriptorFor(photo).backgroundImage).toBe(photo.get('download'));
      });
    });
    describe('when a contentDescriptor for the photo has previously been requested', function () {
      it('returns the existing descriptor', function () {
        var first = controller.contentDescriptorFor(photo);
        expect(controller.contentDescriptorFor(photo)).toBe(first);
      });
    });
  });
  describe('populate(view, collection)', function () {
    var view, collection;
    beforeEach(function () {
      collection = new PhotoportCMS.Collection({
        photos: []
      });
      collection.photos = ['one', 'two', 'three'];
      collection.photos.each = collection.photos.forEach;
      view = jasmine.createSpyObj('view', ['add']);
    });
    it('adds a content descriptor to the view for each photo', function () {
      spyOn(controller, 'contentDescriptorFor').andCallFake(function (a) { return a; });

      controller.populate(view, collection);

      expect(view.add).toHaveBeenCalledWith('one');
      expect(view.add).toHaveBeenCalledWith('two');
      expect(view.add).toHaveBeenCalledWith('three');
    });
  });
});