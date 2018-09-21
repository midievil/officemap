function bindEmployeesSelector() {

    if(employeesList == null || mapList == null)
        return;

    $ddl = $("#ddlEmployee");
    $ul = $("#ulEmployees");
    $ddl.empty();
    $ul.empty();

    for(var i = 0; i < employeesList.length; i++) {
        var employee = employeesList[i];
        
        $ddl.append('<option value="' + employee.Id + '">' + employee.Name + '</div>');

        var mapEntry = mapList.find(function(emp){
            return emp.Id == employee.Id;
        });
        var mapClass = mapEntry == null ? "not-on-map" : "on-map";

        $ul.append('<li id="li' + employee.Id + '" class="list-group-item emp' + employee.Id + ' ' + mapClass + '" onclick="searchMap(' + employee.Id + ');" >' + employee.Name + '</li>');
    }

    filterNotOnMap();
}

function buildRoomsFilter(){
    if(roomsList != null){
        $ddl = $("#ddlRoom");

        $ddl.empty();
        for(var i = 0; i < roomsList.length; i++) {
            var room = roomsList[i];
            if(room.RoomType == "Working")
                $ddl.append('<option value="' + room.Id + '" data-floor="' + room.FloorId + '">' + room.Name + '</option>')
        }
    }
}

function buildFloorsFilter(){
    if(floorsList != null){
        $ddl = $("#ddlFloor");

        $ddl.empty();
        for(var i = 0; i < floorsList.length; i++){
            var floor = floorsList[i];
            $ddl.append('<option value="' + floor.Id + '">' + floor.Name + '</option>')
        }
    }
}

function onMetaLoaded(isInitial){

    if(typeof isInitial === "undefined")
        isInitial = false;

    if(roomsList != null && floorsList != null) {
        buildFloorsFilter();
        buildRoomsFilter();
        
        if(employeesList != null && mapList != null)
        {
            isLocked = false;

            bindEmployeesSelector();

            var me = findMapById(userId);
            if(isInitial && typeof me !== 'undefined' && me.FloorId != null && me.FloorId != '') {
                $("#ddlFloor").val(me.FloorId);
            }
            
            onFloorChanged();
        }
    }
}

function bindEmployeeForm(map, employee) {
    $point = $("div.point.selected");
    
    $("#ddlEmployee").val(employee.Id);
    $("#hEmployee").text(employee.Name);
    $("#aSkype").text(employee.Skype);
    $("#aSkype").attr('href', 'skype:' + employee.Skype + '?chat');

    $("#txtIP").val(map.IP);
    $("#ddlRoom").val(map.RoomId);
    $("#txtRoom").val(map.RoomName);

    $("#hidX").val($point.attr('data-x'));
    $("#hidY").val($point.attr('data-y'));

    $("#divSelectEmployee").hide();
    $("#divEmployeeDetails").show();

    bindAvatar(employee);
    filterReset();
}

function bindAddEmployeeForm() {
    $("#ddlEmployee").val(notFoundMapId == null ? '' : notFoundMapId);

    var x = $("#pointNew").attr('data-x');
    var y = $("#pointNew").attr('data-y');
    
    $("#hidX").val(x);
    $("#hidY").val(y);
    $("#txtIP").val('');
    if(canEdit())
        $("#hEmployee").text('Добавить на карту (' + x + ',' + y + ')');
    else
        $("#hEmployee").text('Добавить на карту');

    var room = findRoomByCoordinates(x, y);
    if(typeof room != 'undefined')
        $("#ddlRoom").val(room.Id);
    else
        $("#ddlRoom").val('');

    $("#divSelectEmployee").show()

    $("#divEmployeeDetails").show();

    ddlEmployeeChanged();
}

function bindAvatar(employee) {
    if(typeof employee.Avatar != 'undefined' && employee.Avatar != null){
        $("#imgAvatar").attr('src', avatarsUri + employee.Avatar);
        $("div.avatar-frame").show();
    } else {
        $("div.avatar-frame").hide();
    }
}

function cancelEmployeeEdit() {
    $("#divEmployeeDetails").hide();
    $("#pointNew").remove();
    $("div.point").removeClass('selected');
}
