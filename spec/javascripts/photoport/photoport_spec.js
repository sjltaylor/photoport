//= require photoport/photoport
//= require photoport/photoport.deferred

describe('photoport', function () {
  var container, photoport, testContent;

  beforeEach(function () {
    resetPhotoport();
    photoport.dom.port.style.width = '600px';
  });

  afterEach(function () {
    photoport.destroy();
  });

  function resetPhotoport () {
    container = document.createElement('div');
    photoport = new Photoport({container:container});
  }

  function createContent(idSuffix) {
    idSuffix = idSuffix === undefined ? ('_' + new Date().valueOf()) : idSuffix;
    return {
      el: $('<div>').attr({id: 'el' + idSuffix})[0]
    };
  }

  function addSomeContentToPhotoport(n) {
    if (n === undefined) {
      n = 5;
    }

    testContent = [];

    for(var i = 0; i < n; i++) {
      var content = createContent(i);
      testContent[i] = content;
      photoport.insert(content, i);
    }
  }

  function deferredSpy () {
    var deferred = jasmine.createSpyObj('deferred', ['resolve', 'done']);
    spyOn(Photoport, 'Deferred').and.returnValue(deferred);
    spyOn(deferred.resolve, 'bind').and.returnValue(deferred.resolve);
    return deferred;
  }

  describe('constructor', function () {

    it('inserts a photoport root div into the container', function () {
      expect(container.childNodes.length).toEqual(1);
      expect(container.querySelector('div.photoport')).not.toBeNull();
    });

    it('renders a content element', function () {
      expect(container.querySelector('.photoport .photoport-content')).not.toBeNull();
    });

    it('renders a port element', function () {
      expect(container.querySelector('.photoport .photoport-port')).not.toBeNull();
    });

    it('renders a keyframe style element', function () {
      expect(container.querySelector('.photoport style.photoport-bounce-keyframes')).not.toBeNull();
    });

    it('sets the initial state to "normal"', function () {
      expect(photoport.state).toBe('normal');
    });

    it('sets the interludeContent to null', function () {
      expect(photoport.interludeContent).toBeNull();
    });

    it('initialize an initial empty sequence', function () {
      expect(photoport.sequence).toEqual([]);
    });

    it('initializes the position to null', function () {
      expect(photoport.position).toBe(null);
    });

    it('renders an interlude element, initially not displayed', function () {
      expect(container.querySelector('.photoport .photoport-interlude')).not.toBeNull();
      expect(photoport.dom.interlude.style.display).toBe('none');
    });

    it('puts the instance in the array of Photoport instance', function () {
      expect(Photoport.instances.indexOf(photoport)).toBe(0);
    })

    describe("options", function () {
      it("throws an error if the container is not an HTMLDivElement", function () {

        var options = {
          container: "#selector.not-allowed"
        };

        expect(function(){
          new Photoport(options);
        }).toThrow();
      });
    });
  });
  describe('destroy()', function () {
    it('removes the instance from the list of instances', function () {
      photoport.destroy();
      expect(Photoport.instances.indexOf(photoport)).toBe(-1);
    });
    it('removes the dom', function () {
      spyOn(photoport.dom.root, 'remove');
      photoport.destroy();
      expect(photoport.dom.root.remove).toHaveBeenCalled();
    });
  });
  describe('portRect()', function () {
    it('returns the bounding client rectangle of the element representing the viewport for the content', function () {
      var portDomFake = {
        getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').and.returnValue({
          width: 400,
          height: 200
        })
      };

      photoport.dom.port = portDomFake;

      var portRect = photoport.portRect();

      expect(portDomFake.getBoundingClientRect).toHaveBeenCalled();

      expect(portRect.width).toBe(400);
      expect(portRect.height).toBe(200);
    });
  });
  describe('fit(content)', function () {
    var testContent;

    beforeEach(function () {
      testContent = createContent();
    });

    it('sets the dimensions of the element to those of the photoport viewing viewport', function () {
      spyOn(photoport, 'portRect').and.returnValue({
        width: 400,
        height: 200
      });

      photoport.fit(testContent);

      expect(photoport.portRect).toHaveBeenCalled();

      expect(testContent.el.style.width).toBe('400px');
      expect(testContent.el.style.height).toBe('200px');
    });

    it('returns the photoport', function () {
      expect(photoport.fit(createContent())).toBe(photoport);
    });
  });
  describe('subsume()', function () {
    it('returns the photoport', function () {
      expect(photoport.subsume(createContent())).toBe(photoport);
    });
    it('adds the photoport-element class to the element', function () {
      var contentDescriptor = createContent();
      expect(contentDescriptor.el.classList.contains('photoport-element')).toBe(false);
      photoport.subsume(contentDescriptor);
      expect(contentDescriptor.el.classList.contains('photoport-element')).toBe(true);
    });
    describe('when passed a contentDescriptor with no el', function () {
      it('creates a div to display', function () {
        var contentDescriptor = {};
        photoport.subsume(contentDescriptor);
        expect(contentDescriptor.el instanceof HTMLDivElement).toBeTruthy();
      });
    });
    describe('when passed a contentDescriptor with a backgroundImage attribute', function () {
      var contentDescriptor;
      beforeEach(function () {
        contentDescriptor = {
          backgroundImage: 'http://localhost'
        };
        photoport.subsume(contentDescriptor);
      });
      it('it uses the backgroundImage value for the display elements style', function () {
        var urlRegex = /url\("?http:\/\/localhost\/?"?\)/;
        expect(contentDescriptor.el.style.backgroundImage).toMatch(urlRegex);
      });
      it('it sets the background repeat to no-repeat', function () {
        expect(contentDescriptor.el.style.backgroundRepeat).toBe('no-repeat');
      });
      it('adds the photoport-photo class to the element', function () {
        expect(contentDescriptor.el.classList.contains('photoport-photo')).toBeTruthy();
      });
    });
  });
  describe('fitContent()', function () {
    beforeEach(function () {
      addSomeContentToPhotoport();

    });
    it('calls fit() for all content in the sequence', function () {
      spyOn(photoport, 'fit');
      photoport.fitContent();
      photoport.sequence.forEach(function (e) {
        expect(photoport.fit).toHaveBeenCalledWith(e);
      });
    });
    it('resizes the content area', function () {
      spyOn(photoport, 'portRect').and.returnValue({
        width: 123
      });
      var expectedWidth = photoport.sequence.length * 123;
      photoport.fitContent();
      expect(photoport.portRect).toHaveBeenCalled();
      expect(photoport.dom.content.style.width).toBe(expectedWidth + 'px');
    });
    it('resizes the interlude content', function () {
      var interlude = createContent();
      spyOn(photoport, 'fit');
      photoport.interlude(interlude);
      photoport.fitContent();
      expect(photoport.fit).toHaveBeenCalledWith(interlude);
    });
  });
  describe('start()', function () {
    var rtn;

    beforeEach(function () {
      rtn = {};
      spyOn(photoport, 'seek').and.returnValue(rtn);
      addSomeContentToPhotoport();
    });

    describe('when the position has not been set', function () {
      it('returns the result of seek(0)', function () {
        expect(photoport.seek).toHaveBeenCalledWith(0);
      });
      it('does not set this.position', // because that is the responsibility of seek()
                                       function () {
        expect(photoport.position).toBeNull();
      });
    });

    it('returns the result of seek(this.position)', function () {
      photoport.position = 2;
      photoport.start();
      expect(photoport.seek).toHaveBeenCalledWith(2);
    });
    it('calls fitContent()', function () {
      spyOn(photoport, 'fitContent');
      photoport.start()
      expect(photoport.fitContent).toHaveBeenCalled();
    });
  });
  describe('next()', function () {
    var rtn;
    beforeEach(function () {
      addSomeContentToPhotoport();
      rtn = {};
      spyOn(photoport, 'seek').and.returnValue(rtn);
    });
    it('calls seek() with the next position', function () {
      photoport.seek(0);
      photoport.next();
      expect(photoport.seek).toHaveBeenCalledWith(1);
    });
    it('returns the result from seek', function () {
      expect(photoport.next()).toBe(rtn);
    });
  });
  describe('previous()', function () {
    var rtn = {};
    beforeEach(function () {
      addSomeContentToPhotoport();
    });
    it('calls seek() with the previous position', function () {
      photoport.seek(3);
      spyOn(photoport, 'seek').and.returnValue(rtn);
      photoport.previous();
      expect(photoport.seek).toHaveBeenCalledWith(2);
    });
    it('returns the result from seek', function () {
      spyOn(photoport, 'seek').and.returnValue(rtn);
      expect(photoport.previous()).toBe(rtn);
    });
  });
  describe('el()', function () {
    it('returns the root of the photoport dom', function () {
      expect(photoport.el()).toBe(photoport.dom.root);
    });
  });
  describe('seek(position)', function () {
    describe('when photoport has content', function () {
      var deferred;

      beforeEach(function () {
        deferred = deferredSpy();
        addSomeContentToPhotoport();
        expect(photoport.count()).toBe(5);
      });

      it('sets the position', function () {
        expect(photoport.position).toBe(0);
        photoport.seek(2);
        expect(photoport.position).toBe(2);
      });
      it('returns a Photoport.Deferred', function () {
        expect(photoport.seek(2)).toBe(deferred);
      });
      it('calls the resolve on the returned deferred when the transition ends', function () {
        photoport.dom.content.dispatchEvent(new Event('webkitTransitionEnd'));
        expect(deferred.resolve).toHaveBeenCalled();
      });
      it('sets the current content to the element in the sequence at the specified position', function () {
        photoport.seek(2);
        expect(photoport.dom.content.children[2]).toBe(testContent[2].el);
      });
      it('adds the "current" class to the current element', function () {
        photoport.seek(2);
        expect(photoport.sequence[2].el.classList.contains("current")).toBe(true);
      });
      it('removes the "current" class from non-current elements', function () {
        photoport.seek(2);
        for (var i = photoport.count() - 1; i >= 0; i--) {
          if (i == 2) continue;
          expect(photoport.sequence[i].el.classList.contains("current")).toBe(false);
        }
      });
      describe('bounds handling', function () {
        it('is seeks up to the length of the sequence', function () {
          expect(photoport.position).toBe(0);
          photoport.seek(photoport.sequence.length);
          expect(photoport.position).toBe(photoport.sequence.length - 1);
          photoport.seek(photoport.sequence.length + 5);
          expect(photoport.position).toBe(photoport.sequence.length - 1);
        });
        describe('negative seek positions', function () {
          it('offset to a minimum of zero', function () {
            photoport.seek(2);
            photoport.seek(-photoport.sequence.length * 10);
            expect(photoport.position).toBe(0);
          });
        });
        describe('when seeking previous from the first position', function () {
          beforeEach(function () {
            resetPhotoport();
            addSomeContentToPhotoport(1);
          });
          it('remains in the first position', function () {
            photoport.seek('first');
            var p = photoport.position;
            photoport.previous();
            expect(photoport.position).toBe(p);
          });
          it('bounces left', function () {
            spyOn(photoport, 'bounceBackwards');
            photoport.seek('first');
            photoport.previous();
            expect(photoport.bounceBackwards).toHaveBeenCalled();
          });
          it('calls resolve on the deferred when the animation ends', function () {
            photoport.previous();
            photoport.dom.content.dispatchEvent(new Event('webkitAnimationEnd'));
            expect(deferred.resolve).toHaveBeenCalled();
          });
        });
        describe('when seeking next from the last position', function () {
          beforeEach(function () {
            resetPhotoport();
            addSomeContentToPhotoport(1);
          });
          it('remains in the last position', function () {
            photoport.seek('last');
            var p = photoport.position;
            photoport.next();
            expect(photoport.position).toBe(p);
          });
          it('bounces right', function () {
            spyOn(photoport, 'bounceForwards');
            photoport.seek('last');
            photoport.next();
            expect(photoport.bounceForwards).toHaveBeenCalled();
          });
          it('calls resolve on the deferred when the animation ends', function () {
            photoport.next();
            photoport.dom.content.dispatchEvent(new Event('webkitAnimationEnd'));
            expect(deferred.resolve).toHaveBeenCalled();
          });
        });
      });
      describe('when the position is a string', function () {
        it('resolves the position as if it were a named position', function () {
          spyOn(photoport, 'indexForNamedPosition').and.callThrough();
          photoport.seek('first');
          expect(photoport.indexForNamedPosition).toHaveBeenCalledWith('first');
        });
      });
      describe('photoport-navigate event', function () {
        var args;
        var listenerFn;
        var previousPosition;
        var newPosition;

        beforeEach(function () {
          args = 'not-called';

          listenerFn = function (e) {
            args = e;
          };

          addSomeContentToPhotoport();
          photoport.seek(1);
          previousPosition = photoport.position;
          photoport.el().addEventListener('photoport-navigate', listenerFn);
          photoport.seek(4);
        });

        it('is emitted on the root element', function () {
          expect(args).not.toBe('not-called');
        });
        it('includes the previousPosition', function () {
          expect(args.detail.previousPosition).toBe(1);
        });
        it('includes the newPosition', function () {
          expect(args.detail.newPosition).toBe(4);
        });
        it('includes the deferred', function () {
          expect(args.detail.deferred).toBe(deferred);
        });
        it('bubbles', function () {
          expect(args.bubbles).toBe(true);
        });
      });
      describe('seeking to the same position', function () {
        it('resolves the deferred on next tick', function () {
          photoport.seek(0);
          spyOn(window, 'setTimeout');
          photoport.seek(0);
          expect(setTimeout).toHaveBeenCalledWith(deferred.resolve, 0);
        });
      });
    });
    describe('when no content has been added', function () {
      it('throws an exception', function () {
        expect(function () {
          photoport.next();
        }).toThrow();
      });
    });
  });
  describe('insert(contentDescriptor, position)', function () {
    var deferred;

    beforeEach(function () {
      deferred = deferredSpy();
      addSomeContentToPhotoport();
    });

    it('defaults the position to the end of the sequence', function () {
      var contentN = createContent();
      photoport.insert(contentN);
      expect(photoport.sequence[photoport.sequence.length-1]).toBe(contentN);
    });
    it('inserts the content into the seqeuence at the requested position', function () {
      var content = createContent('_inserted');
      photoport.insert(content, 3);
      expect(photoport.sequence[3]).toBe(content);
    });
    it('returns a deferred', function () {
      expect(photoport.insert(testContent[0])).toBe(deferred);
    });
    it('calls fit() with the element to be displayed', function () {
      spyOn(photoport, 'fit');
      photoport.insert(testContent[3]);
      expect(photoport.fit).toHaveBeenCalledWith(testContent[3]);
    });
    it('calls subsume() with the contentDescriptor', function () {
      spyOn(photoport, 'subsume');
      photoport.insert(testContent[3]);
      expect(photoport.subsume).toHaveBeenCalledWith(testContent[3]);
    });
    it('calls setupMouseInteraction with the content descriptor', function () {
      var contentDescriptor = createContent();
      spyOn(photoport, 'setupMouseInteraction');
      photoport.insert(contentDescriptor);
      expect(photoport.setupMouseInteraction).toHaveBeenCalledWith(contentDescriptor);
    });
    describe('when the position is a string', function () {
      it('resolves the position as if it were a named position', function () {
        spyOn(photoport, 'indexForNamedPosition').and.callThrough();
        photoport.insert(createContent(), 'first');
        expect(photoport.indexForNamedPosition).toHaveBeenCalledWith('first');
      });
    });
    describe('photoport-insert event', function () {
      var content;
      var eventListener;
      var eventListenerCalled;
      var eventArgs;

      beforeEach(function () {
        content = createContent();
        eventListenerCalled = false;
        eventArgs = null;
        eventListener = function (e) {
          eventArgs = e;
          eventListenerCalled = true;
        };
        photoport.el().addEventListener('photoport-insert', eventListener);
        photoport.insert(content, 1);
      });

      it('emits a photoport-insert event', function () {
        expect(eventListenerCalled).toBeTruthy();
      });
      it('includes the content that was inserted in the event args', function () {
        expect(eventArgs.detail.content).toBe(content);
      });
      it('bubbles', function () {
        expect(eventArgs.bubbles).toBe(true);
      });
      it('includes the deferred', function () {
        expect(eventArgs.detail.deferred).toBe(deferred);
      });
      it('includes the position in which the content was inserted in the event args', function () {
        expect(eventArgs.detail.position).toBe(1);
      });
    });
    describe('when the element is inserted before the current position', function () {
      it('resolves the deferred on next tick', function () {
        spyOn(window, 'setTimeout');
        photoport.insert(testContent[0]);
        expect(setTimeout).toHaveBeenCalledWith(deferred.resolve, 0);
      });
      it('incremements the position', function () {
        photoport.next();
        expect(photoport.position).toBe(1);
        photoport.insert(testContent[0], 0);
        expect(photoport.position).toBe(2);
      });
      it('sets the left position of the content to allow for the new content', function () {
        document.body.appendChild(photoport.dom.root);
        expect(photoport.sequence.length).toBeGreaterThan(3);
        photoport.seek(1);
        var left = parseInt(photoport.dom.content.style.left, 10);
        var width = photoport.portRect().width;
        photoport.insert(createContent(), 0);
        var newLeft = parseInt(photoport.dom.content.style.left, 10);
        expect(left - width).toEqual(newLeft);
      });
    });
    describe('when the element is inserted after the current position', function () {
      it('resolves the deferred on next tick', function () {
        spyOn(window, 'setTimeout');
        expect(photoport.sequence.length).toBeGreaterThan(2);
        photoport.seek(1);
        photoport.insert(testContent[0], 2);
        expect(setTimeout).toHaveBeenCalledWith(deferred.resolve, 0);
      });
    });
    describe('when the element is inserted at the current position', function () {
      it('does not change the position', function () {
        photoport.seek(0);
        expect(photoport.position).toBe(0);
        photoport.insert(testContent[0], 0);
        expect(photoport.position).toBe(0);
      });
    });
    describe('when a negative position is passed', function () {
      it('inserts the element at length - pos', function () {
        var el = createContent();
        var c = photoport.sequence.length;
        var i = -3;
        var expectedPosition = c + i;
        expect(expectedPosition).toBeGreaterThan(0);
        photoport.insert(el, i);
        expect(photoport.sequence[expectedPosition]).toBe(el);
      });
      describe('when the length - position is negative', function () {
        it('inserts the element at zero', function () {
          var el = createContent();
          var i = -10000000;
          photoport.insert(el, i);
          expect(photoport.sequence[0]).toBe(el);
        });
      });
    });
    describe('when a position greater than the length is passed', function () {
      it('inserts the element at the end of the seqence', function () {
        var el = createContent();
        var l = photoport.sequence.length;
        photoport.insert(el, l + 5);
        expect(photoport.sequence[l]).toBe(el);
      });
    });
    describe('position of the inserted dom node', function () {
      describe('when inserting after the current position', function () {
        it('is the same position among siblings as in sequence', function () {
          var newContent = createContent();
          photoport.seek(0);
          photoport.insert(newContent, 1);
          expect(photoport.dom.content.children[1]).toBe(newContent.el);
        });
      });
      describe('when inserting at the current position', function () {
        it('is the same position among siblings as in sequence', function () {
          var newContent = createContent();
          photoport.seek(2);
          photoport.insert(newContent, 2);
          expect(photoport.dom.content.children[2]).toBe(newContent.el);
        });
      });
      describe('when inserting before the current position', function () {
        it('is the same position among siblings as in sequence', function () {
          var newContent = createContent();
          photoport.seek(4);
          photoport.insert(newContent, 1);
          expect(photoport.dom.content.children[1]).toBe(newContent.el);
        });
      });
    });
    describe('when the photoport is not started', function() {
      beforeEach(function () {
        photoport.isStarted = function () {
          return false;
        }
      });
      it('calls start()', function () {
        spyOn(photoport, 'start');
        photoport.insert(createContent());
        expect(photoport.start).toHaveBeenCalled();
      });
    });
  });
  describe('remove(content)', function () {
    var content;
    var eventListener;
    var eventListenerCalled;
    var eventArgs;
    var deferred;

    beforeEach(function () {
      addSomeContentToPhotoport();
      eventListenerCalled = false;
      eventArgs = null;
      deferred = deferredSpy();
      eventListener = function (e) {
        eventArgs = e;
        eventListenerCalled = true;
      };
      photoport.el().addEventListener('photoport-remove', eventListener);
    });

    describe('when the content is not in the sequence', function () {
      beforeEach(function () {
        content = createContent();
      });
      it('returns a deferred', function () {
        expect(photoport.remove(content)).toBe(deferred);
      });
      it('resolves the deferred on next tick', function () {
        spyOn(window, 'setTimeout');
        photoport.remove(content);
        expect(setTimeout).toHaveBeenCalledWith(deferred.resolve, 0);
      });
      it('does not emit a photoport-remove', function () {
        photoport.remove(content);
        expect(eventListenerCalled).toBe(false);
      });
    });
    describe('when the content is in the sequence', function () {
      beforeEach(function () {
        content = testContent[2];
      });
      it('is removed from the sequence', function () {
        photoport.remove(content);
        expect(photoport.sequence.indexOf(content)).toBe(-1);
      });
      it('is removed from the dom', function () {
        var isInDom = false;
        for(var i = 0; i < photoport.dom.content.children.length; i++) {
          if (photoport.dom.content.children[i] == content) {
            isInDom = true;
            break;
          }
        }
        expect(isInDom).toBe(false);
      });
      it('removes the mousedown event listener', function () {
        spyOn(content.el, 'removeEventListener');
        photoport.remove(content);
        expect(content.el.removeEventListener).toHaveBeenCalledWith('mousedown', content.mousedownHandler);
      });
      describe('photoport-remove event', function () {
        it('emits a photoport-remove event', function () {
          photoport.remove(content);
          expect(eventListenerCalled).toBe(true);
        });
        it('includes the content that was removed in the event args', function () {
          photoport.remove(content);
          expect(eventArgs.detail.content).toBe(content);
        });
        it('bubbles', function () {
          photoport.remove(content);
          expect(eventArgs.bubbles).toBe(true);
        });
        it('includes the deferred', function () {
          photoport.remove(content);
          expect(eventArgs.detail.deferred).toBe(deferred);
        });
      });
      describe('when the content is before the current position', function () {
        beforeEach(function () {
          content = testContent[1];
          photoport.seek(2);
        });
        it('updates the current position to one less', function () {
          photoport.remove(content);
          expect(photoport.position).toBe(1);
        });
        it('resolves the deferred on next tick', function () {
          spyOn(window, 'setTimeout');
          photoport.remove(content);
          expect(setTimeout).toHaveBeenCalledWith(deferred.resolve, 0);
        });
      });
      describe('when the content is after the current position', function () {
        beforeEach(function () {
          content = testContent[2];
          photoport.seek(1);
        });
        it('does not change the current position', function () {
          expect(photoport.position).toBe(1);
        });
        it('resolves the deferred on next tick', function () {
          spyOn(window, 'setTimeout');
          photoport.remove(content);
          expect(setTimeout).toHaveBeenCalledWith(deferred.resolve, 0);
        });
      });
      describe('when the content is in the current position', function () {
        beforeEach(function () {
          content = testContent[2];
          photoport.seek(2);
        });
        it('returns the deferred from the seek operation', function () {
          var seekDeferred = jasmine.createSpyObj('seek deferred', ['resolve', 'done']);
          spyOn(photoport, 'seek').and.returnValue(seekDeferred);
          expect(photoport.remove(content)).toBe(seekDeferred);
        });
        describe('when the content is the only item in the sequence', function () {
          beforeEach(function () {
            resetPhotoport();
            addSomeContentToPhotoport(1);
            content = testContent[0];
            photoport.seek(0);
          });
          it('sets the position to null', function () {
            photoport.remove(content);
            expect(photoport.position).toBeNull();
          });
          it('does not call seek', function () {
            spyOn(photoport, 'seek');
            photoport.remove(content);
            expect(photoport.seek).not.toHaveBeenCalled();
          });
          it('resolves the deferred on next tick', function () {
            spyOn(window, 'setTimeout');
            photoport.remove(content);
            expect(setTimeout).toHaveBeenCalledWith(deferred.resolve, 0);
          });
        });
      });
    });
  });
  describe('interlude(content)', function () {
    var content;
    beforeEach(function () {
      content = createContent();
    });
    it('fits the content', function () {
      spyOn(photoport, 'fit');
      photoport.interlude(content);
      expect(photoport.fit).toHaveBeenCalledWith(content);
    });
    it('shows the interlude over top the content', function () {
      photoport.interlude(content);
      expect(photoport.dom.interlude.style.display).toBe('');
      expect(photoport.dom.interlude.style.position).toBe('absolute');
      expect(photoport.dom.interlude.style.top).toBe('0px');
      expect(photoport.dom.interlude.style.left).toBe('0px');
    });
    it('adds the interlude content to the dom', function () {
      photoport.interlude(content);
      expect(photoport.dom.interlude.children.length).toBe(1);
      expect(photoport.dom.interlude.children[0]).toBe(content.el);
    });
    it('removes any existing interlude', function () {
      photoport.interlude(createContent());
      photoport.interlude(createContent());
      photoport.interlude(createContent());
      photoport.interlude(content);
      expect(photoport.dom.interlude.children.length).toBe(1);
      expect(photoport.dom.interlude.children[0]).toBe(content.el);
    });
    it('returns the photoport', function () {
      expect(photoport.interlude(content)).toBe(photoport);
    });
    it('sets the state to "interlude"', function () {
      photoport.interlude(content);
      expect(photoport.state).toBe("interlude");
    });
    it('sets the interludeContent', function () {
      photoport.interlude(content);
      expect(photoport.interludeContent).toBe(content);
    });
  });
  describe('resume()', function () {
    beforeEach(function () {
      photoport.interlude(createContent());
    });
    it('hides the interlude', function () {
      photoport.resume();
      expect(photoport.dom.interlude.style.display).toBe('none');
    });
    it('removes the interlude content from the dom', function () {
      photoport.resume();
      expect(photoport.dom.interlude.children.length).toBe(0);
    });
    it('returns the photoport', function () {
      expect(photoport.resume()).toBe(photoport);
    });
    it('sets the state to "normal"', function () {
      photoport.resume();
      expect(photoport.state).toBe("normal");
    });
    it('clears the interludeContent', function () {
      photoport.resume();
      expect(photoport.interludeContent).toBeNull();
    });
  });
  describe('count()', function () {
    it('returns the sequence length', function () {
      addSomeContentToPhotoport(10);
      expect(photoport.count()).toBe(10);
    });
  });
  describe('setupMouseInteraction(contentDescriptor)', function () {
    var contentDescriptor,
        actionListener,
        actionListenerArgs,
        holdListener,
        holdListenerArgs;

    beforeEach(function () {
      contentDescriptor = createContent();

      actionListener = jasmine.createSpy().and.callFake(function (e) {
        actionListenerArgs = e;
      });
      actionArgs = null;
      photoport.el().addEventListener('photoport-action', actionListener);

      holdListener = jasmine.createSpy().and.callFake(function (e) {
        holdListenerArgs = e;
      });
      holdArgs = null;
      photoport.el().addEventListener('photoport-hold', holdListener);
    });

    function dispatch(name) {
      contentDescriptor.el.dispatchEvent(new MouseEvent(name));
    }

    function simulateActionEvent () {
      dispatch('mousedown');
      dispatch('mouseup');
    }

    function simulateHoldEvent () {
      dispatch('mousedown');
      setTimeout(function () {
        dispatch('mouseup');
      }, 351);
    }

    it('adds a mousedownHandler to the element', function () {
      spyOn(contentDescriptor.el, 'addEventListener');
      photoport.insert(contentDescriptor);
      expect(contentDescriptor.mousedownHandler).not.toBeNull();
      expect(contentDescriptor.el.addEventListener).toHaveBeenCalledWith('mousedown', contentDescriptor.mousedownHandler);
    });
    it('fires a photoport-action event with the content if a mouseup event is received within 350ms', function (done) {
      photoport.insert(contentDescriptor);

      simulateActionEvent();

      setTimeout(function () {
        expect(actionListener.calls.count() > 0).toBe(true);
        expect(actionListener).toHaveBeenCalled();
        expect(actionListenerArgs.detail.content).toBe(contentDescriptor);
        expect(actionListenerArgs.bubbles).toBe(true);
        done();
      }, 400);
    });
    it('fires a photoport-hold event if the mouse is down for >= 350ms', function (done) {
      photoport.insert(contentDescriptor);

      simulateHoldEvent();

      setTimeout(function () {
        expect(holdListener.calls.count() > 0).toBe(true);
        expect(holdListenerArgs.detail.content).toBe(contentDescriptor);
        expect(holdListenerArgs.bubbles).toBe(true);
        done();
      }, 400);
    });
    describe('multiple events', function () {
      beforeEach(function () {
        photoport.insert(contentDescriptor);
      });

      it('does not emit an action event if the hold event has been emitted', function (done) {
        var initialActionCallListenerCallCount = actionListener.calls.count();

        simulateHoldEvent();

        setTimeout(function () {
          expect(actionListener.calls.count()).toBe(initialActionCallListenerCallCount);
          done();
        }, 400);
      });
      it('does not emit a hold event if an action event has been emitted', function (done) {
        simulateActionEvent();

        var holdEventWouldHaveFired = false;

        setTimeout(function () {
          holdEventWouldHaveFired = true;
        }, 375);

        setTimeout(function () {
          expect(holdEventWouldHaveFired).toBe(true);
          expect(holdListener).not.toHaveBeenCalled();
          done();
        }, 400);
      });
    });
  });
  describe('indexForNamedPosition(positionName)', function () {
    describe('last', function () {
      it('returns the last position', function () {
        expect(photoport.indexForNamedPosition('last')).toBe(photoport.sequence.length - 1);
      });
    });
    describe('first', function () {
      it('returns the first position', function () {
        expect(photoport.indexForNamedPosition('first')).toBe(0);
      });
    });
    describe('when the position name is not recognized', function () {
      it('returns it', function () {
        expect(photoport.indexForNamedPosition('woof')).toBe('woof');
      });
    });
  });

  describe('Photoport.Deferred', function () {
    var deferred;

    beforeEach(function () {
      deferred = new Photoport.Deferred();
    });

    describe('constructor', function () {
      it('sets isResolved to false', function () {
        expect(deferred.isResolved).toBe(false);
      });
      it('sets an empty queue of callbacks', function () {
        expect(deferred.queues.done).toEqual([]);
      });
    });

    describe('prototype functions', function () {
      var callback1, callback2;

      beforeEach(function () {
        callback1 = jasmine.createSpy('callback1');
        callback2 = jasmine.createSpy('callback2');

        deferred.done(callback1).done(callback2);
      });

      describe('resolve()', function () {
        var rtn;

        beforeEach(function () {
          rtn = deferred.resolve();
        });

        describe('when the deferred is not yet resolved', function () {
          it('sets isResolved to true', function () {
            expect(deferred.isResolved).toBe(true);
          });
          it('calls all callbacks', function () {
            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
          });
          it('returns the deferred', function () {
            expect(rtn).toBe(deferred);
          });
          it('clears the queue of callbacks', function () {
            expect(deferred.queues.done).toBeNull();
          });
        });
        describe('when the deferred is already resolved', function () {
          beforeEach(function () {
            rtn = deferred.resolve();
          });

          it('does not call callbacks', function () {
            expect(callback1.calls.count()).toBe(1);
            expect(callback2.calls.count()).toBe(1);
          });
          it('returns the deferred', function () {
             expect(rtn).toBe(deferred);
          });
        });
      });

      describe('done(cb)', function () {
        var fn;

        beforeEach(function () {
          fn = function () {};
        });

        function done () {
          return deferred.done(fn);
        }

        describe('when the deferred is not yet resolved', function () {
          it('adds the callback to the list of callbacks', function () {
            expect(deferred.queues.done.indexOf(callback2)).toBe(1);
          });
          it('returns the deferred', function () {
            expect(done()).toBe(deferred);
          });
        });
        describe('when the deferred is resolved', function () {
          beforeEach(function () {
            deferred.resolve();
          });
          it('calls the callback on the next tick', function () {
            spyOn(window, 'setTimeout');
            done();
            expect(setTimeout).toHaveBeenCalledWith(fn, 0);
          });
          it('does not add the callback to the list', function () {
            expect(deferred.queues.done).toBeNull();
          });
          it('returns the deferred', function () {
            expect(done()).toBe(deferred);
          });
        });
      });
    });
  });
});
