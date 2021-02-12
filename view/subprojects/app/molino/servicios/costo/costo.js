var beanPaginationCosto;
var costoSelected;
var categoriaSelected;
var usuarioSelected;
var beanRequestCosto = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {

    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestCosto.entity_api = 'api/costos';
    beanRequestCosto.operation = 'paginate';
    beanRequestCosto.type_request = 'GET';

    $('#FrmCosto').submit(function (event) {
        beanRequestCosto.operation = 'paginate';
        beanRequestCosto.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterCosto').value = limpiar_campo(
            document.querySelector('#txtFilterCosto').value
        );
        processAjaxCosto();
    });

    $('#FrmCostoModal').submit(function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateFormCosto()) {
            processAjaxCosto();
        }

    });

    processAjaxCosto();

    $('#sizePageCosto').change(function () {
        processAjaxCosto();
    });

    document.querySelector("#btnAbrirNewCosto").onclick = () => {
        beanRequestCosto.operation = 'add';
        beanRequestCosto.type_request = 'POST';
        //SET TITLE MODAL
        document.querySelector('#TituloModalCosto').innerHTML = 'Nuevo Costo';
        addCosto();
        $("#addCostoHtml").modal("show");
    };

    /* FECHAS*/
    $('#FechaCosto').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date(),
        lang: 'es',
        icons: calIcons

    });


    document.querySelector('#btnEliminarFechaCosto').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaCosto').value = '';
    };

});

function addCosto(costo = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtMontoCosto').value = (costo == undefined) ? '' : costo.monto;
    document.querySelector('#txtDescripcionCosto').value = (costo == undefined) ? '' : costo.descripcion;

    categoriaSelected = (costo == undefined) ? undefined : costo.categoria;
    usuarioSelected = (costo == undefined) ? { idusuario: user_session.idusuario } : { idusuario: costo.usuario.idusuario, usuario: costo.usuario.usuario };
    document.querySelector('#txtCategoriaCosto').value = (costo == undefined) ? '' : categoriaSelected.descripcion;

    document.querySelector('#txtDetalleCosto').value = (costo == undefined) ? '' : costo.detalle;

    document.querySelector('#txtFechaCosto').value = (costo == undefined) ? getDateJava() : costo.fecha;



}

function processAjaxCosto(valor = undefined) {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestCosto.operation == 'update' ||
        beanRequestCosto.operation == 'add'
    ) {
        if (valor == undefined) {
            circleCargando.container = $(document.querySelector("#FrmCostoModal").parentElement);
            circleCargando.containerOcultar = $(document.querySelector("#FrmCostoModal"));
        } else {
            circleCargando.containerOcultar = $(document.querySelector("#tbodyCosto").parentElement);
            circleCargando.container = $(document.querySelector("#tbodyCosto").parentElement.parentElement);
        }
        circleCargando.createLoader();
        circleCargando.toggleLoader("show");
        try {
            json = {
                fecha: document.querySelector('#txtFechaCosto').value.trim(),
                monto: parseFloat(document.querySelector('#txtMontoCosto').value.trim()),
                descripcion: document.querySelector('#txtDescripcionCosto').value.trim(),
                detalle: document.querySelector('#txtDetalleCosto').value.trim(),
                usuario: usuarioSelected,
                categoria: categoriaSelected


            };
        } catch (error) {
            console.error(error);
            circleCargando.toggleLoader("hide");
            return;
        }



    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyCosto").parentElement);
        circleCargando.container = $(document.querySelector("#tbodyCosto").parentElement.parentElement);
        circleCargando.createLoader();
        circleCargando.toggleLoader("show");
    }

    switch (beanRequestCosto.operation) {
        case 'delete':
            parameters_pagination = '/' + costoSelected.idcosto;
            break;

        case 'update':
            json.idcosto = costoSelected.idcosto;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterCosto').value != '') {
                document.querySelector('#pageCosto').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterCosto').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageCosto').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageCosto').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestCosto,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestCosto.operation == "delete") {
                    eliminarlistCosto(costoSelected.idcosto);
                    toListCosto(beanPaginationCosto);
                }
                notifyUser('Acción realizada exitosamente');
                $("#addCostoHtml").modal("hide");

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationCosto = beanCrudResponse.beanPagination;
            toListCosto(beanPaginationCosto);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestCosto.operation == 'update') {
                updatelistCosto(beanCrudResponse.classGeneric);
                toListCosto(beanPaginationCosto);
                return;
            }
            beanPaginationCosto.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationCosto.count_filter++;
            toListCosto(beanPaginationCosto);
        }

    }, false);
}

function toListCosto(beanPagination) {
    document.querySelector('#tbodyCosto').innerHTML = '';
    document.querySelector('#titleManagerCosto').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] COSTOS';
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
        destroyPagination($('#paginationCosto'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterCosto').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2">
    <!-- Widget Info -->
    <div class="dt-widget__info  text-center" >
        <p class="mb-0  " >
           NO HAY COSTOS
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyCosto').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyCosto').innerHTML += row;
    beanPagination.list.forEach((costo) => {
        row = `
            <!-- Widget Costo -->
			<div class="dt-widget__item m-0 py-1 pr-3" >

              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >${costo.fecha}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >${costo.descripcion}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >S/. ${numeroConComas(costo.monto)}
                </p>
                
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >${costo.categoria.descripcion}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >${costo.usuario.usuario}
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
                  idcosto='${costo.idcosto}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-costo"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-costo" idcosto='${costo.idcosto}'
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
        document.querySelector('#tbodyCosto').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    beanRequestCosto.operation = 'paginate';
    beanRequestCosto.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageCosto').value),
        document.querySelector('#pageCosto'),
        processAjaxCosto, beanRequestCosto,
        $('#paginationCosto')
    );
    addEventsCostos();
    if (beanRequestCosto.operation == 'paginate') {
        document.querySelector('#txtFilterCosto').focus();
    }

}

function addEventsCostos() {
    document.querySelectorAll('.editar-costo').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            costoSelected = findByCosto(
                btn.getAttribute('idcosto')
            );
            if (costoSelected != undefined) {
                beanRequestCosto.operation = 'update';
                beanRequestCosto.type_request = 'PUT';
                addCosto(costoSelected);
                document.querySelector('#TituloModalCosto').innerHTML =
                    'Editar Costo';
                document.querySelector('#txtDescripcionCosto').focus();
                $("#addCostoHtml").modal("show");
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Costo para poder editar'
                );
            }
        };
    });

    document.querySelectorAll('.eliminar-costo').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            costoSelected = findByCosto(
                btn.getAttribute('idcosto')
            );
            if (costoSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Costo para poder eliminar'
                );
            beanRequestCosto.operation = 'delete';
            beanRequestCosto.type_request = 'DELETE';
            processAjaxCosto();
        };
    });
}

function validateFormCosto() {
    let letra = letra_numero_campo(
        document.querySelector('#txtDescripcionCosto')
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

    if (document.querySelector('#txtDetalleCosto').value !== "") {
        letra = letra_numero_campo(document.querySelector('#txtDetalleCosto'));

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
        document.querySelector('#txtMontoCosto')
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

function eliminarlistCosto(idbusqueda) {
    beanPaginationCosto.count_filter--;
    beanPaginationCosto.list.splice(findIndexCosto(parseInt(idbusqueda)), 1);
}

function updatelistCosto(classBean) {
    beanPaginationCosto.list.splice(findIndexCosto(classBean.idcosto), 1, classBean);
}

function findIndexCosto(idbusqueda) {
    return beanPaginationCosto.list.findIndex(
        (costo) => {
            if (costo.idcosto == parseInt(idbusqueda))
                return costo;


        }
    );
}

function findByCosto(idcosto) {
    return beanPaginationCosto.list.find(
        (costo) => {
            if (parseInt(idcosto) == costo.idcosto) {
                return costo;
            }


        }
    );
}
