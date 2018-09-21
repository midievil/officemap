<?php
    session_start();

    header('Content-Type: text/html; charset=utf-8');

    require_once('config.php');
    require_once('inc/auth.php');    

    $scriptVersion = '0.68';

    $queryString = strtolower($_SERVER['REQUEST_URI']);
    $queryString = str_replace(BASE_URI, '', $queryString);

    $auth = new Authorization();

    if($queryString == 'login' && !empty($_POST['login']) && !empty($_POST['password'])) {
        if($auth->TryLogin($_POST['login'], $_POST['password'])){
            header('Location: '.BASE_URI);
        } else {
            echo 'incorrect login';
        }
    }

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
            require_once('inc/' . $queryString . '.php');            
            return;

        case 'logout':
            $auth->Logout();
            header('Location: '.BASE_URI);
            return;

        
        case '':
            require('views/index.html.php');
            return;

        default: 
            die();
    }
?>