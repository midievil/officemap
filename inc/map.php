<?php

    require_once('models.php');
    require_once('inc/db.php');

    $method = $_SERVER['REQUEST_METHOD'];    

    switch ($method){
        case 'GET':
            get();
            return;

        case 'POST':
            post();
            return;

        case 'DELETE':
            delete();
            return;
    }


    function get() {
        $db = new MapDB();

        $roomId = null;
        if(isset($_GET['roomid'])) {
            $roomId = $_GET['roomid'];
        }

        $employees = $db->GetAllEmployees();
        
        echo json_encode($employees);
    }

    function post()
    {
        global $canEdit;

        $userId = Authorization::GetUserId();
        $employeeId = $_POST['employeeId'];

        $empDb = new EmployeeDB();

        if(!$canEdit && $employeeId != $userId && !$empDb->IsManagerOf($userId, $employeeId))
        {
            echo 'unauthorized';
            return;
        }

        $db = new MapDB();
        $emp = $db->GetEmployee($employeeId);
        if(empty($emp)){
            $db->AddEmployee($employeeId, $_POST['ip'], $_POST['x'], $_POST['y'], $_POST['floor'], $_POST['room']);
        } else {
            $db->UpdateEmployee($employeeId, $_POST['ip'], $_POST['x'], $_POST['y'], $_POST['floor'], $_POST['room']);
        }
        echo "ok";
    }

    function delete(){
        $employeeId =  str_ireplace(BASE_URI.'map/', '', ($_SERVER[REQUEST_URI]));

        global $canEdit;

        $userId = Authorization::GetUserId();
        
        $empDb = new EmployeeDB();

        if(!$canEdit && $employeeId != $userId && !$empDb->IsManagerOf($userId, $employeeId))
        {
            echo 'unauthorized';
            return;
        }

        $db = new MapDB();
        $db->DeleteEmployeeFromMap($employeeId);
        die;
    }

    
?>