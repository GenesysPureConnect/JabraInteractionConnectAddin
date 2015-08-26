//This service is used to kick of any initialization that has to be done after the addin is loaded
//On load of the addin view, addinInitializationServiceCallback() will be called which lets us know that it is safe to
//call the addin namespace.  InitializationService will send out a broadcast that it is safe to finish loading.
function addinInitializationServiceCallback(){
    window.isInitialized = true;
}
clientaddin.factory('InitializationService', function ($rootScope, $window, $log, $interval) {
    myTimeout = $interval(function(){
        if($window.isInitialized == true)
        {
            $log.debug("Addin is loaded");
            $rootScope.$broadcast("initialize",null);
            $interval.cancel(myTimeout);
        }

    }, 1000);

    return{};

});
