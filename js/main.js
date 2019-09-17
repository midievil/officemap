$(document).ready(function(){
    loadRooms();
    loadFloors();
    loadEmployees();
    loadMap(true);

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


var notFoundMapId = null;

function getCurrentFloorId() {
    return $("#ddlFloor").val();
}

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
    
    $(".room-name").text(floor.Name);
    $("#imgPlan").attr('src', '/img/rooms/' + floor.Img + '?v=' + scriptVersion);
    var imgUrl = '/img/rooms/' + floor.Img;

    $('div.logo').attr('floor', floor.Id);
    
    drawMap();
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
        animatePoint(id);

        $("#pointNew").remove();
    }
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

function drop(ev) {
    if(isLocked)
        return;

    if(!canEdit())
        return;

    ev.preventDefault();
    //var data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));

    if(ev.target.classList[0] != 'room')
        return;

    if(ev.target.classList[1] != 'working')
        return;
        
    
    var xPercent = ev.offsetX / ev.target.clientWidth * 100;
    var yPercent = ev.offsetY / ev.target.clientHeight * 100;

    $draggingPoint = $("#" + draggingPointId);
    $draggingPoint.css({ 
        left: xPercent+'%',
        top: yPercent+'%',
    });
    $draggingPoint.attr('data-x', xPercent);
    $draggingPoint.attr('data-y', yPercent);

    pointClicked($draggingPoint.attr('data-id'));

    var roomId = ev.target.attributes.getNamedItem("data-room-id").value;
    $room = $("div[data-room-id='" + roomId + "']");

    $draggingPoint.appendTo($room);

    if(typeof roomId !== "undefined")
        $("#ddlRoom").val(roomId);

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

    if(ev.target.classList[0] != 'room')
        return;

    if(ev.target.classList[1] != 'working')
        return;
    
    var roomId = ev.target.attributes.getNamedItem("data-room-id").value;
    var xPercent = ev.offsetX / ev.target.clientWidth * 100;
    var yPercent = ev.offsetY / ev.target.clientHeight * 100;
        
    addNewPoint(roomId, xPercent, yPercent);
}

function newPointClicked(ev) {
    ev.stopPropagation();
}

function getCookie(key) {
    var x = document.cookie;
    
    var splits = x.split(';');
    var cookie = splits.find(function(cookie){
        var spl = cookie.split('=');
        return spl[0].trim() == key;            
    });

    return typeof cookie !== 'undefined' ?
        cookie.split('=')[1] : null;
}

function getPointedEmployee() {
    var id = getRequestParam('id');
    return id;
}

function getRequestParam(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
 }