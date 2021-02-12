<!--
    Document   : app
    Created on : 4 junio. 2020, 10:38:18
    Author     : Andres Llontop diaz
-->

<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Meta tags -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Aplicacion Molino Rey">
    <meta name="author" content="MOLINO REY">
    <meta name="copyright" content="MOLINO REY">
    <meta name="keywords" content="
              molino rey, 
              sistema molino rey, 
              aplicacion molino rey
              ">
    <!-- /meta tags -->
    <title>Molino Rey</title>

    <!-- Site favicon -->
    <link rel="shortcut icon" href="<?php echo(SERVERURL); ?>assets/images/logo/14.png" type="image/x-icon">
    <!-- /site favicon -->
    <!-- Font Icon Styles -->
    
    <link rel="stylesheet" href="<?php echo(SERVERURL); ?>vendors/gaxon-icon/styles.css">
    <!-- /font icon Styles -->

    <!-- Perfect Scrollbar stylesheet -->
    <link rel="stylesheet" href="<?php echo(SERVERURL); ?>plugins/perfect-scrollbar/css/perfect-scrollbar.css">
    <!-- /perfect scrollbar stylesheet -->

    <!-- Load Styles -->
    <link rel="stylesheet" href="<?php echo(SERVERURL); ?>assets/css/style.min.css">
    <!-- /load styles -->
    <?php

        $beanResource = $routes->getResourceForContainerApp();
            //INCLUIMOS LOS STYLES
            $array_styles = $beanResource->path_styles;
            if ($array_styles !="") {
              foreach ($array_styles as $path_style) {
                echo '
                <link
                rel="stylesheet"
                href="'.SERVERURL.$path_style . '"
              />

            ';
          } }
          ?>
</head>

<body>

    <!-- Loader -->
    <div class="dt-loader-container">
        <div class="dt-loader">
            <svg class="circular" viewBox="25 25 50 50">
                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10">
                </circle>
            </svg>
        </div>
    </div>
    <!-- /loader -->

    <!-- Root -->
    <div class="dt-root">
        <div class="dt-root__inner">

            <!-- Header -->
            <header class="dt-header">

                <!-- Header Top -->
                <div class="dt-header__top d-lg-none" style="height:60px">

                    <!-- Custom Container -->
                    <div class="dt-container">

                        <!-- Brand -->
                        <div class="dt-brand">

                            <!-- Brand tool -->
                            <div class="dt-brand__tool d-md-none" data-toggle="main-sidebar">
                                <div class="hamburger-inner"></div>
                            </div>
                            <!-- /brand tool -->

                            <!-- Brand logo -->
                            <span class="dt-brand__logo">
                                <a class="dt-brand__logo-link"  href="javascript:void(0)">
                                    <img class="dt-brand__logo-img d-none d-sm-inline-block size-50"
                                        src="<?php echo(SERVERURL); ?>assets/images/logo/12.png" alt="Molino Rey"
                                        style="max-width: 60px;">
                                    <img class="dt-brand__logo-symbol d-sm-none size-30"
                                        src="<?php echo(SERVERURL); ?>assets/images/logo/12.png"
                                        alt="Molino Rey">
                                </a>
                            </span>
                            <!-- /brand logo -->

                        </div>
                        <!-- /brand -->

                        <!-- Header toolbar-->
                        <div class="dt-header__toolbar">

                            <!-- Header Menu Wrapper -->
                            <div class="dt-nav-wrapper">

                                <!-- Header Menu -->
                                <ul class="dt-nav">
                                    <li class="dt-nav__item">

                                        <!-- Dropdown Link -->
                                        <a href="javascript:void(0)" class="dt-nav__link"> <i
                                                class="icon icon-question-circle icon-xl"></i>
                                            <span>Help</span> </a>
                                        <!-- /dropdown link -->

                                    </li>
                                </ul>
                                <!-- /header menu -->

                                <!-- Header Menu -->
                                <ul class="dt-nav">
                                    <li class="dt-nav__item dropdown">

                                        <!-- Dropdown Link -->
                                        <a href="#" class="dt-nav__link dropdown-toggle no-arrow dt-avatar-wrapper"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img class="dt-avatar size-50"
                                                src=""
                                                alt="Domnic Harris">
                                            <span class="dt-avatar-info d-none d-sm-block pl-3">
                                                <span class="d-block text-light-primary f-10 mb-1">Welcome back!</span>
                                                <span class="dt-avatar-name name-user-session">Bob Hyden</span>
                                            </span> </a>
                                        <!-- /dropdown link -->

                                        <!-- Dropdown Option -->
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <div
                                                class="dt-avatar-wrapper flex-nowrap p-6 mt-n2 bg-gradient-purple text-white rounded-top">
                                                <img class="dt-avatar"
                                                    ssrc=""
                                                    alt="Domnic Harris">
                                                <span class="dt-avatar-info">
                                                    <span class="dt-avatar-name name-user-session">Bob Hyden</span>
                                                    <span class="f-12">Administrator</span>
                                                </span>
                                            </div>
                                            <a class="dropdown-item a-perfil" href="javascript:void(0)"> <i
                                                    class="icon icon-user icon-fw mr-2 mr-sm-1"></i>Account
                                         
                                            <a class="dropdown-item a-close-session" href="javascript:void(0)">
                                                <i class="icon icon-logout icon-fw mr-2 mr-sm-1"></i>Logout
                                            </a>
                                        </div>
                                        <!-- /dropdown option -->

                                    </li>
                                </ul>
                                <!-- /header menu -->
                            </div>
                            <!-- Header Menu Wrapper -->

                        </div>
                        <!-- /header toolbar -->

                    </div>
                    <!-- /custom container -->

                </div>
                <!-- /header top -->

                <!-- Header Bottom -->
                <div class="dt-header__bottom d-none d-md-block">

                    <!-- Custom Container -->
                    <div class="dt-container">
                        <!-- Brand -->
                        <div class="dt-brand d-none d-lg-flex">

                            <!-- Brand tool -->
                            <div class="dt-brand__tool d-md-none" data-toggle="main-sidebar">
                                <div class="hamburger-inner"></div>
                            </div>
                            <!-- /brand tool -->

                            <!-- Brand logo -->
                            <span class="dt-brand__logo pr-4">
                                <a class="dt-brand__logo-link" href="javascript:void(0)">
                                    <img class="dt-brand__logo-img d-none d-sm-inline-block size-50"
                                        src="<?php echo(SERVERURL); ?>assets/images/logo/14.png"
                                        style="max-width: 60px;" alt="Drift">
                                </a>
                            </span>
                            <!-- /brand logo -->

                        </div>
                        <!-- /brand -->
                        <!-- Navbar -->
                        <ul id="menus_molino_other" class="navbar-nav navbar-expand-md dt-navbar">

                           
                        </ul>
                        <!-- /navbar -->

                        <!-- Header Toolbar -->
                        <div class="dt-header__toolbar d-none d-lg-flex">

                            <!-- Header Menu Wrapper -->
                            <div class="dt-nav-wrapper">
                                <!-- Header Menu -->
                                <ul class="dt-nav">
                                    <li class="dt-nav__item">

                                        <!-- Dropdown Link -->
                                        <a href="javascript:void(0)" class="dt-nav__link"> <i
                                                class="icon icon-question-circle icon-xl"></i>
                                            <span>Help</span> </a>
                                        <!-- /dropdown link -->

                                    </li>
                                </ul>
                                <!-- /header menu -->
                                <!-- Header Menu -->
                                <ul class="dt-nav">
                                    <li class="dt-nav__item dropdown">

                                        <!-- Dropdown Link -->
                                        <a href="#" class="dt-nav__link dropdown-toggle no-arrow dt-avatar-wrapper"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img class="dt-avatar size-50"
                                                src=""
                                                alt="Domnic Harris">
                                            <span class="dt-avatar-info d-none d-sm-block pl-3">
                                                <span class="d-block text-light-primary f-10 mb-1">Bienvenido!</span>
                                                <span class="dt-avatar-name name-user-session">Bob Hyden</span>
                                            </span> </a>
                                        <!-- /dropdown link -->

                                        <!-- Dropdown Option -->
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <div
                                                class="dt-avatar-wrapper flex-nowrap p-6 mt-n2 bg-gradient-purple text-white rounded-top">
                                                <img class="dt-avatar"
                                                    src=""
                                                    alt="Domnic Harris">
                                                <span class="dt-avatar-info">
                                                    <span class="dt-avatar-name name-user-session">Bob Hyden</span>
                                                    <span class="f-12">Administrator</span>
                                                </span>
                                            </div>
                                            <a class="dropdown-item a-perfil" href="javascript:void(0)"> <i
                                                    class="icon icon-user icon-fw mr-2 mr-sm-1"></i>Account
                                         
                                            <a class="dropdown-item a-close-session" href="javascript:void(0)">
                                                <i class="icon icon-logout icon-fw mr-2 mr-sm-1"></i>Logout
                                            </a>
                                        </div>
                                        <!-- /dropdown option -->

                                    </li>
                                </ul>
                                <!-- /header menu -->
                            </div>
                            <!-- /header menu wrapper -->

                        </div>
                        <!-- /header toolbar -->

                    </div>
                    <!-- /custom container -->

                </div>
                <!-- /header bottom -->

            </header>
            <!-- /header -->

            <!-- Site Main -->
            <main class="dt-main">
                <!-- Sidebar -->
                <aside id="main-sidebar" class="dt-sidebar d-md-none">
                    <div  class="dt-sidebar__container">

                        <!-- Sidebar Navigation -->
                        <ul id="menus_molino" class="dt-side-nav">

                        </ul>
                        <!-- /sidebar navigation -->

                    </div>
                </aside>
                <!-- /sidebar -->

                <!-- Custom Container -->
                <div class="dt-container mw-100">

                    <!-- Site Content Wrapper -->
                    <div class="dt-content-wrapper">

                        <!-- Site Content -->
                        <div class="dt-content">

                            <?php
              //INCLUIMOS LOS HTML
              $array_resource = $beanResource->path_resource;
              if ($array_resource !="") {
                foreach ($array_resource as $path_resources) {
                  include($path_resources);
                     } }

              ?>

                        </div>
                        <!-- /site content -->

                    </div>
                    <!-- /site content wrapper -->

                </div>
                <!-- /custom Container -->

            </main>
            <!-- /main -->

            <!-- Footer -->
            <footer class="dt-footer">
                <div class="dt-container">
                    Copyright Company Name © 2019
                </div>
            </footer>
            <!-- /footer -->

        </div>
    </div>
    <!-- /root -->

    <!-- Optional JavaScript -->
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>plugins/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>plugins/moment/moment.js"></script>
    <script type="text/javascript"
        src="<?php echo(SERVERURL); ?>plugins/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script type="text/javascript"
        src="<?php echo(SERVERURL); ?>plugins/jquery-pagination/jquery.Pagination.min.js"></script>
    <!-- Perfect Scrollbar jQuery -->
    <script type="text/javascript"
        src="<?php echo(SERVERURL); ?>plugins/perfect-scrollbar/dist/perfect-scrollbar.min.js"></script>
    <!-- /perfect scrollbar jQuery -->

    <!-- masonry script -->
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>plugins/sweetalert2/dist/sweetalert2.js"></script>
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>assets/js/functions.js"></script>
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>assets/js/customizer.js"></script>

    <!-- Resources -->

    <script type="text/javascript" src="<?php echo(SERVERURL); ?>assets/js/functions.js"></script>
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>assets/js/custom/apps/app.js"></script>
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>assets/js/customizer.js"></script>
   
    <!--Scripts TiendaIniciales-->

    <script type="text/javascript" src="<?php echo(SERVERURL); ?>scripts/util/functions.js"></script>
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>scripts/util/functions_operational.js"></script>
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>scripts/util/configuration_api.js"></script>
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>scripts/util/functions_alerts.js"></script>
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>scripts/init_parameters.js"></script>

    <!--Scripts -->
    <!--script src="<%out.print(request.getContextPath());%>/scripts/session/change.cookie.js"></script-->
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>scripts/session/js.cookie.js?v=0.11"></script>
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>scripts/session/session.validate.js?v=0.11"></script>
    <script type="text/javascript" src="<?php echo(SERVERURL); ?>scripts/session/session.validate.init.js?v=0.11"></script>
    
    <!--Scripts -->

    <!--Scripts MOLINO-->

    <?php
            //INCLUIMOS LOS SCRIPTS
            $array_scripts = $beanResource->path_scripts; if ($array_scripts !=
    "") { foreach ($array_scripts as $path_script) { echo '
    <script type="text/javascript" src="'.SERVERURL.$path_script . '"></script>
    '; } } 
    ?>

</body>

</html>