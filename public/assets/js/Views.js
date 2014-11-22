function Views() {
  var self = this;

  self.current = 'locations';

  self.views = {
    'locations' : {
      name     : 'locations',
      element  : '#view-locations' },
    'menus' : {
      name    : 'menus',
      element : '#view-menus' },
    'items' : {
      name    : 'items',
      element : '#view-items' }
  };

  self.showView = function(name) {
    self.current = name;
    var view = self.views[name];

    $('view-active').removeClass('view-active');
    $(view.element).addClass('view-active');

  }

  /* show the current view */
  self.showView(self.current);
}
