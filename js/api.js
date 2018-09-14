function ping(){
    window.setTimeout(function(){
        $.ajax({
            url: '/ping',
            success: function(result){
                ping();
            },
            error: function(){
                ping();
            }
        });   
    }, 1000 * 60 * 5);    
}

function loadRooms(){
    roomsList = null;    
    isLocked = true;

    $.ajax({
        url: '/rooms',
        success: function(result){
            roomsList = JSON.parse(result);
            onMetaLoaded();
        }
    });
}

function loadFloors(){
    floorsList = null;
    isLocked = true;

    $.ajax({
        url: '/floors',
        success: function(result){
            floorsList = JSON.parse(result);
            onMetaLoaded();           
        }
    });
}

function loadMap(isInitial) {
    if(typeof isInitial === 'undefined')
        isInitial = false;

    mapList = null;
    isLocked = true;
    $.ajax({
        url: '/map',
        method: 'GET',
        success: function(result){
            mapList = JSON.parse(result);
            onMetaLoaded(isInitial);
        }
    });
}

function loadEmployees() {
    employeesList = null;
    isLocked = true;
    $.ajax({
        url: '/employees',
        method: 'GET',
        success: function(result){
            employeesList = JSON.parse(result);
            onMetaLoaded();
        }
    });
}

function saveEmployee(employee, onSuccess) {
    isLocked = true;
    $.ajax({
        url: '/map',
        method: 'POST',
        data: {
            employeeId: employee.id,
            ip: employee.ip,
            x: employee.x,
            y: employee.y,
            floor: employee.floorId,
            room: employee.roomId
        },
        success: function(result) {
            if(typeof onSuccess !== 'undefined')
                onSuccess();            
        }
    });
}

var isLocked = false;
var floorsList = null;
var roomsList = null;
var employeesList = null;
var mapList = null;