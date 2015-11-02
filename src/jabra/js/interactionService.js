clientaddin.factory('InteractionService', function ($rootScope, $log, QueueService, IcwsSessionService) {

      return{
        answerAlertingCall: function(){
            var alertingInteractionId = QueueService.alertingInteraction()
            if(alertingInteractionId != null){
                IcwsSessionService.post('/interactions/'+ alertingInteractionId + '/pickup')
            }
            else{
              throw "can't find call"
            }
        },
        disconnectConnectedCall: function(){
          $log.debug("disconnecting selected call")
          var selectedCallId = QueueService.connectedCall();

          if(selectedCallId == null){
            throw "can't find call"
          }

          $log.debug("Disconnecting " + selectedCallId);

          IcwsSessionService.post('/interactions/'+ selectedCallId + '/disconnect')
        },
        holdConnectedCall: function(onSuccess, onFailure){
            var selectedCallId = QueueService.connectedCall()
            if(selectedCallId != null){
                IcwsSessionService.post('/interactions/'+ selectedCallId + '/hold',{on:true}, onSuccess, onFailure)
            }else{
              if(onFailure){
                onFailure();
              }
            }
        },
        pickupHeldCall: function(onSuccess, onFailure){
            var selectedCallId = QueueService.heldInteraction()
            if(selectedCallId != null){
                IcwsSessionService.post('/interactions/'+ selectedCallId + '/pickup', null, onSuccess, onFailure)
            }else{
              if(onFailure){
                onFailure();
              }
            }
        }
      }

});
