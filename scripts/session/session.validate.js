//console.log("Validando sessión...");
//console.image("http://blogs.larioja.com/ganas-de-vivir/wp-content/uploads/sites/48/2018/03/stop.png");
//console.meme("Seguro me quieres hackear!", "Y solo porque sabes programar.", "Not Sure Fry", 400, 300);
let user_session;
let contextPah = getContextAPP();
document.addEventListener("DOMContentLoaded", function () {

    if (Cookies.get("molino_token") === undefined) {
        location.href = contextPah + "auth/login";
    } else if (parseJwt(Cookies.get("molino_token"))) {
        //CARGAMOS LOS DATOS DEL USUARIO
        user_session = Cookies.getJSON('molino_user');
        let user = user_session;
        //SET DATOS USER
        document.querySelectorAll('.name-user-session').forEach(element => {
            element.innerHTML = getStringCapitalize(user.usuario.split(" ")[0].toLowerCase());

        });
        document.querySelectorAll('.name-type-user-session').forEach(element => {
            element.innerHTML = getStringTipoUsuario(user.tipo_usuario);
        });
        let url_foto;
        user.foto = "";
        if (user.foto != "") {
            url_foto = getHostAPI() + "resources/img/FOTOS/" + user.foto;
        } else {
            url_foto = getHostAPI() + "resources/img/150x150.png";
        }
        setUrlFotoUserSession(url_foto);
        //ADD ITEMS MENU AL SIDEBAR
        addMenus(user);
    } else {
        closeSession();
    }

});


function getStringTipoUsuario(tipo_usuario) {
    let st = "";
    switch (tipo_usuario) {
        case 1:
            st = "Usuario Molino";
            break;
        default:
            st = "User";
            break;
    }
    //st = getStringCapitalize(st.toLowerCase());
    return st;
}

function addMenus() {
    //console.log(usuario.tipo_usuario);
    switch (user_session.tipo_usuario) {
        case 1:
            //MOLINO
            createHTML_MOLINO(user_session.tipo_perfil);

            break;
        case 2:
        /*Verificamos si esta activado la cuenta
        if (user_session.estado == 4) {
            createHTML_ATE_ACTIVATION_ACCOUNT();
        } else {
            createHTML_ATE(user_session.tipo_perfil);
        }
        break;
*/
        default:
            break;

    }
}

function createHTML_MOLINO(typeProfile) {

    //INICIO PARA TODOS
    //document.querySelector("#a-mis-datos").style.display = "none";
    document.querySelector("#menus_molino").innerHTML =
        `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Home</span>
        </li>
        <!-- /menu header -->

        <!-- Menu Item -->
        <li class="dt-side-nav__item">
            <a href="${contextPah}app/ogbu/index" class="dt-side-nav__link a-index-no" title="Inicio">
                <i class="icon icon-home icon-fw icon-lg"></i>
                <span class="dt-side-nav__text">Inicio</span>
            </a>
        </li>
        <!-- /menu item -->
    `;

    document.querySelector("#menus_molino").innerHTML +=
        `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Servicios</span>
        </li>
        <!-- /menu header -->
    `;
    //SERVICIOS
    if (typeProfile == 0 || typeProfile == 1 || typeProfile == 2) {
        document.querySelector("#menus_molino").innerHTML +=
            `<!-- Menu Item -->
            
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="javascript:void(0)" class="dt-side-nav__link dt-side-nav__arrow" title="ventas">
                    <i class="icon icon-components icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Ventas</span>
                </a>
                <!-- Sub-menu -->
                <ul class="dt-side-nav__sub-menu">
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/molino/servicios/liquidacion" class="dt-side-nav__link pl-9" title="Liquidaciòn">
                         <i class="icon icon-arrow-right icon-fw icon-lg"></i>
                         <span class="dt-side-nav__text">Liquidaciòn</span>
                        </a>
                    </li>
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/molino/servicios/ventas" class="dt-side-nav__link pl-9" title="Nueva Entrada">
                            <i class="icon icon-arrow-right icon-fw icon-lg"></i>
                            <span class="dt-side-nav__text">Lista Ventas</span>
                        </a>
                    </li>
                    <li class="dt-side-nav__item">
                        <a href="javascript:void(0)" class="dt-side-nav__link dt-side-nav__arrow pl-9" title="catalogos">
                            <i class="icon icon-navs-and-tabs icon-fw icon-lg"></i>
                            <span class="dt-side-nav__text">Catálogos</span>
                        </a>
                        <ul class="dt-side-nav__sub-menu">
                            <li class="dt-side-nav__item">
                                <a href="${contextPah}app/molino/servicios/productos" class="dt-side-nav__link" title="Productos">
                                 <i class="icon icon-badges icon-fw icon-lg"></i>
                                <span class="dt-side-nav__text">Productos</span>
                                </a>
                            </li>
                            <li class="dt-side-nav__item">
                                <a href="${contextPah}app/molino/mantenimientos/clientes" class="dt-side-nav__link" title="Clientes">
                                 <i class="icon icon-customers icon-fw icon-lg"></i>
                                    <span class="dt-side-nav__text">Clientes</span>
                                 </a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <!-- /sub-menu -->
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="javascript:void(0)" class="dt-side-nav__link dt-side-nav__arrow" title="compras">
                    <i class="icon icon-components icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Compras</span>
                </a>
                <!-- Sub-menu -->
                <ul class="dt-side-nav__sub-menu">
                   
                    <li class="dt-side-nav__item d-none">
                        <a href="${contextPah}app/molino/servicios/compras" class="dt-side-nav__link pl-9" title="Nueva Compra">
                            <i class="icon icon-arrow-left icon-fw icon-lg"></i>
                            <span class="dt-side-nav__text">Listado de Compra</span>
                        </a>
                    </li>
                    <li class="dt-side-nav__item">
                         <a href="javascript:void(0)" class="dt-side-nav__link dt-side-nav__arrow pl-9" title="Gastos">
                            <i class="icon icon-components icon-fw icon-lg"></i>
                            <span class="dt-side-nav__text">Gastos</span>
                        </a>
                        <!-- Sub-menu -->
                        <!-- Sub-menu -->
                        <ul class="dt-side-nav__sub-menu">
                            <li class="dt-side-nav__item ">
                            <a href="${contextPah}app/molino/servicios/gastos" class="dt-side-nav__link" title="Gastos diversos">
                                <i class="icon icon-shopping-cart icon-fw icon-lg"></i>
                                <span class="dt-side-nav__text">Gastos diversos</span>
                            </a>
                            </li>
                            <li class="dt-side-nav__item">
                            <a href="${contextPah}app/molino/mantenimientos/categorias" class="dt-side-nav__link" title="Categoria">
                                <i class="icon icon-shopping-cart icon-fw icon-lg"></i>
                                <span class="dt-side-nav__text">Categoria</span>
                            </a>
                            </li>
                        </ul>
                            
                    </li>
                    <li class="dt-side-nav__item">
                            <a href="${contextPah}app/molino/mantenimientos/proveedores" class="dt-side-nav__link pl-9" title="proveedores">
                                <i class="icon icon-shopping-cart icon-fw icon-lg"></i>
                                <span class="dt-side-nav__text">Proveedores</span>
                            </a>
                    </li>
                    <li class="dt-side-nav__item">
                        <a href="javascript:void(0)" class="dt-side-nav__link dt-side-nav__arrow pl-9" title="compras">
                            <i class="icon icon-components icon-fw icon-lg"></i>
                            <span class="dt-side-nav__text">Activos Fijos</span>
                        </a>
                        <!-- Sub-menu -->
                        <ul class="dt-side-nav__sub-menu">
                            <li class="dt-side-nav__item">
                                <a href="${contextPah}app/molino/mantenimientos/items" class="dt-side-nav__link" title="Nueva Compra">
                                    <i class="icon icon-arrow-left icon-fw icon-lg"></i>
                                    <span class="dt-side-nav__text">Items</span>
                                </a>
                            </li>
                            <li class="dt-side-nav__item">
                                <a href="${contextPah}app/molino/servicios/compras" class="dt-side-nav__link" title="Nueva Compra">
                                    <i class="icon icon-arrow-left icon-fw icon-lg"></i>
                                    <span class="dt-side-nav__text">Compras</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                   
                </ul>
                <!-- /sub-menu -->
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                 <a href="javascript:void(0)" class="dt-side-nav__link dt-side-nav__arrow" title="compras">
                    <i class="icon icon-components icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Inventario</span>
                </a>
                <!-- Sub-menu -->
                <ul class="dt-side-nav__sub-menu">
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/molino/servicios/entradas" class="dt-side-nav__link pl-9" title="Nueva Entrada">
                            <i class="icon icon-circle-add-o icon-fw icon-lg"></i>
                           <span class="dt-side-nav__text">Entradas</span>
                         </a>
                    </li>
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/molino/servicios/salidas" class="dt-side-nav__link pl-9" title="Nueva Salida">
                            <i class="icon icon-circle-minus-o icon-fw icon-lg"></i>
                           <span class="dt-side-nav__text">Salidas</span>
                         </a>
                    </li>
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/molino/mantenimientos/existencias" class="dt-side-nav__link pl-9" title="Inventario">
                        <i class="icon icon-invoice icon-fw icon-lg"></i>
                        <span class="dt-side-nav__text">Stock Inventario</span>
                        </a>
                    </li>
                        <!-- Menu Item -->
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/molino/mantenimientos/almacenes" class="dt-side-nav__link pl-9" title="Almacen">
                        <i class="icon icon-company icon-fw icon-lg"></i>
                        <span class="dt-side-nav__text">Almacen</span>
                        </a>
                    </li>
                    <!-- Menu Item -->
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/molino/servicios/inventarios" class="dt-side-nav__link pl-9" title="Inventario">
                        <i class="icon icon-invoice icon-fw icon-lg"></i>
                        <span class="dt-side-nav__text">Reporte Kardex</span>
                        </a>
                    </li>
                    
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/molino/servicios/kardexvalorizado" class="dt-side-nav__link pl-9" title="kardexvalorizado">
                        <i class="icon icon-invoice icon-fw icon-lg"></i>
                        <span class="dt-side-nav__text">Reporte Kardex Valorizado</span>
                        </a>
                    </li>
               
                </ul>
            </li>
            <!-- Menu Item -->
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/servicios/prestamos" class="dt-side-nav__link" title="Prestamos">
                    <i class="icon icon-revenue-new icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Prestamos</span>
                </a>
            </li>
            
        `;
    }

    //MANTENIMIENTOS ADMI
    if (typeProfile == 0 || typeProfile == 1) {
        document.querySelector("#menus_molino").innerHTML +=
            `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Mantenimentos</span>
        </li>
        <!-- /menu header -->
    `;
        document.querySelector("#menus_molino").innerHTML +=
            `
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/cargos" class="dt-side-nav__link" title="Cargos">
                    <i class="icon icon-profilepage icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Cargos</span>
                </a>
            </li>
           
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/oficinas" class="dt-side-nav__link" title="Oficinas">
                    <i class="icon icon-crm icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Oficinas</span>
                </a>
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/unidadmedidas" class="dt-side-nav__link" title="Unidades de Medida">
                    <i class="icon icon-icons icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Unidades de Medida</span>
                </a>
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/personal" class="dt-side-nav__link" title="Personal">
                    <i class="icon icon-customer icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Personal</span>
                </a>
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/comprobantes" class="dt-side-nav__link" title="Comprobantes">
                    <i class="icon icon-icons icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Comprobantes</span>
                </a>
            </li>
            <!-- Menu Item -->
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/documentos" class="dt-side-nav__link" title="Documentos">
                    <i class="icon icon-icons icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Documentos</span>
                </a>
            </li>
            <!-- Menu Item -->
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/seguros" class="dt-side-nav__link" title="Seguros">
                    <i class="icon icon-financerate icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Seguros</span>
                </a>
            </li>
            <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Configuracion</span>
        </li>
        <!-- /menu header -->
        <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/configuraciones/empresa" class="dt-side-nav__link" title="Seguros">
                    <i class="icon icon-company icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Empresa</span>
                </a>
            </li>
            <!-- Menu Header -->
        `;
    }

    //MANTENIMIENTOS SECRETARIO
    if (typeProfile == 2) {
        document.querySelector("#menus_molino").innerHTML +=
            `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Mantenimentos</span>
        </li>
        <!-- /menu header -->
    `;
        document.querySelector("#menus_molino").innerHTML +=
            `
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/clientes" class="dt-side-nav__link" title="Clientes">
                    <i class="icon icon-customers icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Clientes</span>
                </a>
            </li>
        `;
    }


}

function createHTML_MOLINO2(typeProfile) {

    //INICIO PARA TODOS
    //document.querySelector("#a-mis-datos").style.display = "none";
    document.querySelector("#menus_molino").innerHTML =
        `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Home</span>
        </li>
        <!-- /menu header -->

        <!-- Menu Item -->
        <li class="dt-side-nav__item">
            <a href="${contextPah}app/ogbu/index" class="dt-side-nav__link a-index-no" title="Inicio">
                <i class="icon icon-home icon-fw icon-lg"></i>
                <span class="dt-side-nav__text">Inicio</span>
            </a>
        </li>
        <!-- /menu item -->
    `;

    document.querySelector("#menus_molino").innerHTML +=
        `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Servicios</span>
        </li>
        <!-- /menu header -->
    `;
    //SERVICIOS
    if (typeProfile == 0 || typeProfile == 1 || typeProfile == 2) {
        document.querySelector("#menus_molino").innerHTML +=
            `<!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/servicios/productos" class="dt-side-nav__link" title="Productos">
                    <i class="icon icon-badges icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Productos</span>
                </a>
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="javascript:void(0)" class="dt-side-nav__link dt-side-nav__arrow" title="entradas">
                    <i class="icon icon-components icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Entradas</span>
                </a>
                <!-- Sub-menu -->
                <ul class="dt-side-nav__sub-menu">
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/molino/servicios/entradas" class="dt-side-nav__link" title="Nueva Entrada">
                            <i class="icon icon-arrow-right icon-fw icon-lg"></i>
                            <span class="dt-side-nav__text">Nueva Entrada</span>
                        </a>
                    </li>
                    <li class="dt-side-nav__item d-none">
                            <a href="${contextPah}app/molino/servicios/compras" class="dt-side-nav__link" title="Nueva Compra">
                                <i class="icon icon-profilepage icon-fw icon-lg"></i>
                                <span class="dt-side-nav__text">Nueva Compra</span>
                            </a>
                    </li>
                   
                </ul>
                <!-- /sub-menu -->
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="javascript:void(0)" class="dt-side-nav__link dt-side-nav__arrow" title="salidas">
                    <i class="icon icon-components icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Salidas</span>
                </a>
                <!-- Sub-menu -->
                <ul class="dt-side-nav__sub-menu">
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/molino/servicios/salidas" class="dt-side-nav__link" title="Nueva Salida">
                            <i class="icon icon-arrow-left icon-fw icon-lg"></i>
                            <span class="dt-side-nav__text">Nueva Salida</span>
                        </a>
                    </li>
                    <li class="dt-side-nav__item">
                            <a href="${contextPah}app/molino/servicios/ventas" class="dt-side-nav__link" title="Nueva Venta">
                                <i class="icon icon-shopping-cart icon-fw icon-lg"></i>
                                <span class="dt-side-nav__text">Nueva Venta</span>
                            </a>
                    </li>
                   
                </ul>
                <!-- /sub-menu -->
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/servicios/inventarios" class="dt-side-nav__link" title="Inventario">
                    <i class="icon icon-invoice icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Inventario</span>
                </a>
            </li>
            <!-- Menu Item -->
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/servicios/prestamos" class="dt-side-nav__link" title="Prestamos">
                    <i class="icon icon-revenue-new icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Prestamos</span>
                </a>
            </li>
            
        `;
    }

    //MANTENIMIENTOS ADMI
    if (typeProfile == 0 || typeProfile == 1) {
        document.querySelector("#menus_molino").innerHTML +=
            `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Mantenimentos</span>
        </li>
        <!-- /menu header -->
    `;
        document.querySelector("#menus_molino").innerHTML +=
            `
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/cargos" class="dt-side-nav__link" title="Cargos">
                    <i class="icon icon-profilepage icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Cargos</span>
                </a>
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/establecimientos" class="dt-side-nav__link" title="Establecimientos">
                    <i class="icon icon-company icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Establecimientos</span>
                </a>
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/oficinas" class="dt-side-nav__link" title="Oficinas">
                    <i class="icon icon-crm icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Oficinas</span>
                </a>
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/unidadmedidas" class="dt-side-nav__link" title="Unidades de Medida">
                    <i class="icon icon-icons icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Unidades de Medida</span>
                </a>
            </li>
            <!-- Menu Item -->
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/documentos" class="dt-side-nav__link" title="Documentos">
                    <i class="icon icon-icons icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Documentos</span>
                </a>
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/clientes" class="dt-side-nav__link" title="Clientes">
                    <i class="icon icon-customers icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Clientes</span>
                </a>
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/personal" class="dt-side-nav__link" title="Personal">
                    <i class="icon icon-customer icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Personal</span>
                </a>
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/seguros" class="dt-side-nav__link" title="Seguros">
                    <i class="icon icon-financerate icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Seguros</span>
                </a>
            </li>
            <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Configuracion</span>
        </li>
        <!-- /menu header -->
        <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/configuraciones/empresa" class="dt-side-nav__link" title="Seguros">
                    <i class="icon icon-company icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Empresa</span>
                </a>
            </li>
            <!-- Menu Header -->
        `;
    }

    //MANTENIMIENTOS SECRETARIO
    if (typeProfile == 2) {
        document.querySelector("#menus_molino").innerHTML +=
            `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Mantenimentos</span>
        </li>
        <!-- /menu header -->
    `;
        document.querySelector("#menus_molino").innerHTML +=
            `
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/molino/mantenimientos/clientes" class="dt-side-nav__link" title="Clientes">
                    <i class="icon icon-customers icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Clientes</span>
                </a>
            </li>
        `;
    }


}




function createHTML_ATE_ACTIVATION_ACCOUNT() {
    document.querySelector("#menus_molino").innerHTML =
        `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Dashboard</span>
        </li>
        <!-- /menu header -->
        <!-- Menu Item -->
        <li class="dt-side-nav__item">
            <a href="${contextPah}app/ate/index" class="dt-side-nav__link a-index-no" title="Inicio">
                <i class="icon icon-home icon-fw icon-lg"></i>
                <span class="dt-side-nav__text">Inicio</span>
            </a>
        </li>
        <!-- /menu item -->
    `;
}


include_script(getHostFrontEnd() + "assets/js/script.js");