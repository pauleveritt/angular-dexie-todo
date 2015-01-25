function ModuleConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('layout', {
             abstract: true,
             templateUrl: 'templates/layout.html',
             controller: 'LayoutController as ctrl',
             controllerAs: 'ctrl'
           })
    .state('groups', {
             url: '/',
             parent: 'layout',
             template: '<h2>groups</h2>'
           });
  $urlRouterProvider.otherwise("/");
}

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

angular.module('app', ['ui.router', 'idb.utils'])
  .config(ModuleConfig)
  //.run(ModuleRun);