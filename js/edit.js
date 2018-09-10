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
