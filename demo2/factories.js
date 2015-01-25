function BoundQueryFactory($rootScope) {
  var _this = this;
  _this.request = {
    counter: 0
  };

  $rootScope.$on('reacht-newgeneration', function () {
    _this.request.counter++;
  });
  return function (query, storages) {
    // Query is a way to express how you want the data found. It can
    // be done as declarative (an object) or imperative (a function,
    // or an array of functions run as a chain of promises.
    //
    // A simple query can pass in these items in the object:
    //
    // storage: a string with the name of the IndexedDB storage to use
    //
    // The result is a promise that resolves to the value stored here

    // Storages is a way to help the
    _this.request.counter++;
    return _this.request;
  }
}

angular.module('app')
  .factory('BoundQuery', BoundQueryFactory);