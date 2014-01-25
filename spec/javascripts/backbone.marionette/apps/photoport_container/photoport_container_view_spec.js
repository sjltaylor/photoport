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

  describe('events', function () {
    describe('when the user clicks save', function () {
      it('triggers a save event on the view', function () {
        var spy = jasmine.createSpy('save event handler');
        photoportContainerView.on('save', spy);
        photoportContainerView.$('.js-save').click();
        expect(spy).toHaveBeenCalled();
      });
    });
  });
  describe('constructor', function () {
    it('assigns the uploadPanel option to itself', function () {
      expect(photoportContainerView.uploadPanel).toBe(stubUploadPanel);
    });
    describe('associated photoport', function () {
      it('is created with the a new el as the container', function () {
        expect(photoportContainerView.photoport.container).toBe(photoportContainerView.el.lastChild);
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
  describe('remove()', function () {
    it('removes the content from the photoport', function () {
      var fake = {};
      spyOn(photoportContainerView.photoport, 'remove');
      photoportContainerView.remove(fake);
      expect(photoportContainerView.photoport.remove).toHaveBeenCalledWith(fake);
    });
  });
  describe('add()', function () {
    var fake;
    beforeEach(function () {
      fake = {};
    });
    it('inserts the content into the photoport in the penultimate position', function () {
      spyOn(photoportContainerView.photoport, 'insert');
      photoportContainerView.add(fake);
      expect(photoportContainerView.photoport.insert).toHaveBeenCalledWith(fake, 0);
    });
    it('seeks to the penultimate item', function () {
      spyOn(photoportContainerView.photoport, 'seek');
      photoportContainerView.add(fake);
      expect(photoportContainerView.photoport.seek).toHaveBeenCalledWith(0);
    });
  });
});