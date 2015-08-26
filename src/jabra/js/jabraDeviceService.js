clientaddin.factory('JabraDeviceService', function($interval, $rootScope, $log){
    isConnected = false;
    isConnecting = false;
    devices = [];
    activeDevice = '';

    reply = {
        DeviceAdded: 'DeviceAdded ',
        DeviceRemoved: 'DeviceRemoved ',
        AcceptCall:'AcceptCall',
        EndCall:'EndCall',
        Device:'Device ',
        ActiveDevice:'ActiveDevice ',
    }

    command = {
        DeviceAdded: 'DeviceAdded',
        DeviceRemoved: 'DeviceRemoved',
        Ring:'Ring',
        OffHook :'OffHook',
        OnHook : 'OnHook',
        GetDevices:'GetDevices',
        GetActiveDevice:'GetActiveDevice'
    }

    function sendCommand(command){
        $log.debug("sending command " + command);
        ws.send(command);
    }

    function handleMessage(data){
        if(data.indexOf(reply.Device) == 0){
            devices.push(data.replace(reply.Device,""));
        }
        else if(data.indexOf(reply.DeviceAdded) ==0){
            devices.push(data.replace(reply.DeviceAdded,""));
        }
        else if(data.indexOf(reply.ActiveDevice) ==0){
            devices.push(data.replace(reply.ActiveDevice,""));
            activeDevice = data.replace(reply.ActiveDevice,"");
        }
    }

    function connectToWebSocket(){
        $log.debug("connecting to websocket")
        isConnecting = true;
        try{
            ws = new WebSocket('ws://localhost:8080');

            // when data is comming from the server, this metod is called
            ws.onmessage = function (evt) {
                $log.debug("websocket message received");
                handleMessage(evt.data);
            }

            // when the connection is established, this method is called
            ws.onopen = function () {
                $log.debug("websocket open");
                isConnected = true;
                sendCommand(command.GetDevices);
            }

            // when the connection is closed, this method is called
            ws.onclose = function () {
                $log.debug("websocket closed");
                isConnected = false;
            }

        }catch(err){
            $log.error(err);
        }
        isConnecting = false;
    }



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
        }
    }
});
