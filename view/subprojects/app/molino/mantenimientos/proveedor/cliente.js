var beanPaginationCliente;
var clienteSelected;
var beanRequestCliente = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar


    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestCliente.entity_api = 'api/clientes';
    beanRequestCliente.operation = 'paginate';
    beanRequestCliente.type_request = 'GET';

    $('#FrmCliente').submit(function (event) {
        beanRequestCliente.operation = 'paginate';
        beanRequestCliente.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterCliente').value = limpiar_campo(
            document.querySelector('#txtFilterCliente').value
        );
        processAjaxCliente();
    });

    $('#FrmClienteModal').submit(function (event) {

        if (validateFormCliente()) {
            processAjaxCliente();
        }
        event.preventDefault();
        event.stopPropagation();
    });

    processAjaxCliente();

    $('#sizePageCliente').change(function () {
        processAjaxCliente();
    });

    document.querySelector("#btnAbrirNewCliente").onclick = () => {
        beanRequestCliente.operation = 'add';
        beanRequestCliente.type_request = 'POST';
        $('[data-toggle="tooltip"]').tooltip("hide");
        //SET TITLE MODAL
        document.querySelector('#TituloModalCliente').innerHTML =
            'REGISTRAR CLIENTE';
        addCliente();
        $('#addClienteHtml').modal('show');
    };

    document.querySelector("#txtTipoDocumentoCliente").onchange = (e) => {

        if (e.target.value == 0) {
            removeClass(document.querySelector("#txtTipoDocumentoCliente").parentElement, "col-sm-4");
            addClass(document.querySelector("#txtTipoDocumentoCliente").parentElement, "col-sm-8");
            addClass(document.querySelector("#txtDocumentoCliente").parentElement, "d-none");
        } else {
            removeClass(document.querySelector("#txtTipoDocumentoCliente").parentElement, "col-sm-8");
            addClass(document.querySelector("#txtTipoDocumentoCliente").parentElement, "col-sm-4");
            removeClass(document.querySelector("#txtDocumentoCliente").parentElement, "d-none");
        }
    };

});
function addCliente(cliente = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtTipoDocumentoCliente').value = (cliente == undefined) ? '1' : cliente.tipo_documento;
    document.querySelector('#txtDocumentoCliente').value = (cliente == undefined) ? '' : cliente.documento;
    document.querySelector('#txtSexoCliente').value = (cliente == undefined) ? '1' : cliente.sexo;
    document.querySelector('#txtNombreCliente').value = (cliente == undefined) ? '' : cliente.nombre;
    document.querySelector('#txtAdicionalCliente').value = (cliente == undefined) ? '' : cliente.adicional;
    document.querySelector('#txtTelefonoCliente').value = (cliente == undefined) ? '' : cliente.telefono;
    document.querySelector('#txtEmailCliente').value = (cliente == undefined) ? '' : cliente.email;
    document.querySelector('#txtEstadoCliente').checked = (cliente == undefined) ? true : (cliente.estado == 1) ? true : false;
    document.querySelector('#txtDireccionCliente').value = (cliente == undefined) ? '' : cliente.direccion;

}

function processAjaxCliente(valor = undefined) {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestCliente.operation == 'update' ||
        beanRequestCliente.operation == 'add'
    ) {
        if (valor == undefined) {
            circleCargando.container = $(document.querySelector("#FrmClienteModal").parentElement);
            circleCargando.containerOcultar = $(document.querySelector("#FrmClienteModal"));
            circleCargando.createLoader();
        } else {
            circleCargando.containerOcultar = $(document.querySelector("#tbodyCliente").parentNode);
            circleCargando.container = $(document.querySelector("#tbodyCliente").parentElement.parentElement);
            circleCargando.createLoader();
        }
        try {
            json = {
                tipo_cliente: parseInt(document.querySelector('#txtTipoCliente').value),
                tipo_documento: parseInt(document.querySelector('#txtTipoDocumentoCliente').value),
                documento: (parseInt(document.querySelector('#txtTipoDocumentoCliente').value) == 0) ? null : parseInt(document.querySelector('#txtDocumentoCliente').value),
                sexo: document.querySelector('#txtSexoCliente').value.trim(),
                nombre: document.querySelector('#txtNombreCliente').value.trim(),
                adicional: document.querySelector('#txtAdicionalCliente').value.trim(),
                telefono: document.querySelector('#txtTelefonoCliente').value.trim(),
                email: document.querySelector('#txtEmailCliente').value.trim(),
                estado: document.querySelector('#txtEstadoCliente').checked == true ? 1 : 0,
                direccion: document.querySelector('#txtDireccionCliente').value.trim()

            };
        } catch (error) {
            circleCargando.toggleLoader("hide");
            showAlertTopEnd('warning', "Los datos no son los correctos.");
        }

    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyCliente").parentNode);
        circleCargando.container = $(document.querySelector("#tbodyCliente").parentElement.parentElement);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestCliente.operation) {
        case 'delete':
            parameters_pagination = '/' + clienteSelected.idcliente;
            break;

        case 'update':
            json.idcliente = clienteSelected.idcliente;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterCliente').value != '') {
                document.querySelector('#pageCliente').value = 1;
            }
            parameters_pagination +=
                '?tipo_cliente=2&nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterCliente').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageCliente').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageCliente').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestCliente,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestCliente.operation == "delete") {
                    eliminarlistCliente(clienteSelected.idcliente);
                    toListCliente(beanPaginationCliente);
                } else {
                    addCliente();
                    $('#addClienteHtml').modal('hide');
                }
                notifyUser('Acción realizada exitosamente');


            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationCliente = beanCrudResponse.beanPagination;
            toListCliente(beanPaginationCliente);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestCliente.operation == 'update') {
                updatelistCliente(beanCrudResponse.classGeneric);
                toListCliente(beanPaginationCliente);
                return;
            }
            beanPaginationCliente.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationCliente.count_filter++;
            toListCliente(beanPaginationCliente);
        }

    }, false);
}

function toListCliente(beanPagination) {
    document.querySelector('#tbodyCliente').innerHTML = '';
    document.querySelector('#titleManagerCliente').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] PROVEEDORES';
    let row;
    row = `
        <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2">
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  ">DOCUMENTO</p>
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
               TELEFONO
            </p>
        </div>
        <!-- Widget Info -->
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  " >
               EMAIL
            </p>
        </div>
        <!-- Widget Info -->
        <div class="dt-widget__info  text-center" >
            <p class="mb-0  " >ESTADO</p>
        </div>
        <!-- Widget Extra -->
        <div class="dt-widget__extra" >
              ACCIONES
        </div>
    </div>
            `;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationCliente'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterCliente').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2">
    <!-- Widget Info -->
    <div class="dt-widget__info  text-center" >
        <p class="mb-0  " >
           NO HAY CLIENTES
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyCliente').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyCliente').innerHTML += row;
    beanPagination.list.forEach((cliente) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >

              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                ${cliente.documento}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                <cite class="" >${cliente.nombre}</cite>
                
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                ${cliente.telefono} 
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                ${cliente.email} 
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-center " >
					<label class="switch">
                <input  idcliente='${cliente.idcliente}' class="check-cliente" type="checkbox" ${cliente.estado == 1 ? 'checked' : ''}>
                <span class="slider round"></span>
                </label>
            </div>
              <!-- /widget info -->
              <!-- Widget Extra -->
              <div class="dt-widget__extra">
              <div class="" style="min-width: 75px;">
              <div class="dt-task__redirect">
                          <!-- Action Button Group -->
                          <div class="action-btn-group">
                          <button
                  idcliente='${cliente.idcliente}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-cliente"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-cliente" idcliente='${cliente.idcliente}'
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
        document.querySelector('#tbodyCliente').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    beanRequestCliente.operation = 'paginate';
    beanRequestCliente.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageCliente').value),
        document.querySelector('#pageCliente'),
        processAjaxCliente, beanRequestCliente,
        $('#paginationCliente')
    );
    addEventsClientes();
    if (beanRequestCliente.operation == 'paginate') {
        document.querySelector('#txtFilterCliente').focus();
    }

}

function addEventsClientes() {
    document.querySelectorAll('.editar-cliente').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            clienteSelected = findByCliente(
                btn.getAttribute('idcliente')
            );
            if (clienteSelected != undefined) {
                beanRequestCliente.operation = 'update';
                beanRequestCliente.type_request = 'PUT';
                addCliente(clienteSelected);
                document.querySelector('#TituloModalCliente').innerHTML =
                    'EDITAR PROVEEDOR';
                document.querySelector('#txtDocumentoCliente').focus();
                $('#addClienteHtml').modal('show');

            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Cliente para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.check-cliente').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            clienteSelected = findByCliente(btn.getAttribute('idcliente'));
            if (clienteSelected != undefined) {
                clienteSelected.estado = btn.checked == true ? 1 : 0;
                addCliente(clienteSelected);
                beanRequestCliente.operation = 'update';
                beanRequestCliente.type_request = 'PUT';
                processAjaxCliente("estado");
            } else {
                showAlertTopEnd('warning', 'No se encontró el cliente para poder editar');
            }
        };

    });

    document.querySelectorAll('.eliminar-cliente').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            clienteSelected = findByCliente(
                btn.getAttribute('idcliente')
            );
            if (clienteSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Cliente para poder eliminar'
                );
            beanRequestCliente.operation = 'delete';
            beanRequestCliente.type_request = 'DELETE';
            processAjaxCliente();
        };
    });

}

function validateFormCliente() {
    let numero = numero_campo(
        document.querySelector('#txtTipoDocumentoCliente'),
        document.querySelector('#txtSexoCliente'),
        document.querySelector('#txtTelefonoCliente')
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

    let letra = letra_campo(
        document.querySelector('#txtNombreCliente')
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
                'Por favor ingrese solo Letras al campo ' + letra.labels[0].innerText
            );
        }

        return false;
    }


    let numero_letra = letra_numero_campo(
        document.querySelector('#txtEmailCliente')
    );

    if (numero_letra != undefined) {
        numero_letra.focus();
        numero_letra.labels[0].style.fontWeight = '600';
        addClass(numero_letra.labels[0], 'text-danger');
        if (numero_letra.value == '') {
            showAlertTopEnd('info', 'Por favor ingrese ' + numero_letra.labels[0].innerText);
        } else {
            showAlertTopEnd(
                'info',
                'Por favor ingrese sólo letras y números al campo ' + numero_letra.labels[0].innerText
            );
        }

        return false;
    }

    if (document.querySelector('#txtSexoCliente').value == 0) {
        document.querySelector('#txtSexoCliente').focus();
        showAlertTopEnd('info', 'Por favor Seleccione un Tipo de Sexo');
        return false;
    }
    document.querySelector('#txtDireccionCliente').value = limpiar_campo(document.querySelector('#txtDireccionCliente').value);
    return true;
}

function eliminarlistCliente(idbusqueda) {
    beanPaginationCliente.count_filter--;
    beanPaginationCliente.list.splice(findIndexCliente(parseInt(idbusqueda)), 1);
}

function updatelistCliente(classBean) {
    beanPaginationCliente.list.splice(findIndexCliente(classBean.idcliente), 1, classBean);
}

function findIndexCliente(idbusqueda) {
    return beanPaginationCliente.list.findIndex(
        (cliente) => {
            if (cliente.idcliente == parseInt(idbusqueda))
                return cliente;


        }
    );
}

function findByCliente(idcliente) {
    return beanPaginationCliente.list.find(
        (cliente) => {
            if (parseInt(idcliente) == cliente.idcliente) {
                return cliente;
            }


        }
    );
}
