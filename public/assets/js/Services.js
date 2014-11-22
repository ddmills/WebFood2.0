/*
 * A script that handles data from the Service module
 * This includes the Locations, Menus, and Items (log in, register)
 */
function Data() {
  var self = this;

  /* array of locations - filled with initialize() function */
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

  /* parse the locations xml - returns a promise */
  ParseData.getLocations().then(function(data) {
    data.forEach(function(val) {
      self.locations.push(val);
    });
    console.log(data);
  });
}
