clientaddin.factory('QueueService', function ($rootScope, $log, InitializationService) {

    interactions={};
    queue = null;

    function startWatches(){
        queue = new ININ.Addins.IC.Queues.Queue();

        queue.on("interactionAdded", function(addedInteraction) {
            $log.debug("The ", addedInteraction.getAttribute(ININ.Addins.IC.Interactions.attributeNames.interactionType),
            "interaction with ID", addedInteraction.interactionId, "was added to the queue.");

            interactions[addedInteraction.interactionId] = addedInteraction;

            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        });
        queue.on("interactionChanged", function(changedInteraction) {
            $log.debug("The interaction with ID", changedInteraction.interactionId, "was changed.");

            interactions[changedInteraction.interactionId] = changedInteraction;

            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        });
        queue.on("interactionRemoved", function(removedEvent) {
            $log.debug("The interaction with ID", removedEvent.interactionId, "was removed.");

            delete interactions[removedEvent.interactionId];

            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        });
        queue.subscribe({
            queueIds: [{
                type: ININ.Addins.IC.Queues.queueTypes.user,
                name: ININ.Addins.IC.sessionInfo.userId
            }],
            attributeNames: [
                ININ.Addins.IC.Interactions.attributeNames.state,
                ININ.Addins.IC.Interactions.attributeNames.interactionType
            ]
        });
    }

    $rootScope.$on('initialize', function (event, data) {
        if(ININ.Addins.IC.sessionInfo.connected == true){
            startWatches();
        }

        ININ.Addins.IC.sessionInfo.on("connected", function(sessionInfo) {
            startWatches();
        });
    });

    return{
        getInteractions: function(){return interactions;}
    };

});
