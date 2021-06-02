
$(document).ready(function(){
    loadReport(reportId, function(html){
        showReport(html);
    });
});

function loadReport(report, onSuccess){
    $.ajax({
        url: '/reports/' + report,
        method: 'GET',
        success: function(result) {
            if(typeof onSuccess !== 'undefined')
                onSuccess(result);
        }
    });
}

function showReport(html) {
    $("#divReport div.content").html(html);
}

function printReport() {
    var html = $("#divReport div.content").html();
    
    var printWindow = window.open('', 'PRINT', 'height=400,width=600');

    printWindow.document.write('<html><head><title>' + document.title  + '</title></head><body class="print">');
    
    printWindow.document.write(html);    

    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus(); // necessary for IE >= 10*/

    setTimeout(function () {
        printWindow.print();
        printWindow.close();
    }, 100);

    return true;
}