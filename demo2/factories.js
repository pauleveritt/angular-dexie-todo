function BoundQueryFactory($log, ngDexie) {
  var _this = this;
  _this.storage = null;
  _this.query = null;

  //$rootScope.$on('reacht-newgeneration', function () {
  //  _this.request.counter++;
  //});

  ngDexie.db.on('changes', function (changes) {
    for (var index = 0; index < changes.length; index++) {
      if (changes[index].table === _this.storage) {
        _this.query();
        $log.debug('Changed query data');
        break;
      }
    }
  });

  return function (storage, query, defaultValue) {
    _this.storage = storage;
    _this.query = query;
    _this.defaultValue = defaultValue;

    // Run query the first time
    query();
  }
}

angular.module('app')
  .factory('BoundQuery', BoundQueryFactory);