function canEdit() {
    //  Please don't hack this - another check is done on server - nothing will be saved)
    return userCanEdit;
}


function setEditables(){
    //  Please don't hack this - another check is done on server - nothing will be saved)
    if(!canEdit()){
        $(".editable").hide();
        $("div.row.ip").hide();
    } else {
        $(".readonly").hide();
    }
}

function editEmployee(){
    var employee = {
        id: $("#ddlEmployee").val(),
        ip: $("#txtIP").val(),
        x: $("#hidX").val(),
        y: $("#hidY").val(),
        floorId: $("#ddlFloor").val(),
        roomId: $("#ddlRoom").val()
    };
    saveEmployee(employee, function(){
        isLocked = false;
            cancelEmployeeEdit();
            loadMap(false);

            $li = $("#li" + employee.id);
            $li.removeClass("not-on-map");
            $li.addClass("on-map");
            filterNotOnMap();
    });
}

function deleteEmployeeFromMap(){
    var id = $("#ddlEmployee").val();
    deleteEmployee(id, function(){
        loadMap(false);
        
        $li = $("#li" + id);
        $li.removeClass("on-map");
        $li.addClass("not-on-map");
        filterNotOnMap();
    });
}