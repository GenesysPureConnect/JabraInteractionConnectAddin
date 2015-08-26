var clientaddin = angular.module('connectaddin',[]);


//from http://solutionoptimist.com/2013/10/07/enhance-angularjs-logging-using-decorators/
clientaddin.config([ "$provide", function( $provide )
{
    // Use the `decorator` solution to substitute or attach behaviors to
    // original service instance; @see angular-mocks for more examples....
    $provide.decorator( '$log', [ "$delegate", function( $delegate )
    {
        // Save the original $log.debug()
        var debugFn = $delegate.debug;
        var errorFn = $delegate.error;



        $delegate.debug = function( )
        {
            var args    = [].slice.call(arguments)

            // Prepend timestamp
            args[0] = "JABRA_ADDIN - " +  args[0];

            // Call the original with the output prepended with formatted timestamp
            debugFn.apply(null, args)
        };

        
        $delegate.error = function( )
        {
            var args    = [].slice.call(arguments)

            // Prepend timestamp
            args[0] = "JABRA_ADDIN - " +  args[0];

            // Call the original with the output prepended with formatted timestamp
            errorFn.apply(null, args)
        };

        return $delegate;
    }]);
}]);
