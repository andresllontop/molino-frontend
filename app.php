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
    <link rel="shortcut icon" href="<?php echo (SERVERURL); ?>assets/images/logo/14.png" type="image/x-icon">
    <!-- /site favicon -->
    <!-- Font Icon Styles -->

    <link rel="stylesheet" href="<?php echo (SERVERURL); ?>vendors/gaxon-icon/styles.css">
    <!-- /font icon Styles -->

    <!-- Perfect Scrollbar stylesheet -->
    <link rel="stylesheet" href="<?php echo (SERVERURL); ?>plugins/perfect-scrollbar/css/perfect-scrollbar.css">
    <!-- /perfect scrollbar stylesheet -->

    <!-- Load Styles -->
    <link rel="stylesheet" href="<?php echo (SERVERURL); ?>assets/css/light-style-6.min.css">
    <!-- /load styles -->
    <?php

$beanResource = $routes->getResourceForContainerApp();
//INCLUIMOS LOS STYLES
$array_styles = $beanResource->path_styles;
if ($array_styles != "") {
    foreach ($array_styles as $path_style) {
        echo '
                <link
                rel="stylesheet"
                href="' . SERVERURL . $path_style . '"
              />

            ';
    }}
?>
</head>

<body class="dt-layout--full-width dt-header--fixed dt-sidebar--fixed">

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

                <!-- Header container -->
                <div class="dt-header__container">

                    <!-- Brand -->
                    <div class="dt-brand">

                        <!-- Brand tool -->
                        <div class="dt-brand__tool" data-toggle="main-sidebar">
                            <div class="hamburger-inner"></div>
                        </div>
                        <!-- /brand tool -->

                        <!-- Brand logo -->
                        <span class="dt-brand__logo">
                            <a class="dt-brand__logo-link" href="index.html">
                                <img class="dt-brand__logo-img d-none d-sm-inline-block size-50"
                                src="<?php echo (SERVERURL); ?>assets/images/logo/12.png" alt="Molino" style="max-width: 60px;">
                                <img class="dt-brand__logo-symbol d-sm-none size-30" src="<?php echo (SERVERURL); ?>assets/images/logo/12.png" alt="Molino">
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
                            <ul class="dt-nav d-none">
                                <li class="dt-nav__item dt-notification dropdown">

                                    <!-- Dropdown Link -->
                                    <a href="#" class="dt-nav__link dropdown-toggle no-arrow" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false"> <i
                                            class="icon icon-notification2 icon-fw dt-icon-alert"></i>
                                    </a>
                                    <!-- /dropdown link -->

                                    <!-- Dropdown Option -->
                                    <div class="dropdown-menu dropdown-menu-right dropdown-menu-media">
                                        <!-- Dropdown Menu Header -->
                                        <div class="dropdown-menu-header">
                                            <h4 class="title">Notifications (9)</h4>

                                            <div class="ml-auto action-area">
                                                <a href="javascript:void(0)">Mark All Read</a> <a class="ml-2"
                                                    href="javascript:void(0)">
                                                    <i class="icon icon-settings icon-lg text-light-gray"></i> </a>
                                            </div>
                                        </div>
                                        <!-- /dropdown menu header -->

                                        <!-- Dropdown Menu Body -->
                                        <div class="dropdown-menu-body ps-custom-scrollbar">

                                            <div class="h-auto">
                                                <!-- Media -->
                                                <a href="javascript:void(0)" class="media">

                                                    <!-- Avatar -->
                                                    <img class="dt-avatar mr-3"
                                                        src="http://localhost//molino-frontend/assets/images/logo/13.png" alt="User">
                                                    <!-- avatar -->

                                                    <!-- Media Body -->
                                                    <span class="media-body">
                                                        <span class="message">
                                                            <span class="user-name">Stella Johnson</span> and <span
                                                                class="user-name">Chris Harris</span>
                                                            have birthdays today. Help them celebrate!
                                                        </span>
                                                        <span class="meta-date">8 hours ago</span>
                                                    </span>
                                                    <!-- /media body -->

                                                </a>
                                                <!-- /media -->

                                                <!-- Media -->
                                                <a href="javascript:void(0)" class="media">

                                                    <!-- Avatar -->
                                                    <img class="dt-avatar mr-3"
                                                        src="http://localhost//molino-frontend/assets/images/logo/13.png" alt="User">
                                                    <!-- avatar -->

                                                    <!-- Media Body -->
                                                    <span class="media-body">
                                                        <span class="message">
                                                            <span class="user-name">Jonathan Madano</span> commented on
                                                            your post.
                                                        </span>
                                                        <span class="meta-date">9 hours ago</span>
                                                    </span>
                                                    <!-- /media body -->

                                                </a>
                                                <!-- /media -->

                                                <!-- Media -->
                                                <a href="javascript:void(0)" class="media">

                                                    <!-- Avatar -->
                                                    <img class="dt-avatar mr-3"
                                                        src="http://localhost//molino-frontend/assets/images/logo/13.png" alt="User">
                                                    <!-- avatar -->

                                                    <!-- Media Body -->
                                                    <span class="media-body">
                                                        <span class="message">
                                                            <span class="user-name">Chelsea Brown</span> sent a video
                                                            recomendation.
                                                        </span>
                                                        <span class="meta-date">
                                                            <i
                                                                class="icon icon-play-circle text-primary icon-fw mr-1"></i>
                                                            13 hours ago
                                                        </span>
                                                    </span>
                                                    <!-- /media body -->

                                                </a>
                                                <!-- /media -->

                                                <!-- Media -->
                                                <a href="javascript:void(0)" class="media">

                                                    <!-- Avatar -->
                                                    <img class="dt-avatar mr-3"
                                                        src="https://via.placeholder.com/150x150" alt="User">
                                                    <!-- avatar -->

                                                    <!-- Media Body -->
                                                    <span class="media-body">
                                                        <span class="message">
                                                            <span class="user-name">Alex Dolgove</span> and <span
                                                                class="user-name">Chris Harris</span>
                                                            like your post.
                                                        </span>
                                                        <span class="meta-date">
                                                            <i class="icon icon-like text-light-blue icon-fw mr-1"></i>
                                                            yesterday at 9:30
                                                        </span>
                                                    </span>
                                                    <!-- /media body -->

                                                </a>
                                                <!-- /media -->
                                            </div>

                                        </div>
                                        <!-- /dropdown menu body -->

                                        <!-- Dropdown Menu Footer -->
                                        <div class="dropdown-menu-footer">
                                            <a href="javascript:void(0)" class="card-link"> See All <i
                                                    class="icon icon-arrow-right icon-fw"></i>
                                            </a>
                                        </div>
                                        <!-- /dropdown menu footer -->
                                    </div>
                                    <!-- /dropdown option -->

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
                <!-- /header container -->

            </header>
            <!-- /header -->

            <!-- Site Main -->
            <main class="dt-main">
                <!-- Sidebar -->
                <aside id="main-sidebar" class="dt-sidebar">
                    <div class="dt-sidebar__container">

                        <!-- Sidebar Navigation -->
                        <ul id="menus_molino" class="dt-side-nav">

                        </ul>
                        <!-- /sidebar navigation -->

                    </div>
                </aside>
                <!-- /sidebar -->

                <!-- Site Content Wrapper -->
                <div class="dt-content-wrapper">

                    <!-- Site Content -->
                    <div class="dt-content px-3">

                        <?php
//INCLUIMOS LOS HTML
$array_resource = $beanResource->path_resource;
if ($array_resource != "") {
    foreach ($array_resource as $path_resources) {
        include $path_resources;
    }}

?>

                    </div>
                    <!-- /site content -->

                    <!-- Footer -->
                    <footer class="dt-footer">
                        <div class="dt-container">
                            Copyright Company Name © 2019
                        </div>
                    </footer>
                    <!-- /footer -->

                </div>
                <!-- /site content wrapper -->

                    <!-- Theme Chooser -->
            <div class="dt-customizer-toggle">
                <a href="javascript:void(0)" data-toggle="customizer"> <i
                        class="icon icon-customizer animation-customizer"></i> </a>
            </div>
            <!-- /theme chooser -->

            <!-- Customizer Sidebar -->
            <aside class="dt-customizer dt-drawer position-right">
                <div class="dt-customizer__inner">

                    <!-- Customizer Header -->
                    <div class="dt-customizer__header">

                        <!-- Customizer Title -->
                        <div class="dt-customizer__title">
                            <h3 class="mb-0">Theme Settings</h3>
                        </div>
                        <!-- /customizer title -->

                        <!-- Close Button -->
                        <button type="button" class="close" data-toggle="customizer">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <!-- /close button -->

                    </div>
                    <!-- /customizer header -->

                    <!-- Customizer Body -->
                    <div class="dt-customizer__body ps-custom-scrollbar">
                        <!-- Customizer Body Inner  -->
                        <div class="dt-customizer__body-inner">

                            <!-- Section -->
                            <section>
                                <h4>Theme</h4>

                                <!-- List -->
                                <ul class="dt-list dt-list-sm" id="theme-chooser">
                                    <li class="dt-list__item">
                                        <div class="choose-option">
                                            <a href="javascript:void(0)" class="choose-option__icon" data-theme="light">
                                                <img src="<?php echo (SERVERURL); ?>assets/images/customizer-icons/theme-light.png" alt="Light">
                                            </a>
                                            <span class="choose-option__name">Light</span>
                                        </div>
                                    </li>

                                    <li class="dt-list__item">
                                        <div class="choose-option">
                                            <a href="javascript:void(0)" class="choose-option__icon" data-theme="dark">
                                                <img src="<?php echo (SERVERURL); ?>assets/images/customizer-icons/theme-dark.png" alt="Dark">
                                            </a>
                                            <span class="choose-option__name">Dark</span>
                                        </div>
                                    </li>
                                </ul>
                                <!-- /list -->

                            </section>
                            <!-- /section -->

                        </div>
                        <!-- /customizer body inner -->
                    </div>
                    <!-- /customizer body -->

                </div>
            </aside>
            <!-- /customizer sidebar -->

            </main>
            <!-- /main -->



        </div>
    </div>
    <!-- /root -->

    <!-- Optional JavaScript -->
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>plugins/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>plugins/moment/moment.js"></script>
    <script type="text/javascript"
        src="<?php echo (SERVERURL); ?>plugins/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script type="text/javascript"
        src="<?php echo (SERVERURL); ?>plugins/jquery-pagination/jquery.Pagination.min.js"></script>
    <!-- Perfect Scrollbar jQuery -->
    <script type="text/javascript"
        src="<?php echo (SERVERURL); ?>plugins/perfect-scrollbar/dist/perfect-scrollbar.min.js"></script>
    <!-- /perfect scrollbar jQuery -->

    <!-- masonry script -->
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>plugins/sweetalert2/dist/sweetalert2.js"></script>
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>assets/js/functions.js"></script>
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>assets/js/customizer.js"></script>
    <!-- Resources -->

    <script type="text/javascript" src="<?php echo (SERVERURL); ?>assets/js/functions.js"></script>
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>assets/js/custom/apps/app.js"></script>
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>assets/js/customizer.js"></script>

    <!--Scripts TiendaIniciales-->

    <script type="text/javascript" src="<?php echo (SERVERURL); ?>scripts/util/functions.js"></script>
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>scripts/util/functions_operational.js"></script>
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>scripts/util/configuration_api.js"></script>
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>scripts/util/functions_alerts.js"></script>
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>scripts/init_parameters.js"></script>

    <!--Scripts -->
    <!--script src="<%out.print(request.getContextPath());%>/scripts/session/change.cookie.js"></script-->
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>scripts/session/js.cookie.js?v=0.11"></script>
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>scripts/session/session.validate.js?v=0.11"></script>
    <script type="text/javascript"
        src="<?php echo (SERVERURL); ?>scripts/session/session.validate.init.js?v=0.11"></script>

    <!--Scripts -->

    <!--Scripts MOLINO-->

    <?php
//INCLUIMOS LOS SCRIPTS
$array_scripts = $beanResource->path_scripts;if ($array_scripts !=
    "") {foreach ($array_scripts as $path_script) {echo '
    <script type="text/javascript" src="' . SERVERURL . $path_script . '"></script>
    ';}}
?>

</body>

</html>