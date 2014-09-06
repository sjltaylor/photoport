Photoport.Deferred = function Deferred () {
  this.isResolved = false;
  this.queues = {
    done: []
  };
};

Photoport.Deferred.prototype = {
  resolve: function () {
    if (this.isResolved) return this;

    this.isResolved = true;

    this.queues.done.forEach(function (cb) {
      cb();
    });

    this.queues.done = null;

    return this;
  },
  done: function (cb) {
    if (typeof cb !== 'function') return;

    if (this.isResolved) {
      setTimeout(cb, 0);
    } else {
      this.queues.done.push(cb);
    }
    return this;
  }
};
