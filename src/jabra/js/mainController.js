clientaddin.controller('MainController', function($scope, $rootScope,$log ,JabraDeviceService){
    $scope.$watch(function () {
        return JabraDeviceService.isConnected();
    }, function (data) {
        $scope.isConnected = data;
    }, true);

    $scope.$watch(function () {
        return JabraDeviceService.isConnecting();
    }, function (data) {
        $scope.isConnecting = data;
    }, true);

    $scope.connect = function(){
        JabraDeviceService.connect();
    }

    $scope.$watch(function () {
        return JabraDeviceService.devices();
    }, function (data) {
        $scope.devices = data;
    }, true);

    $scope.$watch(function () {
        return JabraDeviceService.activeDevice();
    }, function (data) {
        $scope.activeDevice = data;
    }, true);
});
