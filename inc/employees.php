<?php

    require_once('inc/db.php');

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method){
        case 'GET':

            global $queryParams;
            if(!empty($queryParams))
            {
                if($queryParams == 'managed')
                {
                    echo json_encode(getManagedIds());
                    die;
                }

                getById($queryParams);
                die;
            }

            get();
            return;
    }


    function get() {
        $db = new EmployeeDB();

        $employees = $db->GetAllEmployees();
        
        echo json_encode($employees);
    }

    function getById($id) {
        $db = new EmployeeDB();

        $result =  $db->GetEmployeeById($id);

        //  Pinging domain name to get Ip 
        $pingResult = exec('ping -n 1 ' . $result->Login, $output);
        $responseString = $output[1];
        
        //  Parsing IP from response
        preg_match('/\[(.*)\]/', $responseString, $matches);        
        if( array_key_exists(1, $matches) && !empty($matches[1]))
            $result->Ip = $matches[1];


        echo json_encode($result);
    }

    function getManagedIds() {
        $db = new EmployeeDB();
        return $db->GetManagedEmployeeIds(Authorization::GetUserId());
    }
?>