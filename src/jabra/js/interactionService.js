clientaddin.factory('InteractionService', function ($rootScope, $log, QueueService, IcwsSessionService) {

      return{
        answerAlertingCall: function(){
            var alertingInteractionId = QueueService.alertingInteraction()
            if(alertingInteractionId != null){
                IcwsSessionService.post('/interactions/'+ alertingInteractionId + '/pickup')
            }
        },
        disconnectConnectedCall: function(){
          $log.debug("disconnecting selected call")
          var selectedCallId = QueueService.connectedCall();

          if(selectedCallId == null){
            return;
          }

          $log.debug("Disconnecting " + selectedCallId);

          IcwsSessionService.post('/interactions/'+ selectedCallId + '/disconnect')
        }
      }

});
