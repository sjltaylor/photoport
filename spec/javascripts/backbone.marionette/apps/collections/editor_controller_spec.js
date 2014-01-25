//= require ../../../support/env
//= require backbone.marionette/apps/collections/editor/editor_controller
//= require backbone.marionette/apps/collections/editor/editor_layout
//= require backbone.marionette/apps/photoport_container/photoport_container_controller
//= require backbone.marionette/apps/upload_panel/upload_panel_controller
//= require backbone.marionette/entities/photo

describe('EditorController', function () {
  var controller = PhotoportCMS.CollectionsApp.Editor.Controller;
  var layoutFake;

  beforeEach(function () {
    layoutFake = { contentRegion: jasmine.createSpyObj('contentRegion', ['show']) };
    spyOn(PhotoportCMS.CollectionsApp.Editor, 'Layout').andReturn(layoutFake);
  });

  describe('run()', function () {
    var layoutFake, collectionFake;

    beforeEach(function () {
      collectionFake = { photos: new Backbone.Collection([]) };

      spyOn(PhotoportCMS.mainRegion, 'show');
      spyOn(PhotoportCMS, 'Collection').andCallFake(function () {
        return collectionFake;
      });
    });

    it('create and shows an editor layout in the main region of the app', function () {
      controller.run();
      expect(PhotoportCMS.CollectionsApp.Editor.Layout).toHaveBeenCalled();
      expect(PhotoportCMS.mainRegion.show).toHaveBeenCalledWith(layoutFake);
    });
    it('shows a photoport container in the contentRegion of the layout', function () {
      layoutFake.contentRegion.show.andCallFake(function (e) {
        expect(e instanceof PhotoportCMS.PhotoportContainer.View).toBe(true);
      });
      controller.run();
      expect(layoutFake.contentRegion.show).toHaveBeenCalled();
    });
    it('creates a photoport container with an upload panel', function () {
      var uploadPanelFake = {};
      spyOn(PhotoportCMS.UploadPanel.Controller, 'makeView').andReturn(uploadPanelFake);
      spyOn(PhotoportCMS.PhotoportContainer.Controller, 'makeView');
      controller.run();
      expect(PhotoportCMS.PhotoportContainer.Controller.makeView).toHaveBeenCalledWith({
        collection: collectionFake,
        uploadPanel: uploadPanelFake
      });
    });
  });
});
