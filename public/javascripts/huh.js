var Grid;

soundManager.url = '../swf/';
soundManager.flashVersion = 9;
soundManager.useFlashBlock = false;

Grid = function() {
  
  function Grid (options) {
    var self = this;
    
    self.firstInterval = 20500;

    self.options = {
      container: options.container || 'body',
      columns: options.columns || 10,
      rows: options.rows || 10
    };

    self.$grid = $(self.options.container);
    var css = {
      position: 'absolute',
      display: 'block',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    };

    $('body').css(css);
    self.$grid.css(css);
    $('<style />').html('html,body{text-decoration: none;font: normal normal normal 1.0em/1.4em "Lucida Grande", Lucida, Verdana, sans-serif;}.dance{background: url(../images/smile.png) no-repeat center center !important;}.other-way{background: url(../images/crazy-shit2.png) no-repeat center center;}.basic-way{background: url(../images/crazy-shit.png) no-repeat center center !important;}#hipster {display: block;position: absolute;overflow: hidden;width: 960px;height: 300px;margin: auto;top: 0;right: 0;left: 0;background: url(../images/hip.png) no-repeat center center;}#footer {border-top: 1px solid #888;height: 35px;line-height: 34px;text-align: center;display: block;position: absolute;bottom: 0;left: 0;right: 0;overflow: hidden;color: #000;background-color: rgba(0,0,0,0.26);text-decoration: none;font-variant: normal;text-shadow: #ddd 0 1px 0;}#footer a {color: #111;font-weight: normal;font-style: normal;text-decoration: underline;font-variant: normal;')
    .appendTo('head');

    self.$footer = $('<div id="footer" />');
    self.$footer.html('<a href="http://twitter.com/mephux">Mephux</a> | Keep it Hipster Kids!');
    self.$footer.appendTo('Body');

    self.$imageHolder = $('<div id="image-holder">');

    self.$imageHolder.addClass('basic-way').css(css).css({
      '-webkit-transition': 'all 3s ease-in-out',
      '-moz-transition': 'all 3s ease-in-out',
      '-ms-transform': 'all 3s ease-in-out',
      '-o-transition': 'all 3s ease-in-out'      
    }).appendTo('body');

    self.imageRotate = 1;
    self.imageScale = 100;

    var toggleFace = setInterval(function() {
      if (self.$imageHolder.hasClass('other-way')) {
        self.$imageHolder.removeClass('other-way');
        self.$imageHolder.addClass('basic-way');
      } else {
        self.$imageHolder.addClass('other-way');
        self.$imageHolder.removeClass('basic-way');
      }; 
    }, 5000);

    var changeImage = setInterval(function() {
      self.image();
    }, 30);

    setTimeout(function() {
      $('<div id="hipster" />').appendTo('body');
      clearInterval(toggleFace);

      self.$imageHolder.removeClass('other-way');
      self.$imageHolder.removeClass('basic-way');
      self.$imageHolder.addClass('dance');

      self.imageRotate = 20000;
      self.imageScale = 20000;
    }, 13700);

    setInterval(function() {
      clearInterval(changeImage);
      self.$imageHolder.removeClass('dance');
      self.$imageHolder.attr('style', '');

      self.$imageHolder.addClass('basic-way').css(css).css({
        '-webkit-transition': 'all 3s ease-in-out',
        '-moz-transition': 'all 3s ease-in-out',
        '-ms-transform': 'all 3s ease-in-out',
        '-o-transition': 'all 3s ease-in-out'      
      });

      self.imageRotate = 1;
      self.imageScale = 100;
      
      toggleFace = setInterval(function() {
        if (self.$imageHolder.hasClass('other-way')) {
          self.$imageHolder.removeClass('other-way');
          self.$imageHolder.addClass('basic-way');
        } else {
          self.$imageHolder.addClass('other-way');
          self.$imageHolder.removeClass('basic-way');
        }; 
      }, 5000);

      setTimeout(function() {
        clearInterval(toggleFace);

        self.imageRotate = 20000;
        self.imageScale = 20000;

        changeImage = setInterval(function() {
          self.$imageHolder.removeClass('other-way');
          self.$imageHolder.removeClass('basic-way');
          self.$imageHolder.addClass('dance');
          self.image();
        }, 30);

      self.firstInterval = 13600;

      }, self.firstInterval);

    }, 55000);

    self.build();
    return self;
  };

  Grid.prototype = {
     
    init: function() {
      var self = this;
      self.$grid.empty();

      self.width = self.$grid.width();
      self.height = self.$grid.height();
      self.count = (self.options.columns * self.options.rows)

      self.box = {
        html: $('<div class="box" />'),
        width: (self.width / self.options.columns),
        height: (self.height / self.options.rows)
      };
    },

    image: function() {
      var self = this;

      var rotate = Math.floor(self.imageRotate * Math.random());
      var scale = Math.floor(self.imageScale * Math.random());

      if (rotate % 2 == 1) {
        rotate = '-' + (rotate - 100);
      };

      if (scale % 2 == 0) {
        scale = parseFloat('-' + scale);
      };

      self.$imageHolder.css({
      '-moz-transform': 'rotate('+rotate+'deg) scale(0.'+scale+')',
      '-ms-transform': 'rotate('+rotate+'deg) scale(0.'+scale+')',
      '-o-transform': 'rotate('+rotate+'deg) scale(0.'+scale+')',
      '-webkit-transform': 'rotate('+rotate+'deg) scale(0.'+scale+')'
      });

    },

    build: function() {
      var self = this;
      self.init();

      for (var i = 0; i < self.count; i++) {
        var $box = self.box.html.clone();

        var s = i.toString().length;
        if (s < 2) {
          var i = '00' + i;
        } else if (s < 3) {
          var i = '0' + i;
        };

        $box.attr('id', 'box_' + i).css({
          display: 'block',
          position: 'reletive',
          width: self.box.width + 'px',
          height: self.box.height + 'px',
          backgroundColor: 'rgb(' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ')',
          float: 'left'
        }).appendTo(self.$grid);

        self.move = true;
      };

    }

  };

  return Grid;
}();

// <audio src="../crazyshit.ogg" autoplay='true' loop='true' preload='true' />

jQuery(document).ready(function($) {

  var grid = new Grid({
    container: '.wrapper',
    columns: 8,
    rows: 8
  });

  soundManager.onready(function() {

    var song = soundManager.createSound({
      id: "HIPSTER",
      url: 'http://www.lookycode.com/crazyshit.ogg',
      autoLoad: true,
      autoPlay: false,
      volume: 100,
      stream: true,
      loops: 100,
      onplay: function() {
        $(window).resize(function() {
          grid.build();
        });

        setInterval(function() {
          grid.build();
        }, 300);
      },
      onfinish: function() {
        var grid = new Grid({
          container: '.wrapper',
          columns: 8,
          rows: 8
        });      
      }
    });

    song.play();
  });

});


