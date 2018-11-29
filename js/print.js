function printMap() {
    var printWindow = window.open('', '_blank', '');
    printWindow.document.write('<html><head><title></title>');
    
    // Make sure the relative URL to the stylesheet works:
    printWindow.document.write('<base href="' + location.origin + location.pathname + '">');
    
    // Add the stylesheet link and inline styles to the new document:
    printWindow.document.write('<link rel="stylesheet" href="css/main.css?v=' + scriptVersion + '">');
    
    printWindow.document.write('</head><body class="print"><div id="divMainContainer" class="position-relative">');
    printWindow.document.write(document.getElementById('divMainContainer').innerHTML);
    printWindow.document.write('</div></body></html>');    
    printWindow.document.close();
    printWindow.focus(); // necessary for IE >= 10*/

    setTimeout(function () {
        printWindow.print();
        printWindow.close();
    }, 100);

    return true;
}

function printEmployeesList() {
    var printWindow = window.open('', '_blank', '');
    printWindow.document.write('<html><head><title></title>');
    
    // Make sure the relative URL to the stylesheet works:
    printWindow.document.write('<base href="' + location.origin + location.pathname + '">');
    
    // Add the stylesheet link and inline styles to the new document:
    printWindow.document.write('<link rel="stylesheet" href="css/main.css?v=' + scriptVersion + '">');
    
    printWindow.document.write('</head><body class="print">');
    
    var result = new Array();

    printWindow.document.write('<table>');
    for(var i = 0; i < mapList.length; i++) {        
        var employee = findEmployeeById(mapList[i].Id);
        if(employee != null) {
            employee.RoomName = mapList[i].RoomName;
            employee.FloorId = mapList[i].FloorId;
            result.push(employee);                    
        }
    }
    result.sort(function(a, b){
        var nameA = a.RoomName.toUpperCase(); // ignore upper and lowercase
        var nameB = b.RoomName.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        nameA = a.Name.toUpperCase(); // ignore upper and lowercase
        nameB = b.Name.toUpperCase(); // ignore upper and lowercase

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });

    printWindow.document.write('<table id="tblPrintEmployees"><tr>');
    var currentRoomName = '';
    var currentFloorId = 0;
    var columnIndex = 0;
    for(var i = 0; i < result.length; i++) {
        var item = result[i];
        if(currentFloorId != item.FloorId){
            currentFloorId = item.FloorId;
            var floor = floorsList.find(function(floor){ 
                return floor.Id == currentFloorId
            });
            var src = '/img/rooms/' + floor.Img + '?v=' + scriptVersion;
            //  ToDo: draw rooms and print image
            //printWindow.document.write('</tr><tr class="row-floor"><td colspan="3"><img src="' + src + '" /></td></tr><tr>');            
        }
        if(currentRoomName != item.RoomName){
            currentRoomName = item.RoomName;
            printWindow.document.write('</tr><tr class="row-room"><td colspan="3">' + currentRoomName + '</td></tr><tr>');
            columnIndex = 0;
        }

        printWindow.document.write('<td>' + item.Name + '</td>');

        if(columnIndex++>=2){
            printWindow.document.write('</tr><tr>');
            columnIndex = 0;
        }

    }
    printWindow.document.write('</tr></table>');
    
    printWindow.document.write('</body></html>');    
    printWindow.document.close();
    printWindow.focus(); // necessary for IE >= 10*/

    setTimeout(function () {
        printWindow.print();
        printWindow.close();
    }, 100);

    return true;
}