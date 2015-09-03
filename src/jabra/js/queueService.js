clientaddin.factory('QueueService', function ($rootScope, $log, InitializationService) {

  interactions={};
  queue = null;

  function broadcastConnectedInteractionCount(){

    var interactionCount = 0;

    for(var id in interactions){
      var interaction = interactions[id];

      if(interaction.getAttribute(ININ.Addins.IC.Interactions.attributeNames.state) != ININ.Addins.IC.Interactions.stateAttributeValues.internalDisconnect &&
      interaction.getAttribute(ININ.Addins.IC.Interactions.attributeNames.state) != ININ.Addins.IC.Interactions.stateAttributeValues.externalDisconnect
    ){
      interactionCount ++;
    }
  }

  $rootScope.$broadcast("ConnectedInteractionCount" , interactionCount);

}

function startWatches(){
  queue = new ININ.Addins.IC.Queues.Queue();

  queue.on("interactionAdded", function(addedInteraction) {
    /*
    if(addedInteraction.getAttribute(ININ.Addins.IC.Interactions.attributeNames.interactionType) !==
    ININ.Addins.IC.Interactions.attributeNames.interactionType.call){
    return;
  }
  */
  $log.debug("The ", addedInteraction.getAttribute(ININ.Addins.IC.Interactions.attributeNames.interactionType),
  "interaction with ID", addedInteraction.interactionId, "was added to the queue.");

  interactions[addedInteraction.interactionId] = addedInteraction;

  if (!$rootScope.$$phase) {
    $rootScope.$apply();
  }

  if(addedInteraction.getAttribute(ININ.Addins.IC.Interactions.attributeNames.state) == ININ.Addins.IC.Interactions.stateAttributeValues.alerting ||
  addedInteraction.getAttribute(ININ.Addins.IC.Interactions.attributeNames.state) == ININ.Addins.IC.Interactions.stateAttributeValues.offering){
    $rootScope.$broadcast("InteractionAlerting" , null);
  }else{
    broadcastConnectedInteractionCount();
  }

});
queue.on("interactionChanged", function(changedInteraction) {
  /*    if(changedInteraction.getAttribute(ININ.Addins.IC.Interactions.attributeNames.interactionType) !==
  ININ.Addins.IC.Interactions.attributeNames.interactionType.call){
  return;
}
*/
$log.debug("The interaction with ID", changedInteraction.interactionId, "was changed.");

interactions[changedInteraction.interactionId] = changedInteraction;

broadcastConnectedInteractionCount();

if (!$rootScope.$$phase) {
  $rootScope.$apply();
}
});
queue.on("interactionRemoved", function(removedEvent) {
  $log.debug("The interaction with ID", removedEvent.interactionId, "was removed.");

  //if(interactions[removedEvent.interactionId]){
  delete interactions[removedEvent.interactionId];

  if (!$rootScope.$$phase) {
    $rootScope.$apply();
  }

  broadcastConnectedInteractionCount();
  //  }
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
  getInteractions: function(){return interactions;},
  getInteractionCount: function(){ return Object.keys(interactions).length;},
  hasAlertingInteraction: function(){
    for(var id in interactions){
      var interaction = interactions[id];

      if(interaction.getAttribute(ININ.Addins.IC.Interactions.attributeNames.state) === ININ.Addins.IC.Interactions.stateAttributeValues.alerting ||
      interaction.getAttribute(ININ.Addins.IC.Interactions.attributeNames.state) === ININ.Addins.IC.Interactions.stateAttributeValues.offering)
    {
      return true;
    }

  }
  return false;
}
};

});
