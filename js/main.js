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
    
    $("#imgPlan").attr('src', '/img/rooms/' + floor.Img + '?v=' + scriptVersion);
    var imgUrl = '/img/rooms/' + floor.Img;
    
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