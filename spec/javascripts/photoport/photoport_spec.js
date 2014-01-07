//= require photoport/photoport

describe('photoport', function () {
  var container, photoport, testContent;

  beforeEach(function () {
    resetPhotoport();
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

    it('renders handles', function () {
      expect(container.querySelector('.photoport .photoport-handle.photoport-handle-left')).not.toBeNull();
      expect(container.querySelector('.photoport .photoport-handle.photoport-handle-right')).not.toBeNull();
    });

    it('sets the initial state to "normal"', function () {
      expect(photoport.state).toBe('normal');
    });

    it('sets the interludeContent to null', function () {
      expect(photoport.interludeContent).toBeNull();
    });

    it('renders handle glyphs', function () {
      expect(container.querySelector('.photoport .photoport-handle.photoport-handle-left .photoport-handle-glyph')).not.toBeNull();
      expect(container.querySelector('.photoport .photoport-handle.photoport-handle-right .photoport-handle-glyph')).not.toBeNull();
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
  describe('portRect()', function () {
    it('returns the bounding client rectangle of the element representing the viewport for the content', function () {
      var portDomFake = {
        getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').andReturn({
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
      spyOn(photoport, 'portRect').andReturn({
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
      photoport.start();
    });
    it('calls fit() for all content in the sequence', function () {
      spyOn(photoport, 'fit');
      photoport.start();
      photoport.sequence.forEach(function (e) {
        expect(photoport.fit).toHaveBeenCalledWith(e);
      });
    });
    it('resizes the content area', function () {
      spyOn(photoport, 'portRect').andReturn({
        width: 123
      });
      photoport.start();
      var expectedWidth = photoport.sequence.length * 123;
      expect(photoport.portRect).toHaveBeenCalled();
      expect(photoport.dom.content.style.width).toBe(expectedWidth + 'px');
    });
    it('resizes the interlude content', function () {
      var interlude = createContent();
      spyOn(photoport, 'fit');
      photoport.interlude(interlude);
      photoport.start();
      expect(photoport.fit).toHaveBeenCalledWith(interlude);
    });
  });
  describe('start()', function () {
    var rtn;

    beforeEach(function () {
      rtn = {};
      spyOn(photoport, 'seek').andReturn(rtn);
      addSomeContentToPhotoport();
    });

    describe('when the position has not been set', function () {
      it('returns the result of seek(0)', function () {
        expect(photoport.start()).toBe(rtn);
        expect(photoport.seek).toHaveBeenCalledWith(0);
      });
      it('does not set this.position', // because that is the responsibility of seek()
                                       function () {
        photoport.start();
        expect(photoport.position).toBeNull();
      });
    });

    it('returns the result of seek(this.position)', function () {
      photoport.position = 2;
      expect(photoport.start()).toBe(rtn);
      expect(photoport.seek).toHaveBeenCalledWith(2);
    });

    it('calls fitContent()', function () {
      spyOn(photoport, 'fitContent');
      photoport.start();
      expect(photoport.fitContent).toHaveBeenCalled();
    });
  });
  describe('next()', function () {
    var rtn;
    beforeEach(function () {
      addSomeContentToPhotoport();
      photoport.start();
      rtn = {};
      spyOn(photoport, 'seek').andReturn(rtn);
    });
    it('calls seek() with the current position + 1', function () {
      photoport.seek(0);
      photoport.next();
      expect(photoport.seek).toHaveBeenCalledWith(1);
    });
    it('returns the result from seek', function () {
      expect(photoport.next()).toBe(rtn);
    });
    describe('when at the end', function () {
      it('returns to the start', function () {
        photoport.seek('last');
        photoport.next();
        expect(photoport.position).toBe(0);
      });
    });
  });
  describe('previous()', function () {
    var rtn = {};
    beforeEach(function () {
      addSomeContentToPhotoport();
      photoport.start();
    });
    it('calls seek() with the previous position', function () {
      photoport.seek(3);
      spyOn(photoport, 'seek').andReturn(rtn);
      photoport.previous();
      expect(photoport.seek).toHaveBeenCalledWith(2);
    });
    it('returns the result from seek', function () {
      spyOn(photoport, 'seek').andReturn(rtn);
      expect(photoport.previous()).toBe(rtn);
    });
    describe('when at the first position', function () {
      it('loops to the end', function () {
        photoport.seek('first');
        photoport.previous();
        expect(photoport.position).toBe(photoport.sequence.length - 1);
      });
    });
  });
  describe('el()', function () {
    it('returns the root of the photoport dom', function () {
      expect(photoport.el()).toBe(photoport.dom.root);
    });
  });
  describe('seek(position)', function () {
    describe('when photoport has content', function () {
      beforeEach(function () {
        addSomeContentToPhotoport();
        photoport.start();
      });

      it('sets the position', function () {
        expect(photoport.position).toBe(0);
        photoport.seek(2);
        expect(photoport.position).toBe(2);
      });
      it('returns the photoport', function () {
        expect(photoport.seek(2)).toBe(photoport);
      });
      it('sets the current content to the element in the sequence at the specified position', function () {
        photoport.seek(2);
        expect(photoport.dom.content.children[2]).toBe(testContent[2].el);
      });
      describe('when called with the same position as the current position', function () {
        it('returns itself', function () {
          photoport.seek(2);
          expect(photoport.seek(2)).toBe(photoport);
        });
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
          it('offset from the length', function () {
            photoport.seek(0);
            photoport.seek(-2);
            expect(photoport.position).toBe(3);
          });
          it('offset to a minimum of zero', function () {
            photoport.seek(2);
            photoport.seek(-photoport.sequence.length * 10);
            expect(photoport.position).toBe(0);
          });
        });
      });
      describe('named positions', function () {
        describe('last', function () {
          it('calls seek with the index of the last element', function () {
            photoport.seek('last');
            expect(photoport.position).toBe(photoport.sequence.length - 1);
          });
        });
        describe('first', function () {
          it('calls seek with the index of the first element', function () {
            photoport.seek('first');
            expect(photoport.position).toBe(0);
          });
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
          photoport.start();
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
      });
      it('updates the handles', function () {
        spyOn(photoport, 'updateHandles');
        photoport.seek(4);
        expect(photoport.updateHandles).toHaveBeenCalled();
      });
    });
    describe('when no content has been added', function () {
      it('throws an exception', function () {
        expect(function () {
          photoport.start();
          photoport.next();
        }).toThrow();
      });
    });
  });
  describe('insert(el, position)', function () {
    beforeEach(function () {
      addSomeContentToPhotoport();
      photoport.start();
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
    it('returns the photoport', function () {
      expect(photoport.insert(testContent[0])).toBe(photoport);
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
    describe('when the element is inserted before the current position', function () {
      describe('when the photoport has been started', function () {
        it('incremements the position', function () {
          photoport.next();
          expect(photoport.position).toBe(1);
          photoport.insert(testContent[0], 0);
          expect(photoport.position).toBe(2);
        });
      });
      describe('when the photoport has not been started', function () {
        beforeEach(function () {
          resetPhotoport();
        });
        it('does not incremement the position', function () {
          expect(photoport.position).toBe(null);
          photoport.insert(testContent[0], 0);
          expect(photoport.position).toBe(null);
        });
      });
    });
    describe('when the element is inserted at the current position', function () {
      describe('when the photoport has been started', function () {
        it('incremements the position', function () {
          expect(photoport.position).toBe(0);
          photoport.insert(testContent[0], 0);
          expect(photoport.position).toBe(1);
        });
      });
      describe('when the photoport has not been started', function () {
        beforeEach(function () {
          resetPhotoport();
        });
        it('does not incremement the position', function () {
          expect(photoport.position).toBe(null);
          photoport.insert(testContent[0], 0);
          expect(photoport.position).toBe(null);
        });
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
  });
  describe('remove(content)', function () {
    var content;
    var eventListener;
    var eventListenerCalled;
    var eventArgs;

    beforeEach(function () {
      addSomeContentToPhotoport();
      photoport.start();
      eventListenerCalled = false;
      eventArgs = null;
      eventListener = function (e) {
        eventArgs = e;
        eventListenerCalled = true;
      };
      photoport.el().addEventListener('photoport-content-remove', eventListener);
    });

    describe('when the content is not in the sequence', function () {
      beforeEach(function () {
        content = createContent();
      });
      it('returns the photoport', function () {
        expect(photoport.remove(content)).toBe(photoport);
      });
    });
    describe('when there is content in the sequence', function () {
      beforeEach(function () {
        content = testContent[2];
      });
      it('returns the photoport', function () {
        expect(photoport.remove(content)).toBe(photoport);
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
      it('calls fitContent()', function () {
        spyOn(photoport, 'fitContent');
        photoport.remove(content);
        expect(photoport.fitContent).toHaveBeenCalled();
      });
      it('calls updateHandles()', function () {
        spyOn(photoport, 'updateHandles');
        photoport.remove(content);
        expect(photoport.updateHandles).toHaveBeenCalled();
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
      });
      describe('when the content is after the current position', function () {
        beforeEach(function () {
          content = testContent[2];
          photoport.seek(1);
        });
        it('does not change the current position', function () {
          expect(photoport.position).toBe(1);
        });
      });
      describe('when the content is in the current position', function () {
        beforeEach(function () {
          content = testContent[2];
          photoport.seek(2);
        });
        it('seeks to the position one less than the current', function () {
          spyOn(photoport, 'seek');
          photoport.remove(content);
          expect(photoport.seek).toHaveBeenCalledWith(1);
        });
        describe('when the content is the last in the sequence', function () {
          beforeEach(function () {
            resetPhotoport();
            addSomeContentToPhotoport(1);
            content = testContent[0];
            photoport.start();
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
        });
      });
    });
  });
  describe('updateHandles()', function () {
    describe('when there is one element', function () {
      beforeEach(function () {
        addSomeContentToPhotoport(1);
        photoport.start();
      });
      it('displays no handles', function () {
        expect(photoport.dom.leftHandle.style.display).toBe('none');
        expect(photoport.dom.rightHandle.style.display).toBe('none');
      });
    });
    describe('when there are zero elements', function () {
      it('displays no handles', function () {
        photoport.updateHandles();
        expect(photoport.dom.leftHandle.style.display).toBe('none');
        expect(photoport.dom.rightHandle.style.display).toBe('none');
      });
    });
    describe('when there are two or more elements', function () {
      beforeEach(function () {
        addSomeContentToPhotoport(3);
        photoport.start();
      });
      describe('left handle', function () {
        it('is a left arrow', function () {
          expect(photoport.dom.leftHandle.style.display).toBe('table');
          expect(photoport.dom.leftHandleGlyph.classList.contains('fui-triangle-left-large')).toBeTruthy();
        });
      });
      describe('right handle', function () {
        it('is a right arrow', function () {
          expect(photoport.dom.rightHandle.style.display).toBe('table');
          expect(photoport.dom.rightHandleGlyph.classList.contains('fui-triangle-right-large')).toBeTruthy();
        });
      });
    });
    describe('during an interlude', function () {
      beforeEach(function () {
        addSomeContentToPhotoport();
        photoport.start();
        photoport.interlude(createContent());
      });
      it('displays no handles', function () {
        expect(photoport.dom.leftHandle.style.display).toBe('none');
        expect(photoport.dom.rightHandle.style.display).toBe('none');
      });
    });
  });
  describe('navigation', function () {
    describe('clicking', function () {
      describe('right', function () {
        it('calls next', function () {
          spyOn(photoport, 'next');
          photoport.dom.rightHandle.dispatchEvent(new Event('click'));
          expect(photoport.next).toHaveBeenCalled();
        });
      });
      describe('left', function () {
        it('calls previous', function () {
          spyOn(photoport, 'previous');
          photoport.dom.leftHandle.dispatchEvent(new Event('click'));
          expect(photoport.previous).toHaveBeenCalled();
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
    it('hides the normal content', function () {
      photoport.interlude(content);
      expect(photoport.dom.content.style.display).toBe('none');
    });
    it('shows the interlude', function () {
      photoport.interlude(content);
      expect(photoport.dom.interlude.style.display).toBe('');
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
    it('updates the handles', function () {
      spyOn(photoport, 'updateHandles');
      photoport.interlude(content);
      expect(photoport.updateHandles).toHaveBeenCalled();
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
    it('makes normal content visible', function () {
      photoport.resume();
      expect(photoport.dom.content.style.display).toBe('');
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
    it('updates the handles', function () {
      spyOn(photoport, 'updateHandles');
      photoport.resume();
      expect(photoport.updateHandles).toHaveBeenCalled();
    });
    it('clears the interludeContent', function () {
      photoport.resume();
      expect(photoport.interludeContent).toBeNull();
    });
  });
});