/*
 * A script that handles data from the Service module
 * This includes the Locations, Menus, and Items (log in, register)
 */
function Data() {
  var self = this;

  /* array of locations - filled with initialize() function */
  self.locations = ko.observableArray();
  self.items = {};
  self.menus = {};


  /* parse the locations xml - returns a promise */
  ParseData.getLocations().then(function(data) {
    self.locations = ko.observableArray(data);
    // for (var i = 0; i < data.length; i++) {
    //   self.locations.push(data[i]);
    //   console.log('pushed');
    // }
    console.log(data);
    // console.log(self.locations);
  });
}
