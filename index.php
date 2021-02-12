<?php
require_once './core/ConfigGeneral.php';
require_once "_util_php/BeanResource.php";
require_once "_util_php/Routes.php";
//INSTANCIA PARA AGREGAR HTML DIMAMICO
$routes = new Routes();
$routes->subProject();
//
// include 'vistas/coming-soon.php';
