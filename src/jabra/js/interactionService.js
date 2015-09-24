clientaddin.factory('InteractionService', function ($rootScope, $log, QueueService, IcwsSessionService) {

      return{
        answerAlertingCall: function(){
            var alertingInteractionId = QueueService.alertingInteraction()
            if(alertingInteractionId != null){
                IcwsSessionService.post('/interactions/'+ alertingInteractionId + '/pickup')
            }
        },
        disconnectSelectedCall: function(){
          $log.debug("disconnecting selected call")
          var selectedCallId = ININ.Addins.IC.Interactions.selectedInteraction.interactionId;

          if(selectedCallId == null){
            return;
          }

          $log.debug("Disconnecting " + selectedCallId);

          IcwsSessionService.post('/interactions/'+ selectedCallId + '/disconnect')
        }
      }

});
