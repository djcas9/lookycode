var GitHub;
var Owner;
var Repo;

// Custom sorting plugin
(function($) {
  $.fn.sorted = function(customOptions) {
    var options = {
      reversed: false,
      by: function(a) { return a.text(); }
    };
    $.extend(options, customOptions);
    $data = $(this);
    arr = $data.get();
    arr.sort(function(a, b) {
      var valA = options.by($(a));
      var valB = options.by($(b));
      if (options.reversed) {
        return (valA < valB) ? 1 : (valA > valB) ? -1 : 0;				
      } else {		
        return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;	
      }
    });
    return $(arr);
  };
})(jQuery);

var __bind = function(fn, me) { 
  return function(){ return fn.apply(me, arguments) }; 
};

function render(source, data) {
  var template = Handlebars.compile(source);
  return template(data);
}

Handlebars.registerHelper('repo-description', function(description) {
  if (description != null && description.length > 0) {
    return description;
  } else {
    return 'This repository description is currently unavailable.';
  };
});

Handlebars.registerHelper('truncate', function(string, length, message) {
  if (string != null && string.length > 0) {
    if (string.length > length) {
      return string.substring(0,length) + '...';
    } else {
      return string;
    };
  } else {
    return message;
  };
});

Handlebars.registerHelper('nil', function(data) {
  if (data != null && data.length > 0) {
    return data;
  } else {
    return '☹ Not Available';
  };
});

Handlebars.registerHelper('fullname', function() {
  if (this.name != null && this.name.length > 0) {
    return this.name;
  } else {
    return this.login;
  };
});

Handlebars.registerHelper('link', function(url) {
  if (url != null) {
    return url;
  } else {
    return '#';
  };
});

function error(data) {
  var error = $('<div id="error"></div>').css('opacity', 0);
  error.html('<div class="error-message">'+data.message+'</div>');
  $('#wrapper').css('opacity',0.1);
  $('body').prepend(error);
  error.animate({opacity: 1}, 200);
  console.log(data);
};

function userLoader () {
  $('#user .inside').html("<div id='user-loading'></div>");
}

GitHub = (function() {
  
  function GitHub(username) {
    var self = this;
    this.name = username;
    var raw = { 
      user: null, 
      repos: null
    };
    
    self.fetchUser();
  };
  
  GitHub.prototype.fetchUser = function() {
    var self = this;
    $.ajax({
      url: 'https://api.github.com/users/' + this.name,
      type: 'GET',
      dataType: 'jsonp',
      complete: function(xhr, textStatus) {
        //called when complete
      },
      success: function(json, textStatus, xhr) {
        self.user = json.data;
        self.fetchRepos();
      },
      error: function(xhr, textStatus, errorThrown) {
        self.userError();
      }
    });
  };
  
  GitHub.prototype.fetchRepos = function() {
    var self = this;
    
    $.ajax({
      url: 'https://api.github.com/users/'+this.name+'/repos',
      type: 'GET',
      dataType: 'jsonp',
      complete: function(xhr, textStatus) {
        //called when complete
      },
      success: function(data, textStatus, xhr) {
        var repos = data.data;
        $('#page').html("<ul id='repos' class='repos'></ul>");

        var count = 1;
        for (var i=0; i < repos.length; i++) {
          if (count == 1) {
            repos[i].klass = 'first'
            self.addUserRepo(repos[i]);
            count++
          } else if (count == 2) {
            repos[i].klass = 'middle'
            self.addUserRepo(repos[i]);
            count++
          } else {
            repos[i].klass = 'last'
            self.addUserRepo(repos[i]);
            count = 1;
          };

        };

        if (self.user) {
          self.user.repos = data.data;
          self.addUserInformation();
        } else {
          self.userError();
        };

        $('#page #repos').css({
          opacity: 0
        });
        $('#page #repos').stop().animate({
          'opacity': 1
        }, 500);
      },
      error: function(xhr, textStatus, errorThrown) {
        self.repoError();
      }
    });
  };
  
  GitHub.prototype.userError = function() {
    var user = new Handlebars.SafeString(self.name).string;
    error({
      message: '<s>We</s> You were unable to fetch this users github information.',
      user: user
    });
  };
  
  GitHub.prototype.repoError = function() {
    var user = new Handlebars.SafeString(self.name).string;
    error({
      message: '<s>We</s> You were unable to fetch the repository list from github.',
      user: user
    });
  };
  
  GitHub.prototype.addUserRepo = function(repo) {
    var self = this;
    
    var source = " \
      <li class='repo {{klass}}' data-size='{{size}}' data-lang='{{language}}' data-fork='{{fork}}'> \
        <div class='inside'> \
          <div class='repo-title'> \
            <div class='repo-name'>{{name}}</div> \
            <div class='repo-size'>{{size}} KB</div> \
          </div> \
          <div class='repo-metadata'> \
            <div class='repo-description'>{{truncate description 130 \"This repository description is currently unavailable.\"}}</div> \
          </div> \
          <div class='repo-footer'> \
            <div class='repo-box first'>{{watchers}}<div class='box-title'>Watchers</div></div> \
            <div class='repo-box'>{{open_issues}}<div class='box-title'>Open Issues</div></div> \
            <div class='repo-box last'>{{forks}}<div class='box-title'>Forks</div></div> \
          </div> \
        </div> \
      </li>";
      
    $('#page ul#repos').append(render(source, repo));
  };
  
  GitHub.prototype.addUserInformation = function() {
    var self = this;
    //https://github.com/postmodern/followers
    //https://github.com/postmodern/following
    var source = " \
    <div id='user-information'> \
      <div class='detail'> \
        <div id='avatar'> \
          <img width='80' height='80' src='{{avatar_url}}' /> \
        </div> \
        <div id='name'>{{fullname}} <span class='username'>({{login}})</span></div> \
        <ul id='more'> \
          <li><div class='key'>Company</div> <div class='value'>{{nil company}}</div></li> \
          <li><div class='key'>Website</div> <div class='value'><a href='{{link blog}}'>{{nil blog}}</a></div></li> \
          <li><div class='key'>Location</div> <div class='value'>{{nil location}}</div></li> \
        </ul> \
      </div> \
      <ul id='user-info'> \
        <li> \
          <div class='user-inside'> \
            <a href='https://github.com/{{login}}/followers' target='_blank'> \
              <div class='info-title green'>followers</div><div class='info-count'>{{followers}}</div> \
            </a> \
          </div> \
        </li> \
        <li> \
          <div class='user-inside'> \
            <div class='info-title blue'>following</div><div class='info-count'>{{following}}</div> \
          </div> \
        </li> \
        <li> \
          <div class='user-inside'> \
            <a href='https://gist.github.com/{{login}}' target='_blank'> \
              <div class='info-title orange'>public gists</div><div class='info-count'>{{public_gists}}</div> \
            </a> \
          </div> \
        </li> \
        <li> \
          <div class='user-inside'> \
            <div class='info-title red'>public repos</div><div class='info-count'>{{public_repos}}</div> \
          </div> \
        </li> \
      </ul> \
    </div>";
    $('#user .inside').html(render(source, self.user));
  };
  
  return GitHub;
})();

Owner = (function() {
  
  function Owner(user) {
    this.name = user.login;
  };
  
  Owner.prototype.toHTML = function() {
    return '<strong>' + this.name + '</strong><br />';
  };
  
  return Owner;
})();

Repo = (function() {
  function Repo(repository) {
    return repository;
  };
  
  Repo.prototype.toHTML = function() {
    return '<strong>' + this.name + '</strong><br />';
  };
  
  return Repo;
})();

jQuery(document).ready(function($) {
  $('form#find-user').submit(function(event) {
    event.preventDefault();
    var self = this;
    var username = $('input', this).attr('value');
    
    if (username.length > 0) {
        
      $('#page #repos').stop().animate({
        'opacity': 0
      }, 500, function() {
        userLoader();
        $('#page').attr('style', '') //.html('<div id="loading">Loading...</div>');
        new GitHub(username);
        $('title').html('Lookycode - ' + username);

        if (history && history.pushState) {
    			history.pushState(null, document.title, username);
    		};
    		
        $('input', self).blur();
      });
    };
  });
  
  $('#error').live('click', function(event) {
    event.preventDefault();
    $(this).animate({
      opacity: 0
      }, 500, function() {
      $(this).remove();
      $('#wrapper').fadeTo('fast', 1);
    });
  });
  
});
