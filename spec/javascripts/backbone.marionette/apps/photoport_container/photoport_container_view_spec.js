//= require ../../../support/env
//= require backbone.marionette/apps/photoport_container/photoport_container_view
//= require backbone.marionette/entities/collection

describe('PhotoportContainer.View', function () {
  var photoportContainerView,
      stubUploadPanel;

  beforeEach(function () {
    stubUploadPanel = {
      photoportContentDescriptor: fakeContentDescriptor(),
      render: function () {}
    };

    photoportContainerView = new PhotoportCMS.PhotoportContainer.View({
      uploadPanel: stubUploadPanel
    });

    photoportContainerView.render();
  });

  function fakeContentDescriptor () {
    return {
      el: document.createElement('DIV'),
      render: function () {}
    };
  }

  describe('constructor', function () {
    it('assigns the uploadPanel option to itself', function () {
      expect(photoportContainerView.uploadPanel).toBe(stubUploadPanel);
    });
    describe('associated photoport', function () {
      it('is created with the view root el as the container', function () {
        expect(photoportContainerView.photoport.container).toBe(photoportContainerView.el);
      });
    });
  });
  describe('showPanel()', function () {
    var fakePanel;
    beforeEach(function () {
      fakePanel = new (Marionette.ItemView.extend({}))();
      fakePanel.el = fakeContentDescriptor.el;
      spyOn(fakePanel, 'once').andCallThrough();
    });
    it('calls photoport.interlude() with the edit panel element', function () {
      spyOn(photoportContainerView.photoport, 'interlude');
      photoportContainerView.showPanel(fakePanel);
      expect(photoportContainerView.photoport.interlude).toHaveBeenCalledWith({el: fakePanel.el});
    });
    it('calls resume() on the first and only the first time the panel closes', function () {
      spyOn(photoportContainerView, 'resume');
      photoportContainerView.showPanel(fakePanel);
      fakePanel.trigger('close');
      fakePanel.trigger('close');
      expect(fakePanel.once).toHaveBeenCalled();
      expect(photoportContainerView.resume.callCount).toBe(1);
    });
  });
  describe('resume()', function () {
    it('calls resume() on the photoport', function () {
      spyOn(photoportContainerView.photoport, 'resume');
      photoportContainerView.resume();
      expect(photoportContainerView.photoport.resume).toHaveBeenCalled();
    });
  });
});