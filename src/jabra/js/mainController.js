clientaddin.controller('MainController', function($scope, $rootScope,JabraDeviceService, QueueService){
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
});
