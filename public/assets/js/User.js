/*
 * A script that handles common user functions (log in, register)
 */
function User() {
  var self = this;

  /* basic user params - filled on login */
  self.name    = ko.observable(''),
  self.id      = ko.observable(''),
  self.created = ko.observable(''),
  self.logged  = ko.observable(false),

  /* user login - returns a promise */
  self.login = function(username, password) {
    var promise = $.post('/auth/login', {
      'username': username,
      'password': password
    });

    /* execute when login succeeds */
    promise.done(function(data) {
      self.id      (data.user._id);
      self.created (data.user.created_at);
      self.name    (data.user.username);
      self.logged  (true);
    });

    return promise;
  }
}
