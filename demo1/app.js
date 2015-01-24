(function () {

  function AppController($scope, ngDexie) {
    //var db = new Dexie('todos');
    //db.version(1).stores({todo: '_id'});
    //db.open();

    var ctrl = this;
    ctrl.todos = [];
    ctrl.newTitle = '';

    var load = function () {
      ngDexie.list('todo')
        .then(function (data) {
                ctrl.todos = data;
              });
    };

    // Initial load
    load();

    ngDexie.db.on('changes', function (changes) {
      for (var index = 0; index < changes.length; index++) {
        if (changes[index].table === 'todo') {
          load();
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

  function ModuleRun($log, ngDexie) {
    var configuration = function (db) {
      db.version(1).stores({
                             todo: '_id'
                           });
      db.on('error', function (err) {
        $log.error("db error", err);
      });
    };

    ngDexie.init('ToDoList', configuration, false)
      .then(function () {
              $log.debug('Opened ToDoList Database');
            });

  }

  angular.module('app', ['idb.utils'])
    .run(ModuleRun)
    .controller('AppController', AppController);

}());
