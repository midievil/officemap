function findEmployeeById(employeeId){
    var employee = employeesList.find(function(emp){
        return emp.Id == employeeId;
    });
    return employee;
}

function findMapById(employeeId){
    var map = mapList.find(function(emp){
        return emp.Id == employeeId;
    });
    return map;
}

function findDeviceById(deviceId){
    var device = devicesList.find(function(dev){
        return dev.Id == deviceId;
    });
    return device;
}

function findRoomByCoordinates(x, y) {
    var floorId = getCurrentFloorId();
    var room = roomsList.find(function(room){
        return room.FloorId == floorId 
            && x >= room.X1 && x <= room.X2
            && y >= room.Y1 && y <= room.Y2;
    });
    return room;
}

function findRoomById(id) {
    var room = roomsList.find(function(room){
        return room.Id == id;
    });
    return room;
}

function filterEmployees(){
    $lis = $("#ulEmployees li");
    var text = $("#tbEmployeesFilter").val().toLowerCase();
    for(var  i=0; i<$lis.length; i++){
        $li = $('#' + $lis[i].id);
        if($li.text().toLowerCase().indexOf(text) !== -1)
            $li.show();
        else
            $li.hide();
    }
}

function filterNotOnMap() {
    var isChecked = $("#cbNotOnMap").is(":checked");
    if(isChecked) {
        $("#ulEmployees li.on-map").hide();
    } else {
        $("#ulEmployees li.on-map").show();
    }
}

function searchMap(id) {
    $("#ulEmployees li").removeClass('active');
    
    var map = findMapById(id);
    if(typeof map !== 'undefined' && map.FloorId != getCurrentFloorId()) {
        if($("#ddlFloor option[value='" + map.FloorId + "']").length >= 1) {
            $("#ddlFloor").val(map.FloorId);
            onFloorChanged();
        }
    }

    $("div.point").removeClass('selected');
    $("#point" + id).addClass('selected');
    
    if(typeof map === 'undefined') {
        notFoundMapId = id;
        bindViewEmployeeForm(notFoundMapId);
    } else {
        pointClicked(id);
    }
}