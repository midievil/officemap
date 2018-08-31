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
            buildRoomsFilter();            
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
            buildFloorsFilter();            
        }
    });
}

function loadMap() {
    mapList = null;
    isLocked = true;
    $.ajax({
        url: '/map',
        method: 'GET',
        success: function(result){
            mapList = JSON.parse(result);

            var me = findMapById(userId);
            if(typeof me !== 'undefined' && me.FloorId != null && me.FloorId != '') {
                $("#ddlFloor").val(me.FloorId);
            }

            bindEmployeesSelector();
            onMapLoaded();
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
            bindEmployeesSelector();
            onMapLoaded();
        }
    });
}

function saveEmployee() {
    isLocked = true;
    var empId = $("#ddlEmployee").val();
    $.ajax({
        url: '/map',
        method: 'POST',
        data: {
            employeeId: empId,
            ip: $("#txtIP").val(),
            x: $("#hidX").val(),
            y: $("#hidY").val(),
            floor: $("#ddlFloor").val(),
            room: $("#ddlRoom").val()
        },
        success: function(result) {
            isLocked = false;
            cancelEmployeeEdit();
            loadMap();

            $li = $("#li" + empId);
            $li.removeClass("not-on-map");
            $li.addClass("on-map");
            filterNotOnMap();
        }
    });
}

var isLocked = false;
var floorsList = null;
var roomsList = null;
var employeesList = null;
var mapList = null;