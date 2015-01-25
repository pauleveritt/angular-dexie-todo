function AppController(ngDexie) {

  ngDexie.bind = function ($scope, key, def) {
    if (angular.isUndefined($scope.$eval(key))) {
      $parse(key).assign($scope, this.get(key, def));
      if (!this.has(key)) this.put(key, def);
    }

    var self = this;
    this._watchers[key + $scope.$id] = $scope.$watch(key, function (newVal) {
      if (angular.isDefined(newVal)) self.put(key, newVal);
    }, angular.isObject($scope[key]));

    return this;
  };

  var ctrl = this;
  ctrl.todos = [];
  ctrl.newTitle = '';

  var refresh = function () {
    ngDexie.list('todo')
      .then(function (data) {
              ctrl.todos = data;
            });
  };

  // Initial refresh
  refresh();

  ngDexie.db.on('changes', function (changes) {
    for (var index = 0; index < changes.length; index++) {
      if (changes[index].table === 'todo') {
        refresh();
        break;
      }
    }
  });

  ctrl.addToDo = function (newTitle) {
    ngDexie.put('todo', {text: newTitle, _id: String(Date.now())})
      .then(function () {
              ctrl.newTitle = '';
            });
  };

  ctrl.deleteToDo = function (id) {
    ngDexie.delete('todo', id);
  };
}

angular.module('app')
  .controller('AppController', AppController);
