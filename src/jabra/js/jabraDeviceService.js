clientaddin.factory('JabraDeviceService', function($interval, $rootScope, $log, WebsocketService, QueueService, InteractionService){
    isConnected = false;
    isConnecting = false;
    hookState = null;
    holdState= null;
    muteState = null;
    devices = [];
    activeDevice = '';
    onOkGetDeviceState = false;
    interactionCount = 0;
    offHookState = false;

    deviceevent = {
        DeviceAdded: 'DeviceAdded ',
        DeviceRemoved: 'DeviceRemoved ',
        AcceptCall:'AcceptCall',
        EndCall:'EndCall',
        Device:'Device ',
        ActiveDevice:'ActiveDevice ',
        HoldState:'State HoldState is ',
        HookState: 'State OffhookState is ',
        ConfirmRequestOk : 'ConfirmRequestOk'
    }

    command = {
        DeviceAdded: 'DeviceAdded',
        DeviceRemoved: 'DeviceRemoved',
        Ring:'Ring',
        OffHook :'OffHook',
        OnHook : 'OnHook',
        GetDevices:'GetDevices',
        GetActiveDevice:'GetActiveDevice',
        SetActiveDevice: 'SetDevice ',
        GetState: 'GetState'
    }

    function angularApply(){
      if (!$rootScope.$$phase) {
          $rootScope.$apply();
      }
    }

    function sendCommand(command){
        $log.debug("sending command " + command);
        ws.send(command);
    }

    function handleMessage(data){
        if(data.indexOf(deviceevent.Device) == 0){
            devices.push(data.replace(deviceevent.Device,""));
        }
        else if(data.indexOf(deviceevent.DeviceAdded) ==0){
            devices.push(data.replace(deviceevent.DeviceAdded,""));
        }
        else if(data.indexOf(deviceevent.ActiveDevice) ==0){
            devices.push(data.replace(deviceevent.ActiveDevice,""));
            activeDevice = data.replace(deviceevent.ActiveDevice,"");
        }
        else if(data.indexOf(deviceevent.DeviceRemoved) ==0){
          var device = data.replace(deviceevent.DeviceRemoved,"");
          var deviceIndex = devices.indexOf(device);

          if(deviceIndex > -1){
            devices.splice(device.index,1);
          }
        }
        else if(data.indexOf(deviceevent.HoldState) ==0){
            holdState = Boolean(data.replace(deviceevent.HoldState,''));
        }
        else if(data.indexOf(deviceevent.HookState) ==0){
            offHookState = data.replace(deviceevent.HookState,'') == "True";
        }else if (data == 'ConfirmRequestOk' && onOkGetDeviceState){
            onOkGetDeviceState = false;
            sendCommand(command.GetState);
        }
        else if(data.indexOf(deviceevent.AcceptCall) ==0){
          InteractionService.answerAlertingCall();
        }
        else if(data.indexOf(deviceevent.EndCall) ==0){
          InteractionService.disconnectSelectedCall();
        }


         angularApply();
    }

    $rootScope.$on('ConnectedInteractionCount', function (event, data){
      $log.debug('device service, interaction count ' + JSON.stringify(data));
      $log.debug('offHookState ' + JSON.stringify(offHookState));
      interactionCount = data;
      if(data > 0 && offHookState !== true && !QueueService.hasAlertingInteraction()){
        sendCommand(command.OffHook);
      }
      else if(data ==0){
        sendCommand(command.OnHook);
      }
    });

    $rootScope.$on('initialize', function (event, data) {
        sendCommand(command.OnHook);
    });

    $rootScope.$on('InteractionAlerting', function(event,data){
      $log.debug('interaction alerting');
      sendCommand(command.Ring);
    });

    function connectToWebSocket(){
        $log.debug("connecting to websocket")
        isConnecting = true;
        try{
            ws = WebsocketService.create('ws://localhost:8080');

            // when data is comming from the server, this metod is called
            ws.onmessage = function (evt) {
              console.log('on message')
                $log.debug("websocket message received " + JSON.stringify(evt.data));
                handleMessage(evt.data);
            }

            // when the connection is established, this method is called
            ws.onopen = function () {
                $log.debug("websocket open");
                isConnected = true;
                sendCommand(command.GetDevices);
                sendCommand(command.GetState);
                angularApply();
            }

            // when the connection is closed, this method is called
            ws.onclose = function () {
                $log.debug("websocket closed");
                isConnected = false;
                angularApply();
            }


        }catch(err){
            $log.error(err);
        }
        isConnecting = false;

    }

     connectToWebSocket();

    return{
        isConnected:function(){
            return isConnected;
        },
        isConnecting:function(){
            return isConnecting;
        },
        connect:function(){
            connectToWebSocket();
        },
        activeDevice:function(){
            return activeDevice;
        },
        devices:function(){
            return devices;
        },
        setActiveDevice:function(deviceName){
            sendCommand(command.SetActiveDevice + deviceName);
          onOkGetDeviceState = true;
        }
    }
});
