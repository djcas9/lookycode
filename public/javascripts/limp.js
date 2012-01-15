var Limp;

Limp = function() {

  function Limp(routes, options) {
    if (!(this instanceof Limp)) return new Limp(routes, options);

    var self = this;

    self.routes = routes;
    self.hasPushState = true;
    self.delimiter = '/';

    if (!window.history || !window.history.pushState) {
      self.hasPushState = false;
    };

    return self;
  };

  Limp.prototype = {
    
    //
    // Init
    //
    init: function() { 
      var self = this;
      console.log(window.location);

      self.parseRoutes();
      self.monitor();
    },

    //
    // Parse Routes
    //
    parseRoutes: function() {
      var self = this;
      
      for (r in self.routes) {
        var data = r.split(self.delimiter).filter(String);

        console.log(data)
        console.log(r)
      }
    },

    //
    //
    //
    parseLocation: function() {
      var self = this;
      self.current = window.location.hash;

      var hash = {};

      hash.location = window.location.hash.replace('#/', '/');
      hash.params = "";

      return hash;
    },

    //
    // Monitor
    //
    monitor: function() {
      var self = this;

      if (("onhashchange" in window) && !($.browser.msie)) {
        window.onhashchange = function () {
          var hash = self.parse();

          console.log(hash);
          self.routes[hash.location]();

          hash.each(function(data) {
            console.log(data) 
          });

          return false;
        };
      } else {
        var prevHash = window.location.hash;
        window.setInterval(function () {
          if (window.location.hash != prevHash) {
            storedHash = window.location.hash;
            alert(window.location.hash);
          }
        }, 100);
      };
    },


  };

  return Limp;
}();
