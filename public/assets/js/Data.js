/*
 * A script that handles data from the Service module
 * This includes the Locations, Menus, and Items
 */
function Data(vm) {
  var self = this;

  console.log(vm.location());
  /* arrays of web food data */
  self.locations = ko.observableArray();
  self.items     = ko.observableArray();
  self.menus     = ko.observableArray();

  self.locationRows = ko.computed(function() {
    var locations = self.locations();
    var result = [];
    for (var i = 0; i < locations.length; i += 2) {
      result.push(locations.slice(i, i+2));
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
  });

  self.menu = ko.observableArray();
  self.condiments = ko.observableArray();

  /* parse the menus xml */
  vm.location.subscribe(function(newval) {
    var location = newval;
    self.condiments.removeAll();
    self.menu.removeAll();
    ParseData.getMenu(location).then(function(data) {
      data.entreeMenus.forEach(function(val) {
        self.menu.push(val);
      });
      data.condimentMenus.forEach(function(val) {
        self.condiments.push(val);
      });
      // self.selectSubmenu(-1);
      console.log(self.menu());
      $('img[data-failover]').error(function(){
        var failover = $(this).data('failover');
        if (this.src != failover){
          this.src = failover;
        }
      });
    });
  });
}
