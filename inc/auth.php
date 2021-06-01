<?php

    require_once('inc/ad.php');
    require_once("inc/db.php");

    class Authorization
    {
        private function sendAuthPostRequest($endpoint, $params)
        {
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://my.mmtr.ru/ts-rest/SingleSignOn/$endpoint",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => json_encode($params),
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/json"
                ),
            ));

            $response = curl_exec($curl);
            curl_close($curl);
            //var_dump($response);

            $result = json_decode($response);

            return $result;
        }

        public function IsAuthorized() {

            //if(isset($_SESSION['is_logged_in']) 
            //    && $_SESSION['is_logged_in'] === true)
            //    return true;

            //return false;

            if(isset($_COOKIE["token"]))
            {
                $token = $_COOKIE["token"];

                $result = $this-> sendAuthPostRequest(
                    'getUserByTokenInfo', 
                    array( "tokenInfo" => $token )
                );

                if($result->isSuccess){                
                    $_SESSION['user_id'] = $result->object->id;
                    $_SESSION['is_pm'] = false;
                    //var_dump("ok");
                    //die;
                    return true;
                }
            }

            unset($_COOKIE['token']);             
            return false;
        }

        public function TryLogin($login, $password) 
        {
            if(Authorization::IsInjection($login))
            {
                return false;
            }

            $result = $this->sendAuthPostRequest(
                'authorization', 
                array(
                    "login" => $login,
                    "password" => $password
                )
            );

            if($result->isSuccess === true)
            {
                $_SESSION['is_logged_in'] = true;

                $db = new EmployeeDB();
                $emp = $db->GetEmployeeByLoginPassword($login, $password);
                $_SESSION['user_id'] = $emp->Id;
                $_SESSION['is_pm'] = $emp->IsProjectManager;// && $emp->KindOfActivityId == 5;

                unset($_COOKIE['token']); 
                setcookie("token", $result->object->userToken->tokenInfo, time()+60*60*24*30, '/', 'mmtr.ru');

                //var_dump($_COOKIE["token"]); die;

                return true;
            }

            return false;

            
            $ad = new ActiveDirectory();
            if($ad->TryLogin($login, $password))
            {
                $_SESSION['is_logged_in'] = true;

                $db = new EmployeeDB();
                $emp = $db->GetEmployeeByLoginPassword($login, $password);
                $_SESSION['user_id'] = $emp->Id;
                $_SESSION['is_pm'] = $emp->IsProjectManager;// && $emp->KindOfActivityId == 5;

                if(isset($_POST["remember"])) {
                    setcookie('remember', 'true', time()+60*60*24*30);
                } else {
                    setcookie('remember', '', time()-3600);
                }

                return true;
            }

            return false;
        }

        public function Logout() {
            $_SESSION['user_id'] = null;
            $_SESSION['is_logged_in'] = false;

            if(isset($_COOKIE["token"]))
            {   
                $token = $_COOKIE["token"];

                $result = $this-> sendAuthPostRequest(
                    'logout', 
                    array(
                        "tokenInfo" => $token
                    )
                );
            }
        }

        public function GetUserId(){
            $result = $_SESSION['user_id'];
            //if($result == 14)
            //    $result = 1;    //  TMP: TO TEST UNDER OTHER USER
            return $result;
        }

        public static function CanEdit() {
            return Authorization::IsAdmin() || Authorization::IsProjectManager();;
        }

        public static function IsAdmin() {
            return isset($_SESSION['user_id']) && in_array($_SESSION['user_id'], Authorization::GetAdminIds());
        }

        public static function IsProjectManager(){
            return isset($_SESSION['is_pm']) && $_SESSION['is_pm'];
        }

        private static function GetAdminIds(){
            return explode(',', ADMIN_IDS);
        }

        public function ApiKeyIsCorrect(){
            return true;
            foreach (getallheaders() as $name => $value) {
                if($name == 'Authorization' && $value == 'Basic ' . API_SECRET)
                    return true;
            }
            return false;
        }

        public static function IsInjection($str)
        {
            return preg_match("/[<>*'=+]/", $str);
        }
    }
?>