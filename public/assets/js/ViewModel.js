/* knockout viewmodel */
var vm = {
  User      : new User(),
  Views     : new Views(),
  Data      : new Data()
};
pager.extendWithPage(vm);
ko.applyBindings(vm);
pager.start();
