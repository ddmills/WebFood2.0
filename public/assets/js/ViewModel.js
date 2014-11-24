/* knockout viewmodel */
var vm = {};
vm.location = ko.observable();
vm.User     = new User(vm),
vm.Views    = new Views(vm),
vm.Data     = new Data(vm),

pager.extendWithPage(vm);
ko.applyBindings(vm);
pager.start();
