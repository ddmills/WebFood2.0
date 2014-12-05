/*
 * A script that handles data from the Service module
 * This includes the Locations, Menus, and Items
 */
function Data(vm) {
  var self = this;
  var empty = {
    description     : 'loading',
    imageName       : 'loading',
    condimentIds    : [],
    longDescription : '',
    id              : '-1'
  }
  /* arrays of web food data */
  self.locations  = ko.observableArray();
  self.items      = ko.observableArray();
  self.menus      = ko.observableArray();
  self.condiments = ko.observableArray();
  self.curItem    = ko.observable(empty);
  self.curCond    = ko.observableArray();

  self.selectItem = function(item) {
    console.log(item)
    self.curItem(item);
    self.getCondiments(self.curItem().condimentIds);
  }

  /* Split location array into rows of 2 */
  self.locationRows = ko.computed(function() {
    var locations = self.locations();
    var result = [];
    for (var i = 0; i < locations.length; i += 2) {
      result.push(locations.slice(i, i+2));
    }
    return result;
  });

  self.getCondiments = function(condArray) {
    // var conds = self.condiments();
    self.curCond(self.condiments().filter(function(ele) {
      return (condArray.indexOf(ele.id.toUpperCase()) > -1);
    }));
    console.log(self.curCond());
  }

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

  /* Change the menu whenever the selected location changes */
  vm.location.subscribe(function(newval) {
    var location = newval;
    self.condiments.removeAll();
    self.menus.removeAll();
    ParseData.getMenu(location).then(function(data) {
      data.entreeMenus.forEach(function(val) {
        self.menus.push(val);
      });
      data.condimentMenus.forEach(function(val) {
        self.condiments.push(val);
      });
      console.log(self.condiments());
      $('img[data-failover]').error(function(){
        var failover = $(this).data('failover');
        if (this.src != failover){
          this.src = failover;
        }
      });
    });
  });
}
