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
            onMetaLoaded(true);
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
            onMetaLoaded(true);           
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

function loadDevices(){
    devicesList = null;    

    $.ajax({
        url: '/devices',
        success: function(result){
            devicesList = JSON.parse(result);
            onMetaLoaded(true);
            onDevicesLoaded();
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
            onMetaLoaded(true);
        }
    });
}

function loadEmployeeById(id, onLoad) {
    $.ajax({
        url: '/employees/' + id,
        method: 'GET',
        success: function(result){
            onLoad(JSON.parse(result));
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

function deleteEmployee(id, onSuccess){
    $.ajax({
        url: '/map/' + id,
        method: 'DELETE',
        success: function(result) {
            if(typeof onSuccess !== 'undefined')
                onSuccess();
        }
    });
}

function loadManagedIds(){
    $.ajax({
        url: '/employees/managed',
        method: "GET",
        success: function(result) {
            managedIds = JSON.parse(result);
            onMetaLoaded(true);
        }
    });
}

var isLocked = false;
var floorsList = null;
var roomsList = null;
var employeesList = null;
var mapList = null;
var devicesList = null;
var managedIds = null;