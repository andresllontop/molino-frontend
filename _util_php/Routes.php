<?php
class Routes
{

    public function getResourceForContainerApp()
    {
        $routes = new Routes();
        //$routes = $routes->isURLValidate();
        $path_resource = "view/subprojects/app/";
        $path_scripts = "";
        $path_style = "";
        //VALIDAMOS SI ES UNA URL CORRECTA
        if ($routes->isURLValidate()) {
            $version_proyect = "0.01";
            /*
            $version_proyect = 1.0; -> antes del 27/07/2019
             */
            /*CAMBIAR EL CONTEXTO DE ACUERDO AL PROYECTO. DEJAR EN <</>> CUANDO ESTA EN PRODUCCIÓN */
            $context = 'molino-frontend./';
            //EXTRAEMOS EL CONTEXTO + EL PATH
            $context_path = $_SERVER['REQUEST_URI'];

            //EXTRAEMOS SOLO EL PATH DEL (CONTEXTO + PATH)
            $path = substr($context_path, strlen($context));
            //HACEMOS UN SPLIT PARA DEJAR EL PATH SIN PARAMETROS
            $values_path = explode("?", $path);
            //TOMAMOS LA PRIMERA PARTICIÓN
            $path = $values_path[0];
            //VERIFICAMOS SI EL ULTIMO CARACTER ES /
            if (substr($path, strlen($path) - 1, strlen($path)) == "/") {
                //EXTRAEMOS EL PATH SIN EL CARACTER PARA QUE VALIDE BIEN NUESTRA ITERACIÓN DE ABAJO
                $path = substr($path, 0, strlen($path) - 1);
            }
            /*
            AQUÍ ES DONDE VAMOS A CONFIGURAR NUESTRAS PAGINAS
            //EXAMPLE -> new BeanResource(path,path_resource);
            //array_push($list_pages, $resource);
             */
            $list_pages = array();

            /* MODULO DE MANAGER */
            //INDEX
            $resource = new BeanResource('app/molino/index', array($path_resource . 'molino/index/index.html'), array(), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);

            //PERFIL
            $resource = new BeanResource('app/molino/perfil', array($path_resource . 'molino/perfil/perfil.html'), array($path_resource . 'molino/perfil/perfil.js?v=' . $version_proyect, 'scripts/util/functions_file.js'), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);

            /* MODULO DE SERVICIOS */

            //PRESTAMO
            $resource = new BeanResource('app/molino/servicios/prestamos', array($path_resource . 'molino/servicios/prestamo/prestamo.html', $path_resource . 'molino/servicios/prestamo/prestamo_add.html', $path_resource . 'molino/mantenimientos/cliente/cliente_c.html'), array($path_resource . 'molino/servicios/prestamo/class.js?v=' . $version_proyect, $path_resource . 'molino/servicios/prestamo/prestamo.js?v=' . $version_proyect, $path_resource . 'molino/servicios/prestamo/prestamo_add.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/cliente/cliente_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/seguro/seguro_filter.js?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', 'plugins/moment/locale/es.js'), array('css/style_molino.css?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css'));
            array_push($list_pages, $resource);

            //INVENTARIO
            $resource = new BeanResource('app/molino/servicios/inventarios', array($path_resource . 'molino/servicios/inventario/ubicacion.html', $path_resource . 'molino/servicios/inventario/inventario.html', $path_resource . 'molino/mantenimientos/almacen/almacen_c.html', $path_resource . 'molino/servicios/producto/producto_c.html', $path_resource . 'molino/mantenimientos/cliente/cliente_c.html'), array($path_resource . 'molino/mantenimientos/almacen/almacen_c.js?v=' . $version_proyect, $path_resource . 'molino/servicios/producto/producto_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/cliente/cliente_c.js?v=' . $version_proyect, $path_resource . 'molino/servicios/inventario/ubicacion.js?v=' . $version_proyect, $path_resource . 'molino/servicios/inventario/inventario.js?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', 'plugins/moment/locale/es.js'), array('css/style_molino.css?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css'));
            array_push($list_pages, $resource);

            //KARDEX VALORIZADO
            $resource = new BeanResource('app/molino/servicios/kardexvalorizado', array($path_resource . 'molino/servicios/inventario/ubicacion.html', $path_resource . 'molino/servicios/kardexvalorizado/inventario.html', $path_resource . 'molino/mantenimientos/almacen/almacen_c.html', $path_resource . 'molino/servicios/producto/producto_c.html', $path_resource . 'molino/mantenimientos/cliente/cliente_c.html'), array($path_resource . 'molino/mantenimientos/almacen/almacen_c.js?v=' . $version_proyect, $path_resource . 'molino/servicios/producto/producto_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/cliente/cliente_c.js?v=' . $version_proyect, $path_resource . 'molino/servicios/kardexvalorizado/ubicacion.js?v=' . $version_proyect, $path_resource . 'molino/servicios/kardexvalorizado/inventario.js?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', 'plugins/moment/locale/es.js', 'plugins/moment/locale/es.js'), array('css/style_molino.css?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css'));
            array_push($list_pages, $resource);

            //LIQUIDACION
            $resource = new BeanResource('app/molino/servicios/liquidacion', array($path_resource . 'molino/servicios/liquidacion/venta.html', $path_resource . 'molino/servicios/liquidacion/venta_add.html', $path_resource . 'molino/servicios/salida/salida_c.html', $path_resource . 'molino/mantenimientos/cliente/cliente_c.html', $path_resource . 'molino/mantenimientos/documento/documento_c.html'), array($path_resource . 'molino/servicios/liquidacion/class.js?v=' . $version_proyect, $path_resource . 'molino/servicios/salida/class.js?v=' . $version_proyect, $path_resource . 'molino/servicios/liquidacion/pago_venta.js?v=' . $version_proyect, $path_resource . 'molino/servicios/liquidacion/venta.js?v=' . $version_proyect, $path_resource . 'molino/servicios/liquidacion/venta_add.js?v=' . $version_proyect, $path_resource . 'molino/servicios/salida/salida_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/cliente/cliente_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/documento/documento_c.js?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', 'plugins/moment/locale/es.js'), array('css/style_molino.css?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css'));
            array_push($list_pages, $resource);

            //ENTRADA
            $resource = new BeanResource('app/molino/servicios/entradas', array($path_resource . 'molino/servicios/entrada/entrada_add.html', $path_resource . 'molino/servicios/entrada/entrada.html', $path_resource . 'molino/mantenimientos/cliente/cliente_c.html', $path_resource . 'molino/mantenimientos/documento/documento_c.html'), array($path_resource . 'molino/servicios/entrada/class.js?v=' . $version_proyect, $path_resource . 'molino/servicios/entrada/entrada_add.js?v=' . $version_proyect, $path_resource . 'molino/servicios/entrada/entrada.js?v=' . $version_proyect, $path_resource . 'molino/servicios/entrada/entrada_detalle.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/presentacion/presentacion_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/documento/documento_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/cliente/cliente_c.js?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', 'plugins/moment/locale/es.js'), array('css/style_molino.css?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css'));
            array_push($list_pages, $resource);

            //SALIDA
            $resource = new BeanResource('app/molino/servicios/salidas', array($path_resource . 'molino/servicios/salida/salida.html', $path_resource . 'molino/servicios/salida/salida_add.html', $path_resource . 'molino/mantenimientos/cliente/cliente_c.html', $path_resource . 'molino/mantenimientos/documento/documento_c.html'), array($path_resource . 'molino/servicios/salida/class.js?v=' . $version_proyect, $path_resource . 'molino/servicios/salida/salida.js?v=' . $version_proyect, $path_resource . 'molino/servicios/salida/salida_detalle.js?v=' . $version_proyect, $path_resource . 'molino/servicios/salida/salida_add.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/presentacion/presentacion_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/cliente/cliente_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/documento/documento_c.js?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', 'plugins/moment/locale/es.js'), array('css/style_molino.css?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css'));
            array_push($list_pages, $resource);

            //VENTA
            $resource = new BeanResource('app/molino/servicios/ventas', array($path_resource . 'molino/servicios/venta/salida.html', $path_resource . 'molino/servicios/venta/salida_add.html', $path_resource . 'molino/mantenimientos/cliente/cliente_c.html', $path_resource . 'molino/mantenimientos/documento/documento_c.html'), array($path_resource . 'molino/servicios/venta/class.js?v=' . $version_proyect, $path_resource . 'molino/servicios/salida/salida_detalle.js?v=' . $version_proyect, $path_resource . 'molino/servicios/venta/pago_venta.js?v=' . $version_proyect, $path_resource . 'molino/servicios/venta/salida.js?v=' . $version_proyect, $path_resource . 'molino/servicios/venta/salida_add.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/presentacion/presentacion_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/documento/documento_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/cliente/cliente_c.js?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', 'plugins/moment/locale/es.js'), array('css/style_molino.css?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css'));
            array_push($list_pages, $resource);

            //VENTA
            $resource = new BeanResource('app/molino/servicios/compras', array($path_resource . 'molino/servicios/compra/compra.html', $path_resource . 'molino/servicios/compra/compra_add.html', $path_resource . 'molino/mantenimientos/cliente/cliente_c.html', $path_resource . 'molino/mantenimientos/documento/documento_c.html'), array($path_resource . 'molino/servicios/compra/class.js?v=' . $version_proyect, $path_resource . 'molino/servicios/compra/pago_compra.js?v=' . $version_proyect, $path_resource . 'molino/servicios/compra/compra.js?v=' . $version_proyect, $path_resource . 'molino/servicios/compra/compra_add.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/presentacion/presentacion_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/documento/documento_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/cliente/cliente_c.js?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', 'plugins/moment/locale/es.js'), array('css/style_molino.css?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css'));
            array_push($list_pages, $resource);

            //PRODUCTOS
            $resource = new BeanResource('app/molino/servicios/productos', array($path_resource . 'molino/servicios/producto/producto_add.html', $path_resource . 'molino/servicios/producto/producto.html', $path_resource . 'molino/mantenimientos/unidadMedida/unidadMedida_add.html', $path_resource . 'molino/mantenimientos/unidadMedida/unidadMedida_c.html'), array($path_resource . 'molino/servicios/producto/producto.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/unidadMedida/unidadMedida_c.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);

            //GASTOS
            $resource = new BeanResource('app/molino/servicios/gastos', array($path_resource . 'molino/servicios/gasto/gasto_add.html', $path_resource . 'molino/servicios/gasto/gasto.html', $path_resource . 'molino/mantenimientos/categoria/categoria_add.html', $path_resource . 'molino/mantenimientos/categoria/categoria_c.html'), array($path_resource . 'molino/servicios/gasto/gasto.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/categoria/categoria_c.js?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', 'plugins/moment/locale/es.js'), array('css/style_molino.css?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css'));
            array_push($list_pages, $resource);

            //ITEMS
            $resource = new BeanResource('app/molino/mantenimientos/items', array($path_resource . 'molino/mantenimientos/item/item_add.html', $path_resource . 'molino/mantenimientos/item/item.html', $path_resource . 'molino/mantenimientos/unidadMedida/unidadMedida_add.html', $path_resource . 'molino/mantenimientos/unidadMedida/unidadMedida_c.html'), array($path_resource . 'molino/mantenimientos/item/item.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/unidadMedida/unidadMedida_c.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);

            /* MODULO DE MANTENIMIENTOS */
            //EXISTENCIAS
            $resource = new BeanResource('app/molino/mantenimientos/existencias', array($path_resource . 'molino/mantenimientos/cliente/cliente_c.html', $path_resource . 'molino/mantenimientos/ubicacionproducto/existencia.html', $path_resource . 'molino/mantenimientos/ubicacionproducto/cliente_producto.html', $path_resource . 'molino/mantenimientos/almacen/almacen_c.html', $path_resource . 'molino/servicios/producto/producto_c.html'), array($path_resource . 'molino/mantenimientos/cliente/cliente_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/ubicacionproducto/cliente_producto.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/almacen/almacen_c.js?v=' . $version_proyect, $path_resource . 'molino/servicios/producto/producto_c.js?v=' . $version_proyect, $path_resource . 'molino/servicios/entrada/class.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);
            //PERSONAL
            $resource = new BeanResource('app/molino/mantenimientos/personal', array($path_resource . 'molino/mantenimientos/personal/personal_add.html', $path_resource . 'molino/mantenimientos/personal/personal.html', $path_resource . 'molino/mantenimientos/area/area_c.html', $path_resource . 'molino/mantenimientos/cargo/cargo_c.html'), array($path_resource . 'molino/mantenimientos/personal/personal.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/area/area_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/cargo/cargo_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/personal/usuario.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);
            //CLIENTE
            $resource = new BeanResource('app/molino/mantenimientos/clientes', array($path_resource . 'molino/mantenimientos/cliente/cliente_add.html', $path_resource . 'molino/mantenimientos/cliente/cliente.html'), array($path_resource . 'molino/mantenimientos/cliente/cliente.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);
            //PROVEEDOR
            $resource = new BeanResource('app/molino/mantenimientos/proveedores', array($path_resource . 'molino/mantenimientos/proveedor/cliente_add.html', $path_resource . 'molino/mantenimientos/proveedor/cliente.html'), array($path_resource . 'molino/mantenimientos/proveedor/cliente.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);
            //CARGO
            $resource = new BeanResource('app/molino/mantenimientos/cargos', array($path_resource . 'molino/mantenimientos/cargo/cargo_add.html', $path_resource . 'molino/mantenimientos/cargo/cargo.html'), array($path_resource . 'molino/mantenimientos/cargo/cargo.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);
            //DOCUMENTO
            $resource = new BeanResource('app/molino/mantenimientos/documentos', array($path_resource . 'molino/mantenimientos/documento/documento_add.html', $path_resource . 'molino/mantenimientos/documento/documento.html', $path_resource . 'molino/mantenimientos/comprobante/comprobante_c.html'), array($path_resource . 'molino/mantenimientos/comprobante/comprobante_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/documento/documento.js?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', 'plugins/moment/locale/es.js'), array('css/style_molino.css?v=' . $version_proyect, 'plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css'));
            array_push($list_pages, $resource);
            //COMPROBANTE
            $resource = new BeanResource('app/molino/mantenimientos/comprobantes', array($path_resource . 'molino/mantenimientos/comprobante/comprobante_add.html', $path_resource . 'molino/mantenimientos/comprobante/comprobante.html'), array($path_resource . 'molino/mantenimientos/comprobante/comprobante.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);
            //OFICINA
            $resource = new BeanResource('app/molino/mantenimientos/oficinas', array($path_resource . 'molino/mantenimientos/oficina/oficina_add.html', $path_resource . 'molino/mantenimientos/oficina/oficina.html', $path_resource . 'molino/mantenimientos/area/area_add.html', $path_resource . 'molino/mantenimientos/area/area.html'), array($path_resource . 'molino/mantenimientos/oficina/oficina.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/area/area.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);

            //UNIDAD DE MEDIDA
            $resource = new BeanResource('app/molino/mantenimientos/unidadmedidas', array($path_resource . 'molino/mantenimientos/unidadMedida/unidadMedida_add.html', $path_resource . 'molino/mantenimientos/unidadMedida/unidadMedida.html'), array($path_resource . 'molino/mantenimientos/unidadMedida/unidadMedida.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);
            //CATEGORIAS
            $resource = new BeanResource('app/molino/mantenimientos/categorias', array($path_resource . 'molino/mantenimientos/categoria/categoria_add.html', $path_resource . 'molino/mantenimientos/categoria/categoria.html'), array($path_resource . 'molino/mantenimientos/categoria/categoria.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);
            //SEGURO
            $resource = new BeanResource('app/molino/mantenimientos/seguros', array($path_resource . 'molino/mantenimientos/seguro/seguro_add.html', $path_resource . 'molino/mantenimientos/seguro/seguro.html'), array($path_resource . 'molino/mantenimientos/seguro/seguro.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);

            //ESTABLECIMIENTO
            $resource = new BeanResource('app/molino/mantenimientos/establecimientos', array($path_resource . 'molino/mantenimientos/establecimiento/establecimiento_add.html', $path_resource . 'molino/mantenimientos/establecimiento/establecimiento.html', $path_resource . 'molino/mantenimientos/almacen/almacen_add.html', $path_resource . 'molino/mantenimientos/almacen/almacen.html'), array($path_resource . 'molino/mantenimientos/establecimiento/establecimiento.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/almacen/almacen.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);

            //ALMACEN
            $resource = new BeanResource('app/molino/mantenimientos/almacenes', array($path_resource . 'molino/mantenimientos/almacen/almacen_add.html', $path_resource . 'molino/mantenimientos/almacen/almacen.html',
                $path_resource . 'molino/mantenimientos/establecimiento/establecimiento_c.html', $path_resource . 'molino/mantenimientos/establecimiento/establecimiento_add.html'), array($path_resource . 'molino/mantenimientos/establecimiento/establecimiento_c.js?v=' . $version_proyect, $path_resource . 'molino/mantenimientos/almacen/almacen_add.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);
            //Personal
            $resource = new BeanResource('app/molino/mantenimientos/personal', array($path_resource . 'molino/mantenimientos/personal/personal_add.html', $path_resource . 'molino/mantenimientos/personal/personal.html'), array($path_resource . 'molino/mantenimientos/personal/personal.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);
            //SEGURO
            $resource = new BeanResource('app/molino/mantenimientos/seguros', array($path_resource . 'molino/mantenimientos/seguro/seguro_add.html', $path_resource . 'molino/mantenimientos/seguro/seguro.html'), array($path_resource . 'molino/mantenimientos/seguro/seguro.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);
            /* COFIGURACIONES */
            //EMPRESA
            $resource = new BeanResource('app/molino/configuraciones/empresa', array($path_resource . 'molino/configuraciones/empresa/empresa.html'), array($path_resource . 'molino/configuraciones/empresa/empresa.js?v=' . $version_proyect, 'scripts/util/functions_file.js'), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);

            $exists = false;
            foreach ($list_pages as $_resource) {
                if ($path == $_resource->path) {
                    $exists = true;
                    $path_resource = $_resource->path_resource;
                    $path_scripts = $_resource->path_scripts;
                    $path_style = $_resource->path_styles;
                    break;
                }

            }
            if (!$exists) {
                $path_resource = ['zinclude_error/app_404.html'];
            }

        } else {
            /*URL NO VALIDO */
            $path_resource = ['zinclude_error/app_404.html'];
        }
        $resources = new BeanResource($path, $path_resource, $path_scripts, $path_style);
        return $resources;
    }

    public function isURLValidate()
    {
        $url_actual = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        if (filter_var($url_actual, FILTER_VALIDATE_URL)) {
            return true;
        } else {
            return false;
        }
    }
    public function subProject()
    {
        $routes = new Routes();
        if (strpos($routes->getResourceForContainerApp()->path, 'auth') !== false) {
            include 'auth.php';
        } else {
            include 'app.php';
        }

    }

    public function getResourceForContainerAuth()
    {
        $routes = new Routes();
        //$routes = $routes->isURLValidate();
        $path_resource = "view/subprojects/";
        $path_scripts = "";
        $path_style = "";
        //VALIDAMOS SI ES UNA URL CORRECTA
        if ($routes->isURLValidate()) {
            $version_proyect = "1.1";
            /*
            $version_proyect = 1.0; -> antes del 27/07/2019
             */
            /*CAMBIAR EL CONTEXTO DE ACUERDO AL PROYECTO. DEJAR EN <</>> CUANDO ESTA EN PRODUCCIÓN */
            $context = 'molino-frontend./';
            //EXTRAEMOS EL CONTEXTO + EL PATH
            $context_path = $_SERVER['REQUEST_URI'];
            //EXTRAEMOS SOLO EL PATH DEL (CONTEXTO + PATH)
            $path = substr($context_path, strlen($context));
            //HACEMOS UN SPLIT PARA DEJAR EL PATH SIN PARAMETROS
            $values_path = explode("?", $path);
            //TOMAMOS LA PRIMERA PARTICIÓN
            $path = $values_path[0];
            //VERIFICAMOS SI EL ULTIMO CARACTER ES /
            if (substr($path, strlen($path) - 1, strlen($path)) == "/") {
                //EXTRAEMOS EL PATH SIN EL CARACTER PARA QUE VALIDE BIEN NUESTRA ITERACIÓN DE ABAJO
                $path = substr($path, 0, strlen($path) - 1);
            }
            /*
            AQUÍ ES DONDE VAMOS A CONFIGURAR NUESTRAS PAGINAS
            //EXAMPLE -> new BeanResource(path,path_resource);
            //array_push($list_pages, $resource);
             */
            $list_pages = array();

            /* AUTH */
            //login
            $resource = new BeanResource('auth/login', array($path_resource . 'auth/login/login.html'), array($path_resource . 'auth/login/login.js?v=' . $version_proyect), array('css/style_molino.css?v=' . $version_proyect));
            array_push($list_pages, $resource);

            $exists = false;
            foreach ($list_pages as $_resource) {
                if ($path == $_resource->path) {
                    $exists = true;
                    $path_resource = $_resource->path_resource;
                    $path_scripts = $_resource->path_scripts;
                    $path_style = $_resource->path_styles;
                    break;
                }
            }
            if (!$exists) {
                $path_resource = ['zinclude_error/app_404.html'];
            }
        } else {
            /*URL NO VALIDO */
            $path_resource = ['zinclude_error/app_404.html'];
        }
        $resources = new BeanResource($path, $path_resource, $path_scripts, $path_style);
        return $resources;
    }
}
