<!--
    Document   : app
    Created on : 4 junio. 2020, 10:38:18
    Author     : Andres Llontop diaz
-->
<!DOCTYPE html>
<html lang="es">

<head>
  <!-- Meta tags -->
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="Aplicacion Molino Rey">
  <meta name="author" content="MOLINO REY">
  <meta name="copyright" content="MOLINO REY">
  <meta name="keywords" content="
              molino rey, 
              sistema molino rey, 
              aplicacion molino rey
              ">
  <!--meta name="HandhelFriendly" content="true" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" / -->
  <!-- /meta tags -->
  <title>Molino Rey</title>

  
  <!--link rel="apple-touch-icon" href="<?php echo(SERVERURL); ?>assets/images/favicon.ico" type="image/x-icon" />
  <link rel="apple-touch-startup-image" href="<?php echo(SERVERURL); ?>assets/images/favicon.ico"  type="image/x-icon" />
  <link rel="manifest" href="<?php echo(SERVERURL); ?>manifest.json" /-->
  <!-- Site favicon -->
  <link rel="shortcut icon" href="<?php echo(SERVERURL); ?>assets/images/logo/14.png" type="image/x-icon" />
  <!-- /site favicon -->

  <!-- Font Icon Styles -->
  <link rel="stylesheet" href="<?php echo(SERVERURL); ?>vendors/gaxon-icon/styles.css" />
  <!-- /font icon Styles -->
  <!-- Load Styles -->
  <link rel="stylesheet" href="<?php echo(SERVERURL); ?>assets/css/style.min.css">
  <!-- /load styles -->
  <?php
    $beanResource = $routes->getResourceForContainerAuth();
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
  <!-- /load styles -->
</head>

<body class="dt-sidebar--fixed dt-header--fixed">
  <!-- Loader -->
  <div class="dt-loader-container">
    <div class="dt-loader">
      <svg class="circular" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle>
      </svg>
    </div>
  </div>
  <!-- /loader -->

  <!-- Root -->
  <div class="dt-root">
    <div class="dt-root__inner">
      <!-- Site Main -->
      <main class="dt-main">
        <!-- Site Content Wrapper -->
        <div class="dt-content-wrapper">
          <!-- Site Content -->
          <div id="app_container" class="dt-root">
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

          <!-- Footer -->
          <footer class="dt-footer">
            Copyright Company Andres © 2020 v1.0
          </footer>
          <!-- /footer -->
        </div>
        <!-- /site content wrapper -->

      </main>
    </div>
  </div>
  <!-- /root -->

  <!-- Optional JavaScript -->
  <script type="text/javascript" src="<?php echo(SERVERURL); ?>plugins/jquery/dist/jquery.min.js"></script>

  <!-- Perfect Scrollbar jQuery -->
  <script type="text/javascript" src="<?php echo(SERVERURL); ?>plugins/perfect-scrollbar/dist/perfect-scrollbar.min.js"></script>
  <script type="text/javascript" src="<?php echo(SERVERURL); ?>plugins/sweetalert2/dist/sweetalert2.js"></script>

  <!-- /perfect scrollbar jQuery -->
  <script type="text/javascript"
    src="<?php echo(SERVERURL); ?>plugins/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

  <!-- masonry script -->
  <script type="text/javascript" src="<?php echo(SERVERURL); ?>assets/js/functions.js"></script>
  <script type="text/javascript" src="<?php echo(SERVERURL); ?>assets/js/customizer.js"></script>
  <script type="text/javascript" src="<?php echo(SERVERURL); ?>assets/js/script.js"></script>

  <!--Scripts -->
  <script type="text/javascript" src="<?php echo(SERVERURL); ?>scripts/util/functions.js"></script>
  <script type="text/javascript" src="<?php echo(SERVERURL); ?>scripts/util/configuration_api.js"></script>
  <script type="text/javascript" src="<?php echo(SERVERURL); ?>scripts/util/functions_alerts.js"></script>

  <!--script type="text/javascript" src="<?php echo(SERVERURL); ?>service_worker.js"></script>
  <script type="text/javascript" src="<?php echo(SERVERURL); ?>service_worker_script.js"></script-->

  <!--Scripts -->
  <script type="text/javascript" src="<?php echo(SERVERURL); ?>scripts/session/js.cookie.js?v=0.11"></script>
  <script type="text/javascript"
    src="<?php echo(SERVERURL); ?>scripts/session/session.validate.login.js?v=0.11"></script>

  <!--Scripts RedTienda-->

  <?php
            //INCLUIMOS LOS SCRIPTS
            $array_scripts = $beanResource->path_scripts; 
            if ($array_scripts !=
    "") { foreach ($array_scripts as $path_script) { echo '
    <script type="text/javascript" src="'.SERVERURL.$path_script . '"></script>
    '; } } ?>

</body>

</html>