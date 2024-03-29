function bindWindowResize(){
    window.addEventListener("resize", function() {
        resizeMap();
    });
}

function resizeMap() {    
    setMainDivHeight();

    if(resizeTimeout != null)
    {
        window.clearTimeout(resizeTimeout);
        resizeTimeout = null;
    }

    // resizeTimeout = window.setTimeout(function(){
    //     setMainDivHeight();
    // }, 100);

    var img = document.getElementById('imgPlan');
    if (img.complete) {
        setMainDivHeight()
    } else {
        img.addEventListener('load', setMainDivHeight);
    }
}

function setMainDivHeight(){
    var img = document.getElementById('imgPlan');
    var newHeight = img.clientHeight; 
    $('#divMainContainer').css('height', newHeight+'px');
}

var resizeTimeout = null;

function drawRooms() {
    $("#divMainContainer div.room").remove();
    $("#divMainContainer div.room-description").remove();

    if(roomsList == null || floorsList == null)
        return;

    $div = $("#divMainContainer");
    var currentFloorId = getCurrentFloorId();

    for(var i = 0; i < roomsList.length; i++) {
        var room = roomsList[i];
        if(room.FloorId == currentFloorId && (room.RoomType == Constants.RoomTypeOutage || (room.X1 > 0 && room.X2 > 0 && room.Y1 > 0 && room.Y2 > 0))) {
            var style = 'left: ' + room.X1 + '%; top: ' + room.Y1 + '%; width: ' + (room.X2 - room.X1) + '%; height: ' + (room.Y2 - room.Y1) + '%';
            
            var countDescription = canEdit() && room.RoomType == 'Working'
                ? ' <i class="fas fa-user"></i>' + room.EmployeesCount
                : '';

            var roomHtml = '<div class="room ' + room.RoomType.toLowerCase() + '" data-room-id="' + room.Id + '" style="' + style + '" onclick="roomClicked(event);"></div>'
            roomHtml += '<div class="room-description" style="' + style + '"><div class="name">' + room.Name + countDescription + '</div><div class="desc">' + room.Description + '</div></div>'
            $div.append(roomHtml);
        }
    }
}

function drawMap() {
    $("div.point").remove();

    var floorId = getCurrentFloorId();
    var floor = floorsList.find(function(floor){ 
        return floor.Id == floorId 
    });
    var employeeMap = mapList.filter(function(emp){
        return emp.FloorId == floorId;
    });

    $("#imgPlan").attr('src', '/img/rooms/' + floor.Img + '?v=' + scriptVersion);

    $div = $("#divMainContainer");

    drawRooms();

    for(var i = 0; i < employeeMap.length; i++) {
        var map = employeeMap[i];
        var employee = findEmployeeById(map.Id);
        
        if(typeof employee != 'undefined') {
            var tooltip = 'data-toggle="tooltip" data-html="true" data-placement="top" title="' + employee.Name + '<br>Кабинет: ' + map.RoomName + (canEdit() ? ('<br>IP: ' + map.IP) : '') + '"';
            var drag = canEdit() ? 'draggable="true" ondragstart="drag(event)" ' : '';

            var haveRoomCoordinates = map.RoomX > 0 && map.RoomY > 0;
            var x = haveRoomCoordinates ? map.RoomX : map.X;
            var y = haveRoomCoordinates ? map.RoomY : map.Y;

            var html = '<div data-id="' + map.Id + '" class="point ' + (map.Id == userId ? 'you' : '') + '" data-x="' + x + '" data-y="' + y + '" style="left: ' + x + '%; top: ' + y + '%" id="point' + map.Id + '" onclick="pointClicked(' + map.Id + ', event)" ' + drag + tooltip + '></div>';
            //if(canEdit()){
            //    html += '<span class="point-name" style="left: ' + (x + 1) + '%; top: ' + y + '%">' + employee.Name + '</span>';
            //}
            
            if(haveRoomCoordinates) {
                $("div[data-room-id='" + map.RoomId + "']").append(html);
            } else {
                $div.append(html);
            }            
        }
    }

    for(var i = 0; i < devicesList.length; i++) {
        var device = devicesList[i];
        var drag = '';
        var tooltip = 'data-toggle="tooltip" data-html="true" data-placement="top" title="' + device.Name + '<br>Кабинет: ' + device.RoomName + '"';

        var x = device.X;
        var y = device.Y;

        var html = '<div data-deviceid="' + device.Id + '" class="device device' + device.Type +  '" data-x="' + x + '" data-y="' + y + '" style="left: ' + x + '%; top: ' + y + '%" id="device' + device.Id + '" onclick="deviceClicked(' + device.Id + ', event)" ' + drag + tooltip + '></div>';
        $("div[data-room-id='" + device.RoomId + "']").append(html);
    }

    $('[data-toggle="tooltip"]').tooltip();

    resizeMap();
}

function addNewPoint(roomId, x, y) {
    $("#pointNew").remove();
    $div = $("div[data-room-id='" + roomId + "']");    
    $div.append('<div id="pointNew" data-id="New" data-x="' + x + '" data-y="' + y + '" class="point new selected" style="left: ' + x + '%; top: ' + y + '%" draggable="true" onclick="newPointClicked(event)" ondragstart="drag(event)"></div>');
    pointClicked(Constants.EmployeeIdNew);

    var room = findRoomById(roomId);
    $("#ddlRoom").val(roomId);
    $("#txtRoom").val(room.Name);
}


function animatePoint(employeeId) {
    if($("#point"+employeeId).hasClass('selected')) {
        $("#point"+employeeId).animate({
            opacity: 0.25        
        }, 500, function() {
            if($("#point"+employeeId).hasClass('selected')) {
                $("#point"+employeeId).animate({
                    opacity: 1
                }, function() {
                    if($("#point"+employeeId).hasClass('selected')) {
                        blinkTimeout = window.setTimeout(function(){
                            animatePoint(employeeId);
                        }, 1000);
                    } else if(blinkTimeout != null) {
                        window.clearTimeout(blinkTimeout);
                        blinkTimeout = null;
                    }
                });
            } else {
                $("#point"+employeeId).css({opacity: 1});
            }
        });
    }
}
var blinkTimeout = null;

function enlargePhoto(){
    $(".photo-preview img").attr("src", $("#imgAvatar").attr("src"));
    $(".photo-preview-bg").show();
}

function closePhoto(){
    $(".photo-preview-bg").hide();
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

function searchEmployee (){
    document.getElementById("tbEmployeesFilter").focus();
}