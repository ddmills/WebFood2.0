function Views() {
  var self = this;
  /* The current view */
  self.current = ko.observable('locations');

  /* list of all views */
  self.views = {
    'locations' : {
      name     : 'locations',
      element  : '#view-locations' },
    'menus' : {
      name     : 'menus',
      element  : '#view-menus' },
    'items' : {
      name    : 'items',
      element : '#view-items' }
  };

  /* Show view with given name */
  self.show = function(name) {
    self.current(name);
    var view = self.views[name];

    $('.view-active').removeClass('view-active');
    $(view.element).addClass('view-active');
  }

  /* Show menu with given ID */
  self.showMenu = function(id) {
    vm.Data.getMenu(id);
    self.show('menus');
  }

  /* show the current view */
  self.show(self.current());
}
