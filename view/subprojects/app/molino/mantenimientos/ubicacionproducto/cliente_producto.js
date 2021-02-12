var beanPaginationClienteProducto;
var presentacionSelected;
var tipoClienteSelected;
var clienteSelectedOtro;
var clienteSelected;
var tipoProductoSelected
var productoSelectedOtro;
var productoSelected;
var tipoAlmacenSelected;
var almacenSelected;
var almacenSelectedOtro;
var selected;
var beanRequestClienteProducto = new BeanRequest();
var beanRequestPresentacion = new BeanRequest();
var contador = 1;
document.addEventListener('DOMContentLoaded', function () {

    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestClienteProducto.entity_api = 'api/ubicacion/productos';
    beanRequestClienteProducto.operation = 'paginate';
    beanRequestClienteProducto.type_request = 'GET';

    $('#FrmClienteProductoModal').submit(function (event) {
        if (validateFormClienteProducto()) {
            processAjaxClienteProducto();

        }
        event.preventDefault();
        event.stopPropagation();
    });
    $('#FrmExistencia').submit(function (event) {
        beanRequestClienteProducto.operation = 'paginate';
        beanRequestClienteProducto.type_request = 'GET';
        processAjaxClienteProducto();
        event.preventDefault();
        event.stopPropagation();
    });

    $('#sizePageClienteProducto').change(function () {
        beanRequestClienteProducto.operation = 'paginate';
        beanRequestClienteProducto.type_request = 'GET';
        processAjaxClienteProducto();
    });
    processAjaxClienteProducto();
    document.querySelector("#btnSubmitExistencia").onclick = (e) => {
        beanRequestClienteProducto.operation = 'add';
        beanRequestClienteProducto.type_request = 'POST';
        addClass(document.querySelector("#btnSubmitExistencia"), "d-none");
        addClienteProducto();
    }
    document.querySelector("#btnAbrirNewExistencia").onclick = (e) => {
        beanRequestClienteProducto.operation = 'add';
        beanRequestClienteProducto.type_request = 'POST';
        $('#addClienteProductoHtml').modal('show');
    }

    //
    beanRequestPresentacion.entity_api = 'api/entradas';

    /*AJUSTE */
    $('#FrmAjustePresentacionModal').submit(function (event) {
        event.preventDefault();
        event.stopPropagation();
        beanRequestPresentacion.operation = 'inicial/add';
        beanRequestPresentacion.type_request = 'POST';

        processAjaxEntrada();


    });
    accionButtonAjuste();

    /*
    //accion al seleccionar afuera de la tabla tbodyProductoC
    window.addEventListener('click', (e) => {
        if (!document.getElementById('tbodyProductoC').contains(e.target))
            addClass(document.querySelector('#tbodyProductoC'), 'd-none');
    });
*/
    document.querySelector('#btnEliminarProducto').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtProducto').value = '';
        productoSelected = undefined;
    };
    document.querySelector('#btnEliminarAlmacen').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtAlmacenUbicacionProducto').value = '';
        almacenSelected = undefined;
    };
    document.querySelector('#btnEliminarCliente').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtClienteUbicacionProducto').value = '';
        clienteSelected = undefined;
    };




});

var newSelected = () => {
    /* VALIDAR PRODUCTO Y ALMACEN*/

    if (productoSelectedOtro == undefined) {
        return showAlertTopEnd('info', 'Por favor ingrese Producto');
    }
    if (almacenSelected == undefined) {
        return showAlertTopEnd('info', 'Por favor ingrese Almacén donde se registrará el producto');
    }
    /*if (findByCodigoClienteProducto(almacenSelected.idalmacen, productoSelectedOtro.idproducto) != undefined) {
        return showAlertTopEnd('info', 'Ya se encuentra el Producto registrado');
    }*/
    document.querySelector("#pNombreProducto").innerText = "( " + productoSelectedOtro.nombre + " )";

    document.querySelector('#txtPrecioServicioProducto-2').value = redondearDecimal(productoSelectedOtro.precio_servicio, 2);
    document.querySelector('#txtPrecioCompraProducto-2').value = redondearDecimal(productoSelectedOtro.precio_compra, 2);
    document.querySelector('#txtPrecioVentaProducto-2').value = redondearDecimal(productoSelectedOtro.precio_venta, 2);

    document.querySelector('#txtPrecioServicioProducto').value = redondearDecimal(productoSelectedOtro.precio_servicio * productoSelectedOtro.factor_conversion, 2);
    document.querySelector('#txtPrecioCompraProducto').value = redondearDecimal(productoSelectedOtro.precio_compra * productoSelectedOtro.factor_conversion, 2);
    document.querySelector('#txtPrecioVentaProducto').value = redondearDecimal(productoSelectedOtro.precio_venta * productoSelectedOtro.factor_conversion, 2);

    document.querySelectorAll(
        '.unidad-medida-2'
    ).forEach((data) => {
        data.textContent = productoSelectedOtro.unidad_salida.abreviatura;
    });

    document.querySelectorAll(
        '.unidad-medida-1'
    ).forEach((data) => {
        data.textContent = productoSelectedOtro.unidad_ingreso.abreviatura;
    });

    addEventsProductosChange();
    /* OPERACION AGREGAR
    listClienteProducto.push(new ClienteProducto(contador++,
        document.querySelector('#txtCodigoClienteProducto').value,
        almacenSelected,
        productoSelectedOtro, clienteSelectedOtro
    ));*/
    // presentacionSelected = undefined;
    beanRequestClienteProducto.operation = 'add';
    beanRequestClienteProducto.type_request = 'POST';
    //processAjaxClienteProducto();
};

function processAjaxClienteProducto() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestClienteProducto.operation == 'update' ||
        beanRequestClienteProducto.operation == 'add'
    ) {
        json = {
            codigo: document
                .querySelector('#txtCodigoClienteProducto')
                .value.toUpperCase(),
            almacen: almacenSelected,
            producto: productoSelectedOtro,
            cliente: clienteSelectedOtro,
            precio_compra: document.querySelector('#txtPrecioCompraProducto-2').value,
            precio_venta: document.querySelector('#txtPrecioVentaProducto-2').value,
            precio_servicio: document.querySelector('#txtPrecioServicioProducto-2').value
        };
        circleCargando.containerOcultar = $(document.querySelector("#addClienteProductoHtml").firstElementChild.firstElementChild);
        circleCargando.container = $(document.querySelector("#addClienteProductoHtml").firstElementChild);

    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyClienteProducto"));
        circleCargando.container = $(document.querySelector("#tbodyClienteProducto").parentElement);
    }
    circleCargando.createLoader();
    circleCargando.toggleLoader("show");
    switch (beanRequestClienteProducto.operation) {
        case 'add':

            break;
        case 'update':
            json.idubicacion_producto = presentacionSelected.ubicacion_producto.idubicacion_producto;
            break;
        case 'delete':
            parameters_pagination = '/' + presentacionSelected.ubicacion_producto.idubicacion_producto;
            break;
        case 'cliente/paginate':
            parameters_pagination +=
                '?idcliente=' + clienteSelectedOtro.idcliente;
            parameters_pagination +=
                '&page=' + document.querySelector('#pageClienteProducto').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageClienteProducto').value;


            break;
        default:
            if (document.querySelector('#txtFilterExistencia').value != '') {
                document.querySelector('#pageClienteProducto').value = 1;
            }
            parameters_pagination +=
                '?idcliente=' + (clienteSelected == undefined ? 0 : clienteSelected.idcliente);
            parameters_pagination +=
                '&idproducto=' + (productoSelected == undefined ? 0 : productoSelected.idproducto);
            parameters_pagination +=
                '&idalmacen=' + (almacenSelected == undefined ? 0 : almacenSelected.idalmacen);
            parameters_pagination +=
                '&nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterExistencia').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageClienteProducto').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageClienteProducto').value;


            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestClienteProducto,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {
        circleCargando.toggleLoader("hide");

        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                notifyUser('Acción realizada exitosamente');
                if (beanRequestClienteProducto.operation == "delete") {
                    eliminarClienteProducto(presentacionSelected.ubicacion_producto.idubicacion_producto);
                    toListClienteProducto(beanPaginationClienteProducto);
                }
                if (beanRequestClienteProducto.operation == "update") {
                    document.querySelector('#sizePageClienteProducto').dispatchEvent(new Event('change'));
                }
                addClienteProducto();
            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationClienteProducto = beanCrudResponse.beanPagination;
            toListClienteProducto(beanPaginationClienteProducto);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestClienteProducto.operation == 'add') {
                beanPaginationClienteProducto.list.unshift({ existencia: null, idpresentacion: 0, ubicacion_producto: beanCrudResponse.classGeneric });
                beanPaginationClienteProducto.count_filter++;
                toListClienteProducto(beanPaginationClienteProducto);
            }

        }
    }, false);
}

function addClienteProducto(ubicacionProducto = undefined) {
    document.querySelector("#txtCodigoClienteProducto").value = (ubicacionProducto == undefined) ? "" : ubicacionProducto.codigo;
    document.querySelector("#txtPrecioCompraProducto").value = (ubicacionProducto == undefined) ? "0" : ubicacionProducto.precio_compra;
    document.querySelector("#txtPrecioVentaProducto").value = (ubicacionProducto == undefined) ? "0" : ubicacionProducto.precio_venta;
    document.querySelector("#txtPrecioServicioProducto").value = (ubicacionProducto == undefined) ? "0" : ubicacionProducto.precio_servicio;
    almacenSelected = (ubicacionProducto == undefined) ? undefined : ubicacionProducto.almacen;
    document.querySelector("#txtAlmacenUbicacionProducto").value = (ubicacionProducto == undefined) ? "" : almacenSelected.nombre;
    productoSelectedOtro = (ubicacionProducto == undefined) ? undefined : ubicacionProducto.producto
    document.querySelector("#pNombreProducto").innerText = (ubicacionProducto == undefined) ? "" : "( " + ubicacionProducto.producto.nombre + " )";
    clienteSelectedOtro = (ubicacionProducto == undefined) ? undefined : ubicacionProducto.cliente;
    document.querySelector("#txtClienteUbicacionProducto").value = (ubicacionProducto == undefined) ? "" : clienteSelectedOtro.nombre + " " + clienteSelectedOtro.apellido;
}
/* DETALLE */
var addEventsClienteProducto = () => {
    /* eliminar compra*/
    document.querySelectorAll('.eliminar-ubicacion-producto').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            presentacionSelected = findByClienteProducto(
                btn.getAttribute(
                    'idubicacion_producto'
                )
            );
            if (presentacionSelected == undefined) {
                return showAlertTopEnd('warning', "no se encuentra el Producto");
            }
            beanRequestClienteProducto.operation = 'delete';
            beanRequestClienteProducto.type_request = 'DELETE';
            processAjaxClienteProducto();

        };
    });
    document.querySelectorAll('.editar-ubicacion-producto').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            presentacionSelected = findByClienteProducto(
                btn.getAttribute(
                    'idubicacion_producto'
                )
            );
            if (presentacionSelected == undefined) {
                return showAlertTopEnd('warning', "no se encuentra el Producto");
            }
            //removeClass(document.querySelector("#btnSubmitExistencia"), "d-none");
            $('#addClienteProductoHtml').modal('show');
            beanRequestClienteProducto.operation = 'update';
            beanRequestClienteProducto.type_request = 'PUT';
            addClienteProducto(presentacionSelected.ubicacion_producto);


        };
    });
    document.querySelectorAll('.ajustar-presentacion').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            presentacionSelected = findByClienteProducto(
                btn.getAttribute(
                    'idubicacion_producto'
                )
            );
            if (presentacionSelected == undefined) {
                return showAlertTopEnd('warning', "no se encuentra el Producto");
            }
            document.querySelector("#txtAjustePresentacion").labels[0].innerText = presentacionSelected.ubicacion_producto.producto.unidad_ingreso.abreviatura
            document.querySelector("#txtAjustePresentacion").value = (presentacionSelected.existencia == null) ? 0 : presentacionSelected.existencia;
            document.querySelector("#txtAjuste2Presentacion").labels[0].innerText = presentacionSelected.ubicacion_producto.producto.unidad_salida.abreviatura
            document.querySelector("#txtAjuste2Presentacion").value = (presentacionSelected.existencia_otro == null) ? 0 : presentacionSelected.existencia_otro;
            $('#modalOpenAjuste').modal('show');

        };
    });

};

var toListClienteProducto = (beanPagination) => {
    document.getElementById('tbodyClienteProducto').innerHTML = '';
    let row;
    if (beanPagination.list.length == 0) {
        destroyPagination($('#paginationClienteProducto'));
        row = `
        <!-- Widget Item -->
            <div class="dt-widget__item border-bottom pr-4">
            <!-- Widget Info -->
                <div class="dt-widget__info text-truncate ">
                    <div class="dt-card__title text-left">
                        <cite class="f-12" title="lISTA VACÍA">No hay Producto en el Almacén</cite>
                    </div>
                </div>
            </div>
            <!-- /widget info -->
        `;
        document.getElementById('tbodyClienteProducto').innerHTML += row;
        showAlertTopEnd('warning', 'No se encontraron resultados');
        return;
    }
    beanPagination.list.forEach((presentacion) => {
        row = `
			<!-- Widget Item -->
			<div class="dt-widget__item pt-1 pb-1 pr-4 border-bottom" >
            <!-- Widget Info -->
            <div class="dt-widget__info" style="min-width:130px">
                <div class="dt-widget__title text-left">
                <p  class="dt-widget__subtitle">${
            presentacion.ubicacion_producto.cliente.nombre
            }</p>
                </div>
               
            </div>
    <!-- /widget info -->
				<!-- Widget Info -->
				<div class="dt-widget__info" style="min-width:130px">
					<div class="dt-widget__title text-right">
                    <p  class="dt-widget__subtitle">${
            presentacion.ubicacion_producto.producto.nombre

            }</p>
            <p  class="dt-widget__subtitle">${
            presentacion.ubicacion_producto.producto.codigo

            }</p>
					</div>
				</div>
        <!-- /widget info -->
        <!-- Widget Info -->
        <div class="dt-widget__info" >
            <div class="dt-widget__title text-center">
            <p class="dt-widget__subtitle">${
            presentacion.ubicacion_producto.codigo

            }</p>
                <p  class="dt-widget__subtitle">${
            presentacion.ubicacion_producto.almacen.nombre

            }</p>
            </div>
        </div>
       
        <!-- Widget Info -->
        <div class="dt-widget__info" >
            <div class="dt-widget__title text-center">
                <p  class="dt-widget__subtitle">S/. ${
            redondearDecimal(presentacion.ubicacion_producto.precio_compra, 2) + " x " + presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}</p>
            </div>
        </div>
        <!-- /widget info -->
        <!-- Widget Info -->
        <div class="dt-widget__info" >
            <div class="dt-widget__title text-center">
                <p  class="dt-widget__subtitle">S/. ${
            redondearDecimal(presentacion.ubicacion_producto.precio_venta, 2) + " x " + presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}</p>
            </div>
        </div>
        <!-- /widget info -->
        <!-- Widget Info -->
        <div class="dt-widget__info" >
            <div class="dt-widget__title text-center">
                <p  class="dt-widget__subtitle">S/. ${
            redondearDecimal(presentacion.ubicacion_producto.precio_servicio, 2) + " x " + presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}</p>
            </div>
        </div>
        <!-- /widget info -->

        <!-- Widget Info -->
				<div class="dt-widget__info" >
                    <div class="dt-widget__title text-center">
                    `;
        if (presentacion.existencia == null) {
            row += `
            <button idubicacion_producto="${
                presentacion.ubicacion_producto.idubicacion_producto
                }"  class="btn btn-default text-warning dt-fab-btn ajustar-presentacion"
							data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Ajustar Producto</em>">
								<i class="icon icon-customizer icon-1x pulse-warning"></i>
                            </button>
            `;
        } else {
            row += `<a href="javascript:void(0)" class="p-1">${
                presentacion.existencia + " " + presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura
                }
            </a>
                        `;
            row += `<a href="javascript:void(0)" class="border-left p-1">${
                presentacion.existencia_otro + " " + presentacion.ubicacion_producto.producto.unidad_salida.abreviatura
                }
                        </a>
                                    `;
        }
        row += `
					</div>
				</div>
        <!-- /widget info -->
        <!-- Widget Info -->
        <div class="dt-widget__info" >
            <div class="dt-widget__title text-center">
                <p  class="dt-widget__subtitle">${presentacion.existencia == null ? '<span class="badge badge-pill badge-info mb-1 mr-1">Sin Stock Inicial</span>' : (presentacion.existencia <= 10 && presentacion.existencia > 0) ? '<span class="badge badge-pill badge-warning mb-1 mr-1">Próximo en Agotarse</span>' : presentacion.existencia <= 0 ? '<span class="badge badge-pill badge-danger mb-1 mr-1">Agotado</span>' : '<span class="badge badge-pill badge-success mb-1 mr-1">Stock</span>'}</p>
            </div>
        </div>
        <!-- /widget info -->	
        <!-- Widget Extra -->
				<div class="dt-widget__extra">
					<!-- Hide Content -->
                    <div class="dt-task" style="min-width: 75px;">
                    <div class="dt-task__redirect">
						<!-- Action Button Group -->
                        <div class="action-btn-group" >
                        `;
        if (presentacion.existencia != null) {
            row += `
                            <button idubicacion_producto="${
                presentacion.ubicacion_producto.idubicacion_producto
                }"  class="btn btn-default text-warning dt-fab-btn ajustar-presentacion d-none"
                                            data-toggle="tooltip"
                                        data-html="true"
                                        title=""
                                        data-original-title="<em>Ajustar Producto</em>">
                                                <i class="icon icon-customizer icon-1x pulse-warning"></i>
                                            </button>
                            `;
        }
        row += `
                    <button idubicacion_producto="${
            presentacion.ubicacion_producto.idubicacion_producto}"  class="btn btn-default text-info dt-fab-btn editar-ubicacion-producto"
							data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Editar</em>">
								<i class="icon icon-editors icon-sm pulse-info"></i>
							</button>    
                        <button idubicacion_producto="${
            presentacion.ubicacion_producto.idubicacion_producto
            }"  class="btn btn-default text-danger dt-fab-btn eliminar-ubicacion-producto"
							data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Eliminar</em>">
								<i class="icon icon-trash icon-sm pulse-danger"></i>
							</button>
						</div>
                        <!-- /action button group -->
                        </div>
					</div>
					<!-- /hide content -->
				</div>
			<!-- /widget extra -->
			</div>
			<!-- /widgets item -->
			`;
        document.getElementById('tbodyClienteProducto').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    beanRequestClienteProducto.operation = 'paginate';
    beanRequestClienteProducto.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageClienteProducto').value),
        document.querySelector('#pageClienteProducto'),
        processAjaxClienteProducto,
        beanRequestClienteProducto,
        $('#paginationClienteProducto')
    );
    addEventsClienteProducto();

};

var findByClienteProducto = (idubicacion_producto) => {
    return beanPaginationClienteProducto.list.find(
        (presentacion) => {
            if (parseInt(idubicacion_producto) == presentacion.ubicacion_producto.idubicacion_producto) {
                return presentacion;
            }


        }
    );
};

function findIndexClienteProducto(idbusqueda) {
    return beanPaginationClienteProducto.list.findIndex(
        (presentacion) => {
            if (presentacion.ubicacion_producto.idubicacion_producto == parseInt(idbusqueda))
                return presentacion;


        }
    );
}

var eliminarClienteProducto = (idbusqueda) => {
    beanPaginationClienteProducto.list.splice(findIndexClienteProducto(parseInt(idbusqueda)), 1);
};

var findByCodigoClienteProducto = (idalmacen, idproducto) => {

    return beanPaginationClienteProducto.list.find(
        (presentacion) => {
            if (
                parseInt(idalmacen) == presentacion.ubicacion_producto.almacen.idalmacen
                &&
                parseInt(idproducto) == presentacion.ubicacion_producto.producto.idproducto) {
                return presentacion;
            }


        }
    );
};

function updatelistClienteProducto(classBean) {
    beanPaginationClienteProducto.list.splice(findIndexClienteProducto(classBean.idubicacion_producto), 1, classBean);
}

function validateFormClienteProducto() {
    if (clienteSelectedOtro == undefined) {
        showAlertTopEnd('info', 'Por favor ingrese Cliente');
        return false;
    }

    let numero = numero_campo(
        document.querySelector('#txtPrecioCompraProducto'),
        document.querySelector('#txtPrecioVentaProducto'),
        document.querySelector('#txtPrecioServicioProducto'),
        document.querySelector('#txtPrecioCompraProducto-2'),
        document.querySelector('#txtPrecioVentaProducto-2'),
        document.querySelector('#txtPrecioServicioProducto-2')
    );

    if (numero != undefined) {
        numero.focus();
        numero.labels[0].style.fontWeight = '600';
        addClass(numero.labels[0], 'text-danger');
        if (numero.value == '') {
            showAlertTopEnd('info', 'Por favor ingrese ' + numero.labels[0].innerText);
        } else {
            showAlertTopEnd(
                'info',
                'Por favor ingrese sólo Números al campo ' + numero.labels[0].innerText
            );
        }

        return false;
    }
    return true;
}

function addEventsProductosChange() {


    document.querySelector('#txtPrecioServicioProducto').onkeyup = () => {
        document.querySelector('#txtPrecioServicioProducto-2').value = document.querySelector('#txtPrecioServicioProducto').value / productoSelectedOtro.factor_conversion;
    };
    document.querySelector('#txtPrecioCompraProducto').onkeyup = () => {
        document.querySelector('#txtPrecioCompraProducto-2').value = document.querySelector('#txtPrecioCompraProducto').value / productoSelectedOtro.factor_conversion;
    };
    document.querySelector('#txtPrecioVentaProducto').onkeyup = () => {
        document.querySelector('#txtPrecioVentaProducto-2').value = document.querySelector('#txtPrecioVentaProducto').value / productoSelectedOtro.factor_conversion;
    };

    document.querySelector('#txtPrecioServicioProducto-2').onkeyup = () => {

        document.querySelector('#txtPrecioServicioProducto').value = document.querySelector('#txtPrecioServicioProducto-2').value * productoSelectedOtro.factor_conversion;
    };
    document.querySelector('#txtPrecioCompraProducto-2').onkeyup = () => {
        document.querySelector('#txtPrecioCompraProducto').value = document.querySelector('#txtPrecioCompraProducto-2').value * productoSelectedOtro.factor_conversion;
    };
    document.querySelector('#txtPrecioVentaProducto-2').onkeyup = () => {
        document.querySelector('#txtPrecioVentaProducto').value = document.querySelector('#txtPrecioVentaProducto-2').value * productoSelectedOtro.factor_conversion;
    };
}

/*AJUSTE */
var cantidadClienteProducto = (eleme, btn) => {
    if (numeroSepararDecimal(btn.value).length > 1)
        btn.value = parseInt(btn.value);

    if (btn.value < 1) {
        btn.value = 0;
        return false;
    }


    return true;
};

var accionButtonAjuste = () => {

    /* mas y menos*/
    document.querySelectorAll('.btn-cantidad-menos').forEach((btn) => {
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName('input')[0].value--;
            if (eleme.getElementsByTagName('input')[0].value < 0)
                return eleme.getElementsByTagName('input')[0].value++;
            if (!cantidadClienteProducto(eleme, eleme.getElementsByTagName('input')[0]))
                eleme.getElementsByTagName('input')[0].value++;
        };
    });
    document.querySelectorAll('.btn-cantidad-mas').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName('input')[0].value++;
            if (!cantidadClienteProducto(eleme, eleme.getElementsByTagName('input')[0]))
                eleme.getElementsByTagName('input')[0].value--;
        };
    });
    /* inputs teclado*/
    document.querySelectorAll('.cantidad-ajuste').forEach((btn) => {
        btn.onkeyup = () => {
            if (btn.value == '') return;

            let numero = numero_campo(btn);
            if (numero != undefined) {
                if (numero.value != '') {
                    numero.focus();
                    btn.value = '';
                    showAlertTopEnd('info', 'Por favor ingrese sólo números al campo');
                }
                return;
            }
            let eleme = btn.parentElement.parentElement.parentElement;
            if (cantidadClienteProducto(eleme, btn));
        };
    });



    /* mas y menos*/
    document.querySelectorAll('.btn-cantidad-menos2').forEach((btn) => {
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName('input')[1].value--;
            if (eleme.getElementsByTagName('input')[1].value < 0)
                return eleme.getElementsByTagName('input')[1].value++;
            if (presentacionSelected.ubicacion_producto.producto.factor_conversion < eleme.getElementsByTagName('input')[1].value) {
                eleme.getElementsByTagName('input')[1].value++;
                return showAlertTopEnd('warning', 'la cantidad tiene que ser menor o igual a ' + presentacionSelected.ubicacion_producto.producto.factor_conversion);
            }
            if (!cantidadClienteProducto(eleme, eleme.getElementsByTagName('input')[1]))
                eleme.getElementsByTagName('input')[1].value++;
        };
    });
    document.querySelectorAll('.btn-cantidad-mas2').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName('input')[1].value++;
            if (presentacionSelected.ubicacion_producto.producto.factor_conversion < eleme.getElementsByTagName('input')[1].value) {
                eleme.getElementsByTagName('input')[1].value--;
                return showAlertTopEnd('warning', 'la cantidad tiene que ser menor o igual a ' + presentacionSelected.ubicacion_producto.producto.factor_conversion);
            }
            if (!cantidadClienteProducto(eleme, eleme.getElementsByTagName('input')[1]))
                eleme.getElementsByTagName('input')[1].value--;
        };
    });
    /* inputs teclado*/
    document.querySelectorAll('.cantidad-ajuste2').forEach((btn) => {
        btn.onkeyup = () => {
            if (btn.value == '') return;

            let numero = numero_campo(btn);
            if (numero != undefined) {
                if (numero.value != '') {
                    numero.focus();
                    btn.value = '';
                    showAlertTopEnd('info', 'Por favor ingrese sólo números al campo');
                }
                return;
            }

            let eleme = btn.parentElement.parentElement.parentElement;
            if (presentacionSelected.ubicacion_producto.producto.factor_conversion < eleme.getElementsByTagName('input')[1].value) {
                eleme.getElementsByTagName('input')[1].value = 0;
                return showAlertTopEnd('warning', 'la cantidad tiene que ser menor o igual a ' + presentacionSelected.ubicacion_producto.producto.factor_conversion);
            }
            if (cantidadClienteProducto(eleme, btn));
        };
    });


}

var processAjaxEntrada = () => {

    let parameters_pagination = '';
    let json = '';
    circleCargando.containerOcultar = $(document.querySelector("#FrmAjustePresentacionModal").parentElement);
    circleCargando.container = $(document.querySelector("#FrmAjustePresentacionModal"));
    circleCargando.createLoader();
    circleCargando.toggleLoader("show");
    switch (beanRequestPresentacion.operation) {

        default:
            listDetalleEntrada = [];

            listDetalleEntrada.push(
                new Object(
                    new Detalle_Entrada(
                        1,
                        new PresentacionEntrada(
                            presentacionSelected.idpresentacion,
                            0,
                            0,
                            presentacionSelected.ubicacion_producto

                        ),
                        presentacionSelected.ubicacion_producto.producto.factor_conversion,
                        document.querySelector("#txtAjustePresentacion").value.trim(),
                        document.querySelector("#txtAjuste2Presentacion").value.trim(),
                        document.querySelector("#txtAjustePresentacion").value.trim(),
                        document.querySelector("#txtAjuste2Presentacion").value.trim(),
                        presentacionSelected.ubicacion_producto.precio_servicio,
                        presentacionSelected.ubicacion_producto.precio_compra
                    )
                )
            );
            eliminarAtributosDetalleEntrada();

            json = {
                entrada: new Entrada(
                    parseInt(1),
                    getFullDateJava(),
                    null,
                    null,
                    null,
                    presentacionSelected.ubicacion_producto.cliente,
                    parseInt(document.querySelector("#txtAjustePresentacion").value.trim()),
                    parseInt(document.querySelector("#txtAjuste2Presentacion").value.trim()),
                    parseInt(1)
                ),
                list: listDetalleEntrada
            };
            break;

    }
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(beanRequestPresentacion, json, parameters_pagination,
        circleCargando.loader.firstElementChild);
    xhr.onload = () => {
        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                $('#modalOpenAjuste').modal('hide');
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                document.querySelector('#sizePageClienteProducto').dispatchEvent(new Event('change'));
            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }

    };
};

var redondearDecimal = (numero, decimales) => {
    let numeroRegex = new RegExp('\\d\\.(\\d){' + decimales + ',}');
    if (numeroRegex.test(parseFloat(numero)))
        return Number(parseFloat(numero).toFixed(decimales));
    else
        return Number(parseFloat(numero).toFixed(decimales)) === 0 ? 0 : Number(parseFloat(numero).toFixed(2));

};


var eliminarAtributosDetalleEntrada = () => {
    listDetalleEntrada.forEach(function (obj) {
        delete obj.presentacion['existencia_inicial'];
        delete obj.presentacion['existencia_inicial_otro'];
    });
};

