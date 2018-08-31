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
    } else {
        $(".readonly").hide();
    }
}
