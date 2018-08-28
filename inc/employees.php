<?php

    require_once('inc/db.php');

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method){
        case 'GET':
            get();
            return;
    }


    function get() {
        $db = new EmployeeDB();

        $employees = $db->GetAllEmployees();
        
        echo json_encode($employees);
    }

    

    
?>