<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}


function isUltimo( string $actual, string $proximo):bool{
    if ($actual !== $proximo) {
        return true;
    } 
    return false;
}

    function isSession(){
            if(!isset($_SESSION)) {
            session_start();
            }
    }


    function isAdmin() : void {
        if(!isset($_SESSION['admin'])) {
            header('Location: /');
        }
    }


function isBarbero() {
    if (!isset($_SESSION['rolId']) || $_SESSION['rolId'] != 2) {
        header('Location: /');
        exit();
    }
}




