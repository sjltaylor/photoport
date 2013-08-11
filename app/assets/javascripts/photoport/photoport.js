Photoport = (function () {

  function checkOptions (options) {
    if (!(options.container instanceof HTMLDivElement)) {
      throw "container must be an instance of HTMLDivElement but was: " + options.container;
    }
  }

  function div (className) {
    var e = document.createElement('DIV');
    e.className = className;
    return e;
  }

  function build () {
    var dom = {
      root        : div('photoport'),
      content     : div('photoport-content'),
      leftHandle  : div('photoport-handle photoport-handle-left'),
      rightHandle : div('photoport-handle photoport-handle-right')
    };

    dom.root.appendChild(dom.leftHandle);
    dom.root.appendChild(dom.content);
    dom.root.appendChild(dom.rightHandle);

    return dom;
  }

  function Photoport (options) {
    checkOptions(options);
    this.container = options.container;
    this.dom = build();
    this.container.appendChild(this.dom.root);
    this.__sequence__ = [];
  }

  Photoport.prototype = {
    __subsume__: function (item) {
      var bounds = this.dom.content.getBoundingClientRect();

      item.el.style.width  = bounds.width  + 'px';
      item.el.style.height = bounds.height + 'px';
      if (!item.el.classList.contains('photoport-shadow')) {
        item.el.classList.add('photoport-shadow');
      }
    },
    add: function (item) {
      this.__subsume__(item);
      this.sequence().push(item);
      return this;
    },
    start: function () {
      // mindlessly appends child nodes...
      console.warn('needs work', this);
      var sequence = this.sequence();
      this.dom.content.appendChild(sequence[0].el);

      for (var i = 0; i < sequence.length; i++) {
        this.__subsume__(sequence[i]);
      }
    },
    sequence: function () {
      return this.__sequence__;
    },
    teardown: function () {
      // remove all of the dom
      // remove all event handlers
    }
  };

  return Photoport;
})();
