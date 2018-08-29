$(document).ready(function(){
    loadFilter();
    loadEmployees();
    loadMap();

    setEditables();

    bindWindowResize();
    resizeMap();

    if(getCookie('remember') == 'true')
        ping();

    $(window).keydown(function(event){
        if(event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });    
});

var isLocked = false;
var notFoundMapId = null;

var floorsList = null;
var roomsList = null;
var employeesList = null;
var mapList = null;

function loadFilter(){
    roomsList = null;
    floorsList = null;

    isLocked = true;
    $.ajax({
        url: './rooms',
        success: function(result){
            roomsList = JSON.parse(result);
            buildRoomsFilter();            
        }
    });

    $.ajax({
        url: './floors',
        success: function(result){
            floorsList = JSON.parse(result);
            buildFloorsFilter();            
        }
    });
}

function loadEmployees() {
    employeesList = null;
    isLocked = true;
    $.ajax({
        url: './employees',
        method: 'GET',
        success: function(result){
            employeesList = JSON.parse(result);
            bindEmployeesSelector();
            onMapLoaded();
        }
    });
}

function loadMap() {
    mapList = null;
    isLocked = true;
    $.ajax({
        url: './map',
        method: 'GET',
        success: function(result){
            mapList = JSON.parse(result);
            bindEmployeesSelector();
            onMapLoaded();
        }
    });
}

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
        for(var i = 0; i < roomsList.length; i++){
            var room = roomsList[i];
            $ddl.append('<option value="' + room.Id + '" data-floor="' + room.FloorId + '">' + room.Name + '</option>')
        }

        onFloorChanged();
        onMapLoaded();
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

        onFloorChanged();
        onMapLoaded();
    }
}

function getCurrentFloorId() {
    return $("#ddlFloor").val();
}

var mapWidth = 0;
var mapHeight = 0;

function onFloorChanged() {

    if(floorsList == null)
        return;

    cancelEmployeeEdit();

    var floorId = $("#ddlFloor").val();
    var floor = floorsList.find(function(floor){ 
        return floor.Id == floorId 
    });

    $('#ddlRoom option').hide();
    $('#ddlRoom option[data-floor="' + floor.Id + '"]').show();
    
    $("#imgPlan").attr('src', './img/rooms/' + floor.Img + '?v=0.5');
    var imgUrl = './img/rooms/' + floor.Img;
    onMapLoaded();
}

function onMapLoaded(){
    if(roomsList != null && employeesList != null && mapList != null && floorsList != null) {
        isLocked = false;
        drawMap();
    }
}

function drawMap(){
    $("div.point").remove();

    var floorId = getCurrentFloorId();
    var employeeMap = mapList.filter(function(emp){
        return emp.FloorId == floorId;
    });

    $div = $("#divMainContainer");

    for(var i = 0; i < employeeMap.length; i++) {
        var map = employeeMap[i];
        var employee = findEmployeeById(map.Id);
        
        if(typeof employee != 'undefined') {
            var tooltip = 'data-toggle="tooltip" data-html="true" data-placement="top" title="' + employee.Name + '<br>Кабинет: ' + map.RoomName + (canEdit() ? ('<br>IP: ' + map.IP) : '') + '"';
            var drag = canEdit() ? 'draggable="true" ondragstart="drag(event)" ' : '';
            $div.append('<div data-id="' + map.Id + '" class="point ' + (map.Id == userId ? 'you' : '') + '" data-x="' + map.X + '" data-y="' + map.Y + '" style="left: ' + map.X + '%; top: ' + map.Y + '%" id="point' + map.Id + '" onclick="pointClicked(' + map.Id + ', event)" ' + drag + tooltip + '></div>');
        }
    }

    $('[data-toggle="tooltip"]').tooltip();

    drawRooms();
    resizeMap();
}

function drawRooms() {
    $("div.room").remove();

    if(roomsList == null || floorsList == null)
        return;

    $div = $("#divMainContainer");
    var currentFloorId = getCurrentFloorId();

    for(var i = 0; i < roomsList.length; i++) {
        var room = roomsList[i];
        if(room.FloorId == currentFloorId && room.X1 > 0 && room.X2 > 0 && room.Y1 > 0 && room.Y2 > 0) {
            var style = 'left: ' + room.X1 + '%; top: ' + room.Y1 + '%; width: ' + (room.X2 - room.X1) + '%; height: ' + (room.Y2 - room.Y1) + '%';
 
            var roomHtml = '<div class="room" data-room-id="' + room.Id + '" style="' + style + '" onclick="roomClicked(event);">' + room.Name + '</div>'
            $div.append(roomHtml);
        }
    }
}

function roomClicked(ev){
    //if(ev != null)
    //    ev.stopPropagation();
}

function pointClicked(id, ev) {
    if(ev != null)
        ev.stopPropagation();

    $("div.point").removeClass("selected");

    $point = $("#point" + id);    
    $point.addClass('selected');

    if(id == 'New'){
        bindAddEmployeeForm();
    } else {
        var map = mapList.find(function(emp){
            return emp.Id == id;
        });
        var employee = findEmployeeById(id);

        bindEmployeeForm(map, employee);

        $("#pointNew").remove();
    }
}

function bindEmployeeForm(map, employee) {
    $point = $("div.point.selected");
    
    $("#ddlEmployee").val(employee.Id);
    $("#hidX").val($point.attr('data-x'));
    $("#hidY").val($point.attr('data-y'));
    $("#hEmployee").text(employee.Name);
    $("#txtIP").val(map.IP);
    $("#ddlRoom").val(map.RoomId);

    $("#divSelectEmployee").hide()

    $("#divEmployeeDetails").show();

    bindAvatar(employee);
    filterReset();
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

function saveEmployee() {
    isLocked = true;
    var empId = $("#ddlEmployee").val();
    $.ajax({
        url: './map',
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


function allowDrop(ev) {
    if(canEdit())        
        ev.preventDefault();
}

var draggingPointId = null;
function drag(ev) {
    if(canEdit())
        draggingPointId = ev.target.id;
}

function getClickXPercent(x){
    var container = document.getElementById("divMainContainer");
    var totalWidth = container.clientWidth;
    return x / totalWidth * 100;
}
function getClickYPercent(y){
    var container = document.getElementById("divMainContainer");
    var totalHeight  = container.clientHeight;
    return y / totalHeight * 100;
}

function drop(ev) {
    if(isLocked)
        return;

    if(!canEdit())
        return;

    ev.preventDefault();
    //var data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));

    var newX = ev.offsetX;
    var newY = ev.offsetY;

    if(ev.target.classList[0] == 'room'){
        newX += ev.target.offsetLeft;
        newY += ev.target.offsetTop;
    }

    var newXPercent = getClickXPercent(newX);
    var newYPercent = getClickYPercent(newY);

    $draggingPoint = $("#" + draggingPointId);
    $draggingPoint.css({ 
        left: newXPercent+'%',
        top: newYPercent+'%',
    });
    $draggingPoint.attr('data-x', newXPercent);
    $draggingPoint.attr('data-y', newYPercent);

    pointClicked($draggingPoint.attr('data-id'));

    draggingPointId = null;
}

function ddlEmployeeChanged() {
    var employeeId = $("#ddlEmployee").val();
    if(employeeId != '') {
        var employee = findEmployeeById(employeeId);

        if(typeof employee !== 'undefined') {
            bindAvatar(employee);

            if(typeof employee.Ip != 'undefined' && employee.Ip != null)
                $("#txtIP").val(employee.Ip);
            else
                $("#txtIP").val('');
        } else {
            $("div.avatar-frame").hide();
            $("#txtIP").val('');
        }
    }
}

function planClicked(ev) {
    if(isLocked)
        return;

    var newX = ev.offsetX;
    var newY = ev.offsetY;

    if(ev.target.classList[0] == 'room'){
        newX += ev.target.offsetLeft;
        newY += ev.target.offsetTop;
    }


    var newXPercent = getClickXPercent(newX);
    var newYPercent = getClickYPercent(newY);

    addNewPoint(newXPercent, newYPercent);    
}

function addNewPoint(x, y) {
    if(!canEdit())
        return;

    $("#pointNew").remove();
    $div = $("#divMainContainer");    
    $div.append('<div id="pointNew" data-id="New" data-x="' + x + '" data-y="' + y + '" class="point new selected" style="left: ' + x + '%; top: ' + y + '%" draggable="true" onclick="newPointClicked(event)" ondragstart="drag(event)"></div>');
    pointClicked('New');
}

function newPointClicked(ev) {
    ev.stopPropagation();
}

function searchMap(id) {
    $("#ulEmployees li").removeClass('active');
    $("#ulEmployees li.emp"+id).addClass('active');

    var map = findMapById(id);
    if(typeof map !== 'undefined' && map.FloorId != getCurrentFloorId()) {
        $("#ddlFloor").val(map.FloorId);
        onFloorChanged();
    }

    $("div.point").removeClass('selected');
    $("#point" + id).addClass('selected');

    if(typeof map === 'undefined') {
        notFoundMapId = id;
    }
}

function bindWindowResize(){
    window.addEventListener("resize", function() {
        resizeMap();
    });
}

function resizeMap() {    
    var container = document.getElementById('divMainContainer');
    var newHeight = container.clientWidth * 0.51462621885157; 
    $('#divMainContainer').css('height', newHeight+'px');
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

function filterReset() {
    $("#ulEmployees li").removeClass('active');
    notFoundMapId = null;
}

function canEdit() {
    //  Please don't hack this - another check is done on server - nothing will be saved)
    var adminIds = ['14', '64', '92', '255'];
    var canEdit = $.inArray(userId, adminIds);
    return canEdit > -1;
}

function setEditables(){
    //  Please don't hack this - another check is done on server - nothing will be saved)
    if(!canEdit()){
        $(".editable").hide();
        $("div.row.ip").hide();
    }
}

function ping(){
    window.setTimeout(function(){
        $.ajax({
            url: './ping',
            success: function(result){
                ping();
            },
            error: function(){
                ping();
            }
        });   
    }, 1000 * 60 * 5);
    
}

function getCookie(key) {
    var x = document.cookie;
    
    var splits = x.split(';');
    var cookie = splits.find(function(cookie){
        var spl = cookie.split('=');
        return spl[0].trim() == key;            
    });

    return cookie.split('=')[1];
}