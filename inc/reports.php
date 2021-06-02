<?php
    require_once('models.php');
    require_once('inc/db.php');

    if($_SERVER['REQUEST_METHOD'] != 'GET')
        die;

    global $queryParams;
    
    switch ($queryParams){
        case 'employeesbyroom':
            printEmployeesByRoom();
            return;
    }

    function printEmployeesByRoom(){
        $db = new ReportsDb();
        global $reportItems;
        $reportItems = $db->GetEmployeesCountByRoom();
        require('views/reports/employeesbyroom.html.php');
        die;
    }

    $reportItems = null;
?>