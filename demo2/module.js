function ModuleRun($log, ngDexie) {
  var configuration = function (db) {
    db.version(1).stores(
      {todo: '_id'}
    );
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
  .run(ModuleRun);