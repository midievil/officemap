<?php

    class ActiveDirectory {
        
        public function TryLogin($login, $password){
            $link = ldap_connect(AD_SERVER); // Your domain or domain server

            if(! $link) {
                return false;
                // Could not connect to server - handle error appropriately
            }
            
            ldap_set_option($link, LDAP_OPT_PROTOCOL_VERSION, 3); // Recommended for AD

            $ldaprdn = AD_DOMAIN . '\\' . $login;
            
            // Now try to authenticate with credentials provided by user
            if ($acc = ldap_bind($link, $ldaprdn, $password)) {
                // Invalid credentials! Handle error appropriately
                return true;
            } 
            
            return false;            
        }
        
    }

?>