/*
 * A script that handles data from the Service module
 * This includes the Locations, Menus, and Items
 */
function Data() {
  var self = this;
  /* arrays of web food data */
  self.locations = ko.observableArray();
  self.items     = ko.observableArray();
  self.menus     = ko.observableArray();

  self.locationRows = ko.computed(function() {
    var locations = self.locations();
    var result = [];
    for (var i = 0; i < locations.length; i += 3) {
      result.push(locations.slice(i, i+3));
    }
    console.log(result);
    return result;
  });

  /* parse the locations xml */
  ParseData.getLocations().then(function(data) {
    data.forEach(function(val) {
      self.locations.push(val);
    });
    console.log(data);
  });

  self.menu = {
    'entrees' : ko.observableArray(),
    'sides'   : ko.observableArray()
  };

  /* parse the menus xml */
  self.getMenu = function(location) {
    ParseData.getMenu(location).then(function(data) {
      console.log(data);
      self.menu.entrees.removeAll();
      self.menu.sides.removeAll();
      data.entreeMenus.forEach(function(val) {
        self.menu.entrees.push(val);
      });
      data.condimentMenus.forEach(function(val) {
        self.menu.sides.push(val);
      });
    });
  }
}
