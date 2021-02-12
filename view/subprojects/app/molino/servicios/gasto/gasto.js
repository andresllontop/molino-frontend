var beanPaginationGasto;
var gastoSelected;
var categoriaSelected;
var usuarioSelected;
var beanRequestGasto = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {

    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestGasto.entity_api = 'api/gastos';
    beanRequestGasto.operation = 'paginate';
    beanRequestGasto.type_request = 'GET';

    $('#FrmGasto').submit(function (event) {
        beanRequestGasto.operation = 'paginate';
        beanRequestGasto.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterGasto').value = limpiar_campo(
            document.querySelector('#txtFilterGasto').value
        );
        processAjaxGasto();
    });

    $('#FrmGastoModal').submit(function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateFormGasto()) {
            processAjaxGasto();
        }

    });

    processAjaxGasto();

    $('#sizePageGasto').change(function () {
        processAjaxGasto();
    });

    document.querySelector("#btnAbrirNewGasto").onclick = () => {
        beanRequestGasto.operation = 'add';
        beanRequestGasto.type_request = 'POST';
        //SET TITLE MODAL
        document.querySelector('#TituloModalGasto').innerHTML = 'Nuevo Gasto';
        addGasto();
        $("#addGastoHtml").modal("show");
    };

    /* FECHAS*/
    $('#FechaGasto').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date(),
        lang: 'es',
        icons: calIcons

    });


    document.querySelector('#btnEliminarFechaGasto').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaGasto').value = '';
    };

});

function addGasto(gasto = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtMontoGasto').value = (gasto == undefined) ? '' : gasto.monto;
    document.querySelector('#txtDescripcionGasto').value = (gasto == undefined) ? '' : gasto.descripcion;

    categoriaSelected = (gasto == undefined) ? undefined : gasto.categoria;
    usuarioSelected = (gasto == undefined) ? { idusuario: user_session.idusuario } : { idusuario: gasto.usuario.idusuario, usuario: gasto.usuario.usuario };
    document.querySelector('#txtCategoriaGasto').value = (gasto == undefined) ? '' : categoriaSelected.descripcion;

    document.querySelector('#txtDetalleGasto').value = (gasto == undefined) ? '' : gasto.detalle;

    document.querySelector('#txtFechaGasto').value = (gasto == undefined) ? getDateJava() : gasto.fecha;



}

function processAjaxGasto(valor = undefined) {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestGasto.operation == 'update' ||
        beanRequestGasto.operation == 'add'
    ) {
        if (valor == undefined) {
            circleCargando.container = $(document.querySelector("#FrmGastoModal").parentElement);
            circleCargando.containerOcultar = $(document.querySelector("#FrmGastoModal"));
        } else {
            circleCargando.containerOcultar = $(document.querySelector("#tbodyGasto").parentElement);
            circleCargando.container = $(document.querySelector("#tbodyGasto").parentElement.parentElement);
        }
        circleCargando.createLoader();
        circleCargando.toggleLoader("show");
        try {
            json = {
                fecha: document.querySelector('#txtFechaGasto').value.trim(),
                monto: parseFloat(document.querySelector('#txtMontoGasto').value.trim()),
                descripcion: document.querySelector('#txtDescripcionGasto').value.trim(),
                detalle: document.querySelector('#txtDetalleGasto').value.trim(),
                usuario: usuarioSelected,
                categoria: categoriaSelected


            };
        } catch (error) {
            console.error(error);
            circleCargando.toggleLoader("hide");
            return;
        }



    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyGasto").parentElement);
        circleCargando.container = $(document.querySelector("#tbodyGasto").parentElement.parentElement);
        circleCargando.createLoader();
        circleCargando.toggleLoader("show");
    }

    switch (beanRequestGasto.operation) {
        case 'delete':
            parameters_pagination = '/' + gastoSelected.idgasto;
            break;

        case 'update':
            json.idgasto = gastoSelected.idgasto;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterGasto').value != '') {
                document.querySelector('#pageGasto').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterGasto').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageGasto').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageGasto').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestGasto,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestGasto.operation == "delete") {
                    eliminarlistGasto(gastoSelected.idgasto);
                    toListGasto(beanPaginationGasto);
                }
                notifyUser('Acción realizada exitosamente');
                $("#addGastoHtml").modal("hide");

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationGasto = beanCrudResponse.beanPagination;
            toListGasto(beanPaginationGasto);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestGasto.operation == 'update') {
                updatelistGasto(beanCrudResponse.classGeneric);
                toListGasto(beanPaginationGasto);
                return;
            }
            beanPaginationGasto.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationGasto.count_filter++;
            toListGasto(beanPaginationGasto);
        }

    }, false);
}

function toListGasto(beanPagination) {
    document.querySelector('#tbodyGasto').innerHTML = '';
    document.querySelector('#titleManagerGasto').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] GASTOS';
    let row;
    row = `
        <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2">
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0 ">FECHA</p>
        </div>
       
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  " >
               DESCRIPCION
            </p>
        </div>
        <!-- Widget Info -->
     
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  " >
            MONTO
            </p>
        </div>
        <!-- Widget Info -->
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  " >
               CATEGORIA
            </p>
        </div>
        <!-- Widget Info -->
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  " >
               USUARIO
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
        destroyPagination($('#paginationGasto'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterGasto').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2">
    <!-- Widget Info -->
    <div class="dt-widget__info  text-center" >
        <p class="mb-0  " >
           NO HAY GASTOS
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyGasto').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyGasto').innerHTML += row;
    beanPagination.list.forEach((gasto) => {
        row = `
            <!-- Widget Gasto -->
			<div class="dt-widget__item m-0 py-1 pr-3" >

              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >${gasto.fecha}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >${gasto.descripcion}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >S/. ${numeroConComas(gasto.monto)}
                </p>
                
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >${gasto.categoria.descripcion}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >${gasto.usuario.usuario}
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
                  idgasto='${gasto.idgasto}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-gasto"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-gasto" idgasto='${gasto.idgasto}'
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
        document.querySelector('#tbodyGasto').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    beanRequestGasto.operation = 'paginate';
    beanRequestGasto.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageGasto').value),
        document.querySelector('#pageGasto'),
        processAjaxGasto, beanRequestGasto,
        $('#paginationGasto')
    );
    addEventsGastos();
    if (beanRequestGasto.operation == 'paginate') {
        document.querySelector('#txtFilterGasto').focus();
    }

}

function addEventsGastos() {
    document.querySelectorAll('.editar-gasto').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            gastoSelected = findByGasto(
                btn.getAttribute('idgasto')
            );
            if (gastoSelected != undefined) {
                beanRequestGasto.operation = 'update';
                beanRequestGasto.type_request = 'PUT';
                addGasto(gastoSelected);
                document.querySelector('#TituloModalGasto').innerHTML =
                    'Editar Gasto';
                document.querySelector('#txtDescripcionGasto').focus();
                $("#addGastoHtml").modal("show");
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Gasto para poder editar'
                );
            }
        };
    });

    document.querySelectorAll('.eliminar-gasto').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            gastoSelected = findByGasto(
                btn.getAttribute('idgasto')
            );
            if (gastoSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Gasto para poder eliminar'
                );
            beanRequestGasto.operation = 'delete';
            beanRequestGasto.type_request = 'DELETE';
            processAjaxGasto();
        };
    });
}

function validateFormGasto() {
    let letra = letra_numero_campo(
        document.querySelector('#txtDescripcionGasto')
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
                'Por favor ingrese no ingresar caracteres raros al campo ' + letra.labels[0].innerText
            );
        }

        return false;
    }

    if (document.querySelector('#txtDetalleGasto').value !== "") {
        letra = letra_numero_campo(document.querySelector('#txtDetalleGasto'));

        if (letra != undefined) {
            letra.focus();
            letra.labels[0].style.fontWeight = '600';
            addClass(letra.labels[0], 'text-danger');
            if (letra.value == '') {
                showAlertTopEnd('info', 'Por favor ingrese ' + letra.labels[0].innerText);
            } else {
                showAlertTopEnd(
                    'info',
                    'Por favor ingrese no ingresar caracteres raros al campo ' + letra.labels[0].innerText
                );
            }

            return false;
        }
    }


    if (categoriaSelected == undefined) {
        showAlertTopEnd(
            'info',
            'Por favor ingrese Categoría'
        );
        return false;
    }

    let numero = numero_campo(
        document.querySelector('#txtMontoGasto')
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

function eliminarlistGasto(idbusqueda) {
    beanPaginationGasto.count_filter--;
    beanPaginationGasto.list.splice(findIndexGasto(parseInt(idbusqueda)), 1);
}

function updatelistGasto(classBean) {
    beanPaginationGasto.list.splice(findIndexGasto(classBean.idgasto), 1, classBean);
}

function findIndexGasto(idbusqueda) {
    return beanPaginationGasto.list.findIndex(
        (gasto) => {
            if (gasto.idgasto == parseInt(idbusqueda))
                return gasto;


        }
    );
}

function findByGasto(idgasto) {
    return beanPaginationGasto.list.find(
        (gasto) => {
            if (parseInt(idgasto) == gasto.idgasto) {
                return gasto;
            }


        }
    );
}
