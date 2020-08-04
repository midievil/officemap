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

        $ul.append('<li id="li' + employee.Id + '" class="list-group-item emp' + employee.Id + ' ' + mapClass + ' role' + employee.KindOfActivityId + '" onclick="searchMap(' + employee.Id + ');" >' + employee.Name + '</li>');
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

        var oldValue = $ddl.val();

        $ddl.empty();
        for(var i = 0; i < floorsList.length; i++){
            var floor = floorsList[i];
            $ddl.append('<option value="' + floor.Id + '">' + floor.Name + '</option>')
        }

        if(oldValue != '')
            $ddl.val(oldValue);
    }
}

function onMetaLoaded(isInitial){

    if(typeof isInitial === "undefined")
        isInitial = false;

    if(roomsList != null && floorsList != null) {
        buildFloorsFilter();
        buildRoomsFilter();
        
        if(employeesList != null && mapList != null && devicesList != null)
        {
            isLocked = false;

            bindEmployeesSelector();

            var me = findMapById(userId);
            var selectedEmployee = undefined;

            if(isInitial){

                var id = getRequestParam('id');
                if(typeof(id) !== 'undefined'){
                    selectedEmployee = findMapById(id);
                    
                }

                $("#ddlFloor").val(null);
                
                if(typeof(selectedEmployee) !== 'undefined'){
                    $("#ddlFloor").val(selectedEmployee.FloorId);
                } else {
                    if(typeof me !== 'undefined' && me.FloorId != null && me.FloorId != '') {
                        $("#ddlFloor").val(me.FloorId);
                    }
                }

                if($("#ddlFloor").val() == null){
                    var floorId = $("#ddlFloor option:first-child").attr('value');
                    $("#ddlFloor").val(floorId);
                }
            }            
            
            onFloorChanged();
            if(isInitial && typeof(selectedEmployee) !== 'undefined'){
                pointClicked(selectedEmployee.Id);
                selectedEmployee = undefined;
            }
        }
    }
}

function bindEmployeeForm(map, employee) {
    $point = $("div.point.selected");
    
    var idHint = ""; //canEdit() ? (" (id: " + employee.Id + ")") : "";

    $("#ddlEmployee").val(employee.Id);
    $("#hEmployee").text(employee.Name);
    $("#aSkype").text(employee.Skype);
    $("#aSkype").attr('href', 'skype:' + employee.Skype + '?chat');

    $("#txtIP").val(map.IP + idHint);
    $("#ddlRoom").val(map.RoomId);
    $("#txtRoom").val(map.RoomName);

    $("#hidX").val($point.attr('data-x'));
    $("#hidY").val($point.attr('data-y'));

    $("#divSelectEmployee").hide();
    $("#divEmployeeDetails").show();

    $("#divEmployeeDetails div.room").show();
    $("#divEmployeeDetails div.ip").show();
    $("#divEmployeeDetails div.buttons").show();

    $("#ulEmployees li.emp" + employee.Id).addClass('active');

    bindAvatar(employee);
    
    notFoundMapId = null;

    loadEmployeeById(employee.Id, function(emp) {
        $("#txtIP").val(emp.Ip);
    });
}

function bindAddEmployeeForm() {
    $("#ddlEmployee").val(notFoundMapId == null ? '' : notFoundMapId);

    var x = $("#pointNew").attr('data-x');
    var y = $("#pointNew").attr('data-y');
    
    $("#hidX").val(x);
    $("#hidY").val(y);
    $("#txtIP").val('');
    if(canEdit())
        $("#hEmployee").text('Добавить на карту');  // (' + x + ',' + y + ')');
    else
        $("#hEmployee").text('Добавить на карту');

    $("#aSkype").text('');
    $("#aSkype").removeAttr('href');

    $("#spanCoord").text((Math.round(x * 100) / 100) + ',' + (Math.round(y * 100) / 100))

    $("#divSelectEmployee").show()

    $("#divEmployeeDetails").show();

    $("#divEmployeeDetails div.room").show();
    $("#divEmployeeDetails div.ip").show();
    $("#divEmployeeDetails div.buttons").show();

    ddlEmployeeChanged();
}

function bindViewEmployeeForm(employeeId){
    var employee = findEmployeeById(employeeId);
    $("#ddlEmployee").val(employee.Id);
    $("#hEmployee").text(employee.Name);
    $("#aSkype").text(employee.Skype);
    $("#aSkype").attr('href', 'skype:' + employee.Skype + '?chat');

    $("#divEmployeeDetails div.room").hide();
    $("#divEmployeeDetails div.ip").hide();
    $("#divEmployeeDetails div.buttons").hide();

    $("#divSelectEmployee").hide();
    $("#divEmployeeDetails").show();

    bindAvatar(employee);
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
    $("#ulEmployees li").removeClass('active');
}

function onDevicesLoaded() {
    $printersDiv = $("#divDevicesMenu");
    $printersDiv.empty();

    for(var i = 0; i < devicesList.length; i++) {
        var device = devicesList[i];

        if(device.Type == 1 || device.Type == 2) {
            var html = '<a class="dropdown-item" onclick="showDevice(' + device.Id + ')">' + device.Name + ' (' + device.FloorName + ')' + '</a>';
            $printersDiv.append(html);
        }
    }
}

function showDevice(id)
{
    $("div.device").tooltip('hide');

    var device = findDeviceById(id);

    if(typeof device !== 'undefined' && device.FloorId != getCurrentFloorId()) {
        if($("#ddlFloor option[value='" + device.FloorId + "']").length >= 1) {
            $("#ddlFloor").val(device.FloorId);
            onFloorChanged();
        }
    }
    //var y = $("div.device2").offset().top;
    $([document.documentElement, document.body]).animate({
        scrollTop: $("div.device" + id).offset().top - 200
    }, 2000);
    $("div.device" + id).tooltip('show');
}