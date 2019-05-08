<?php

    $scriptVersion = '1.1';

    session_start();

    require_once('config.php');
    require_once('inc/auth.php');    
    
    $queryString = strtolower($_SERVER['REQUEST_URI']);
    if(stripos($queryString, BASE_URI, 0) === 0)
        $queryString = substr($queryString, strlen(BASE_URI));

    if(stripos($queryString, '/') !== false){
        $parts = explode('/', $queryString);
        $queryString = $parts[0];
    }

    $auth = new Authorization();

    if($queryString == 'api'){
        if($auth->ApiKeyIsCorrect()){
            require_once('inc/api.php');
        }
        die;
    }
    
    if($queryString == 'login' && !empty($_POST['login']) && !empty($_POST['password'])) {
        if($auth->TryLogin($_POST['login'], $_POST['password'])){
            $redirectUrl = BASE_URI.(!empty($_POST['id']) ? ('?id=' . $_POST['id']) : "");
            header("Location: $redirectUrl");
        } else {            
            echo 'incorrect login';
        }
    }

    header('Content-Type: text/html; charset=utf-8');

    if(!$auth->IsAuthorized())
    {
        require('views/login.html.php');
        return;
    }

    $canEdit = $auth->CanEdit();

    switch($queryString) {
        case 'ping':
            return;
        case 'floors':
        case 'rooms':
        case 'employees':
        case 'map':
        case 'export':
            require_once('inc/' . $queryString . '.php');
            return;

        case 'logout':
            $auth->Logout();
            header('Location: '.BASE_URI);
            return;

        default: 
            require('views/index.html.php');
            return;;
    }
?>