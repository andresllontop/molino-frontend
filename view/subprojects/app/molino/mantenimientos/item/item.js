var beanPaginationProducto;
var productoSelected;
var unidadMedidaIngresoSelected;
var beanRequestProducto = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {

    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestProducto.entity_api = 'api/productos';
    beanRequestProducto.operation = 'paginate';
    beanRequestProducto.type_request = 'GET';

    $('#FrmProducto').submit(function (event) {
        beanRequestProducto.operation = 'paginate';
        beanRequestProducto.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterProducto').value = limpiar_campo(
            document.querySelector('#txtFilterProducto').value
        );
        processAjaxProducto();
    });

    $('#FrmProductoModal').submit(function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateFormProducto()) {
            processAjaxProducto();
        }

    });

    processAjaxProducto();

    $('#sizePageProducto').change(function () {
        processAjaxProducto();
    });

    document.querySelector("#btnAbrirNewProducto").onclick = () => {
        beanRequestProducto.operation = 'add';
        beanRequestProducto.type_request = 'POST';
        //SET TITLE MODAL
        document.querySelector('#TituloModalProducto').innerHTML = 'Nuevo Item';
        addProducto();
        $("#addProductoHtml").modal("show");
    };



    document.querySelector('#btnSeleccionarUnidadMedidaIngreso').onclick = function () {
        btnUnidadSelected = 1;
        if (unidadMedidaIngresoSelected != undefined) {
            $('#ventanaModalSelectedUnidadMedidaC').modal('show');
        } else {
            processAjaxUnidadMedidaC();
            $('#ventanaModalSelectedUnidadMedidaC').modal('show');
        }
    };


});
function addProducto(producto = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtCodigoProducto').value = (producto == undefined) ? '' : producto.codigo;
    document.querySelector('#txtDescripcionProducto').value = (producto == undefined) ? '' : producto.descripcion;

    unidadMedidaIngresoSelected = (producto == undefined) ? undefined : producto.unidad_ingreso;
    document.querySelector('#txtUnidadMedidaIngresoProducto').value = (producto == undefined) ? '' : producto.unidad_ingreso.nombre;

    document.querySelector('#txtPrecioCompraProducto').value = (producto == undefined) ? '80' : producto.precio_compra * producto.factor_conversion;



}

function processAjaxProducto(valor = undefined) {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestProducto.operation == 'update' ||
        beanRequestProducto.operation == 'add'
    ) {
        if (valor == undefined) {
            circleCargando.container = $(document.querySelector("#FrmProductoModal").parentElement);
            circleCargando.containerOcultar = $(document.querySelector("#FrmProductoModal"));
        } else {
            circleCargando.containerOcultar = $(document.querySelector("#tbodyProducto").parentElement);
            circleCargando.container = $(document.querySelector("#tbodyProducto").parentElement.parentElement);
        }
        json = {
            codigo: document.querySelector('#txtCodigoProducto').value.trim(),
            nombre: document.querySelector('#txtNombreProducto').value.trim(),
            descripcion: document.querySelector('#txtDescripcionProducto').value.trim(),
            estado: 1,
            tipo_producto: 2,
            precio_servicio: 0,
            precio_compra: document.querySelector('#txtPrecioCompraProducto').value.trim(),
            precio_venta: 0,
            factor_conversion: 1,
            unidad_ingreso: unidadMedidaIngresoSelected,
            unidad_salida: unidadMedidaIngresoSelected

        };


    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyProducto").parentElement);
        circleCargando.container = $(document.querySelector("#tbodyProducto").parentElement.parentElement);
    }
    circleCargando.createLoader();
    circleCargando.toggleLoader("show");
    switch (beanRequestProducto.operation) {
        case 'delete':
            parameters_pagination = '/' + productoSelected.idproducto;
            break;

        case 'update':
            json.idproducto = productoSelected.idproducto;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterProducto').value != '') {
                document.querySelector('#pageProducto').value = 1;
            }
            parameters_pagination +=
                '?tipo_producto=2';
            parameters_pagination +=
                '&nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterProducto').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageProducto').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageProducto').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestProducto,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestProducto.operation == "delete") {
                    eliminarlistProducto(productoSelected.idproducto);
                    toListProducto(beanPaginationProducto);
                }
                notifyUser('Acción realizada exitosamente');
                $("#addProductoHtml").modal("hide");

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationProducto = beanCrudResponse.beanPagination;
            toListProducto(beanPaginationProducto);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestProducto.operation == 'update') {
                updatelistProducto(beanCrudResponse.classGeneric);
                toListProducto(beanPaginationProducto);
                return;
            }
            beanPaginationProducto.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationProducto.count_filter++;
            toListProducto(beanPaginationProducto);
        }

    }, false);
}

function toListProducto(beanPagination) {
    document.querySelector('#tbodyProducto').innerHTML = '';
    document.querySelector('#titleManagerProducto').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] PRODUCTOS';
    let row;
    row = `
        <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2">
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  ">CÓDIGO</p>
        </div>
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  " >
               NOMBRE
            </p>
        </div>
        <!-- Widget Info -->
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  " >
               PRECIO UNITARIO (COMPRA)
            </p>
        </div>
        <!-- Widget Info -->
     
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  " >
            DESCRIPCION
            </p>
        </div>
        <!-- Widget Info -->
       
        <!-- Widget Extra -->
        <div class="dt-widget__extra" >
              ACCIONES
        </div>
    </div>
            `;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationProducto'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterProducto').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2">
    <!-- Widget Info -->
    <div class="dt-widget__info  text-center" >
        <p class="mb-0  " >
           NO HAY PRODUCTOS
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyProducto').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyProducto').innerHTML += row;
    beanPagination.list.forEach((producto) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >

              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >${producto.codigo}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >${producto.nombre}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >S/. ${numeroConComas((producto.precio_compra * producto.factor_conversion).toFixed(2)) + " x " + producto.unidad_ingreso.abreviatura}
                </p>
                
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >${producto.descripcion}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Extra -->
              <div class="dt-widget__extra">
              <div class="dt-task" style="min-width: 75px;">
              <div class="dt-task__redirect">
                          <!-- Action Button Group -->
                          <div class="action-btn-group">
                          <button
                  idproducto='${producto.idproducto}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-producto"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-producto" idproducto='${producto.idproducto}'
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Eliminar</em>"
                  >
                    <i class="icon icon-trash icon-sm pulse-danger"></i>
                  </button>
                          </div>
                          <!-- /action button group -->
                        </div>
                        </div>
                        <!-- /hide content -->
                      </div>

            </div>
            <!-- /widgets item -->
            `;
        document.querySelector('#tbodyProducto').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    beanRequestProducto.operation = 'paginate';
    beanRequestProducto.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageProducto').value),
        document.querySelector('#pageProducto'),
        processAjaxProducto, beanRequestProducto,
        $('#paginationProducto')
    );
    addEventsProductos();
    if (beanRequestProducto.operation == 'paginate') {
        document.querySelector('#txtFilterProducto').focus();
    }

}

function addEventsProductos() {
    document.querySelectorAll('.editar-producto').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            productoSelected = findByProducto(
                btn.getAttribute('idproducto')
            );
            if (productoSelected != undefined) {
                beanRequestProducto.operation = 'update';
                beanRequestProducto.type_request = 'PUT';
                addProducto(productoSelected);
                document.querySelector('#TituloModalProducto').innerHTML =
                    'Editar Item';
                document.querySelector('#txtNombreProducto').focus();
                $("#addProductoHtml").modal("show");
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Producto para poder editar'
                );
            }
        };
    });

    document.querySelectorAll('.eliminar-producto').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            productoSelected = findByProducto(
                btn.getAttribute('idproducto')
            );
            if (productoSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Producto para poder eliminar'
                );
            beanRequestProducto.operation = 'delete';
            beanRequestProducto.type_request = 'DELETE';
            processAjaxProducto();
        };
    });
}

function validateFormProducto() {
    let letra = letra_numero_campo(
        document.querySelector('#txtCodigoProducto'),
        document.querySelector('#txtDescripcionProducto')
    );

    if (letra != undefined) {
        letra.focus();
        letra.labels[0].style.fontWeight = '600';
        addClass(letra.labels[0], 'text-danger');
        if (letra.value == '') {
            showAlertTopEnd('info', 'Por favor ingrese ' + letra.labels[0].innerText);
        } else {
            showAlertTopEnd(
                'info',
                'Por favor ingrese sólo Letras al campo ' + letra.labels[0].innerText
            );
        }

        return false;
    }
    if (unidadMedidaIngresoSelected == undefined) {
        showAlertTopEnd(
            'info',
            'Por favor ingrese Unidad de medida'
        );
        return false;
    }

    let numero = numero_campo(
        document.querySelector('#txtPrecioCompraProducto')
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
                'Por favor ingrese sólo números al campo ' + numero.labels[0].innerText
            );
        }

        return false;
    }

    return true;
}

function eliminarlistProducto(idbusqueda) {
    beanPaginationProducto.count_filter--;
    beanPaginationProducto.list.splice(findIndexProducto(parseInt(idbusqueda)), 1);
}

function updatelistProducto(classBean) {
    beanPaginationProducto.list.splice(findIndexProducto(classBean.idproducto), 1, classBean);
}

function findIndexProducto(idbusqueda) {
    return beanPaginationProducto.list.findIndex(
        (producto) => {
            if (producto.idproducto == parseInt(idbusqueda))
                return producto;


        }
    );
}

function findByProducto(idproducto) {
    return beanPaginationProducto.list.find(
        (producto) => {
            if (parseInt(idproducto) == producto.idproducto) {
                return producto;
            }


        }
    );
}
