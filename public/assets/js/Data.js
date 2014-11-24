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
      var hours = [];
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      /* populate all seven days */
      for (var i = 0; i < 7; i++) {
        found = false;
        for (var j = 0; j < 7; j++) {
          if (val.hours[j]) {
            var inf_day = val.hours[j].substr(0, 3);
            if (inf_day == days[i]) {
              hours.push(val.hours[j]);
              found = true;
              break
            }
          }
        }
        if (!found) { hours.push(days[i] + ': Closed'); }
      }

      val.hours = hours;

      self.locations.push(val);
    });
    console.log(data);
  });

  self.menu = {
    'submenu'  : ko.observableArray(),
    'sides'    : ko.observableArray(),
    'selected' : ko.observable(-1),
    'items'    : ko.observableArray()
  };

  self.selectSubmenu = function(indx) {
    self.menu.items.removeAll();
    if (indx = -1) {
      self.menu.submenu().forEach(function(val) {
        console.log(val);
        val['items'].forEach(function(d) {
          self.menu.items.push(d);
        });
      });
    } else {
      var sub = self.menu.submenu()[indx];
      sub.forEach(function(val) {
        self.menu.items.push(val);
      });
    }
    self.menu.selected(indx);
  }

  /* parse the menus xml */
  self.getMenu = function(location) {
    ParseData.getMenu(location).then(function(data) {
      console.log(data);
      self.menu.submenu.removeAll();
      self.menu.sides.removeAll();
      data.entreeMenus.forEach(function(val) {
        self.menu.submenu.push(val);
      });
      data.condimentMenus.forEach(function(val) {
        self.menu.sides.push(val);
      });
      self.selectSubmenu(-1);
    });
  }
}
