Photoport = (function () {

  function checkOptions (options) {
    if (!(options.container instanceof HTMLDivElement)) {
      throw "container must be an instance of HTMLDivElement but was: " + options.container;
    }
  }

  function div (className) {
    var e = document.createElement('DIV');
    e.className = className || '';
    return e;
  }

  function span (className) {
    var e = document.createElement('SPAN');
    e.className = className || '';
    return e;
  }

  function build () {
    var dom = {
      root        : div('photoport'),
      port        : div('photoport-port'),
      content     : div('content'),
      leftHandle  : div('photoport-handle photoport-handle-left'),
      rightHandle : div('photoport-handle photoport-handle-right'),
      leftHandleGlyph   : span('fui-triangle-left-large photoport-handle-glyph'),
      rightHandleGlyph  : span('fui-triangle-right-large photoport-handle-glyph')
    };

    dom.root.appendChild(dom.leftHandle);
    dom.root.appendChild(dom.port);
    dom.root.appendChild(dom.rightHandle);
    dom.port.appendChild(dom.content);

    dom.leftHandle.appendChild(dom.leftHandleGlyph);
    dom.rightHandle.appendChild(dom.rightHandleGlyph);

    return dom;
  }

  function circularIncr(p, length) {
    return (p + 1) % length;
  }

  function circularDecr(p, length) {
    return ((p - length) % length) + length - 1;
  }

  function Photoport (options) {
    checkOptions(options);
    this.container = options.container;
    this.dom = build();
    this.container.appendChild(this.dom.root);
    this.sequence = [];
    this.position = null;

    this.dom.rightHandle.addEventListener('click', function (e) {
      e.preventDefault();
      this.next();
    }.bind(this));

    this.dom.leftHandle.addEventListener('click', function (e) {
      e.preventDefault();
      this.previous();
    }.bind(this));
  }

  Photoport.prototype = {
    fit: function (content) {
      el = content.el || this.current.el;

      var bounds = this.portRect();

      el.style.width    = bounds.width  + 'px';
      el.style.height   = bounds.height + 'px';
      el.style.display  = 'inline-block';
      el.style.position = 'relative';
      el.style.top      = 0;
      el.style.left     = 0;
      el.style.margin   = 0;
      el.style.border   = 'none';
      el.style.padding  = 0;
      el.style.outline  = 0;

      if (!el.classList.contains('photoport-element')) {
        el.classList.add('photoport-element');
      }
    },
    portRect: function () {
      return this.dom.port.getBoundingClientRect();
    },
    el: function () {
      return this.dom.root;
    },
    fitContent: function () {
      var bounds = this.portRect();
      this.dom.content.style.width = (this.sequence.length * bounds.width) + 'px';
      for(var i = this.sequence.length - 1; i >= 0; i--) {
        this.fit(this.sequence[i]);
      }
    },
    updateHandles: function () {
      var count    = this.sequence.length;
      var position = this.position;
      var dom      = this.dom;

      if (count >= 2) {
        dom.leftHandle.style.display = 'table';
        dom.rightHandle.style.display = 'table';
      } else {
        dom.leftHandle.style.display = 'none';
        dom.rightHandle.style.display = 'none';
      }
    },
    append: function (content) {
      return this.insert(content);
    },
    prepend: function (content) {
      return this.insert(content, 0);
    },
    insert: function (contentDescriptor, position) {
      if (position === undefined || position === null) {
        position = this.sequence.length;
      }

      position = Math.min(position, this.sequence.length);

      if (position < 0) {
        position = Math.max(position + this.sequence.length, 0);
      }

      if (this.position !== null && position <= this.position) {
        this.position++;
      }

      contentDescriptor.el = contentDescriptor.el || div('photo');

      if ((typeof contentDescriptor.backgroundImage) === 'string') {
        contentDescriptor.el.style.backgroundImage = "url(" + contentDescriptor.backgroundImage + ")";
        contentDescriptor.el.style.backgroundRepeat = "no-repeat";
      }

      this.sequence.splice(position, 0, contentDescriptor);
      this.fit(contentDescriptor);

      var existingContent = this.dom.content;

      for (var i = 0; i < existingContent.children.length + 1; i++) {
        if (i === position) {
          existingContent.insertBefore(contentDescriptor.el, existingContent.children[i] || null);
          break;
        }
      }

      this.fitContent();

      return this;
    },
    remove: function (content) {
      var index = this.sequence.indexOf(content);
      if (index === -1) return this;

      if (index < this.position) {
        this.position = circularDecr(this.position, this.sequence.length - 1);
      } else if (index === this.position) {
        if (this.sequence.length === 1) {
          this.position = null;
        } else {
          this.seek(circularDecr(this.position, this.sequence.length - 1));
        }
      }

      this.sequence.splice(index, 1);
      this.dom.content.removeChild(content.el);
      this.updateHandles();
      this.fitContent();
      this.el().dispatchEvent(new CustomEvent('photoport-content-remove', {
        detail: {
          removedContent: content
        }
      }));
      return this;
    },
    start: function () {
      this.fitContent();

      if (this.position === null) {
        return this.seek(0);
      }

      return this.seek(this.position);
    },
    previous: function () {
      return this.seek(circularDecr(this.position, this.sequence.length));
    },
    next: function () {
      return this.seek(circularIncr(this.position, this.sequence.length));
    },
    seek: function (newPosition) {
      if (this.sequence.length === 0) {
        throw new Error('Nothing added to Photoport');
      }

      switch(newPosition) {
        case 'last':
          newPosition = this.sequence.length - 1;
          break;
        case 'first':
          newPosition = 0;
          break;
      }

      if (newPosition >= this.sequence.length) {
        newPosition = this.sequence.length - 1;
      } else if (newPosition < 0) {
        newPosition = Math.max(0, this.sequence.length + newPosition);
      }

      var newLeft = -1 * newPosition * this.portRect().width;

      this.dom.content.style.left = newLeft + 'px';
      var previousPosition = this.position;
      this.position = newPosition;
      this.current = this.sequence[this.position];

      this.updateHandles();

      this.el().dispatchEvent(new CustomEvent('photoport-navigate', {
        detail: {
          previousPosition: previousPosition,
          newPosition: newPosition
        }
      }));

      return this;
    }
  };

  return Photoport;
})();
