var beanPaginationPersonal;
var personalSelected;
var areaSelected;
var cargoSelected;
var beanRequestPersonal = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestPersonal.entity_api = 'api/personales';
    beanRequestPersonal.operation = 'paginate';
    beanRequestPersonal.type_request = 'GET';

    $('#FrmPersonal').submit(function (event) {
        beanRequestPersonal.operation = 'paginate';
        beanRequestPersonal.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterPersonal').value = limpiar_campo(
            document.querySelector('#txtFilterPersonal').value
        );
        processAjaxPersonal();
    });

    $('#FrmPersonalModal').submit(function (event) {
        if (beanRequestUsuario.operation == "add") {

            if (validateFormUsuario()) {
                processAjaxUsuario();
            }
        }
        if (beanRequestPersonal.operation != "add") {
            if (validateFormPersonal()) {
                processAjaxPersonal();
            }
        }

        event.preventDefault();
        event.stopPropagation();
    });

    processAjaxPersonal();

    $('#sizePagePersonal').change(function () {
        processAjaxPersonal();
    });

    document.querySelector("#btnAbrirNewPersonal").onclick = () => {
        $('[data-toggle="tooltip"]').tooltip("hide");
        beanRequestPersonal.operation = 'add';
        beanRequestPersonal.type_request = 'POST';
        beanRequestUsuario.operation = "add";
        beanRequestUsuario.type_request = "POST";
        //SET TITLE MODAL
        document.querySelector('#TituloModalPersonal').innerHTML =
            'REGISTRAR PERSONAL';
        addPersonal();
        $('#addPersonalHtml').modal('show');
    };
    document.querySelector("#txtDocumentoPersonal").onkeyup = function () {
        document.querySelector("#txtLoginUsuario").value = document.querySelector("#txtDocumentoPersonal").value;
        document.querySelector("#txtPassUsuario").value = document.querySelector("#txtDocumentoPersonal").value;
    };
    document.querySelector("#txtNombrePersonal").onkeyup = function () {
        document.querySelector("#txtNombreUsuario").value = document.querySelector("#txtNombrePersonal").value;
    };

});
function addPersonal(personal = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtTipoDocumentoPersonal').value = (personal == undefined) ? '1' : personal.tipo_documento;
    document.querySelector('#txtDocumentoPersonal').value = (personal == undefined) ? '' : personal.documento;
    document.querySelector('#txtSexoPersonal').value = (personal == undefined) ? '1' : personal.sexo;
    document.querySelector('#txtNombrePersonal').value = (personal == undefined) ? '' : personal.nombre;
    document.querySelector('#txtApellidoPersonal').value = (personal == undefined) ? '' : personal.apellido;
    document.querySelector('#txtTelefonoPersonal').value = (personal == undefined) ? '' : personal.telefono;
    document.querySelector('#txtEmailPersonal').value = (personal == undefined) ? '' : personal.email;
    document.querySelector('#txtEstadoPersonal').checked = (personal == undefined) ? true : (personal.estado == 1) ? true : false;
    document.querySelector('#txtDireccionPersonal').value = (personal == undefined) ? '' : personal.direccion;
    areaSelected = (personal == undefined) ? undefined : personal.area;
    document.querySelector('#txtAreaPersonal').value = (personal == undefined) ? '' : personal.area.nombre;
    cargoSelected = (personal == undefined) ? undefined : personal.cargo;
    document.querySelector('#txtCargoPersonal').value = (personal == undefined) ? '' : personal.cargo.nombre;

}

function processAjaxPersonal(valor = undefined) {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestPersonal.operation == 'update' ||
        beanRequestPersonal.operation == 'add'
    ) {
        if (valor == undefined) {
            circleCargando.container = $(document.querySelector("#FrmPersonalModal").parentElement);
            circleCargando.containerOcultar = $(document.querySelector("#FrmPersonalModal"));
            circleCargando.createLoader();
        } else {
            circleCargando.containerOcultar = $(document.querySelector("#tbodyPersonal").parentNode);
            circleCargando.container = $(document.querySelector("#tbodyPersonal").parentElement.parentElement);
            circleCargando.createLoader();
        }
        try {
            json = {
                tipo_documento: document.querySelector('#txtTipoDocumentoPersonal').value.trim(),
                documento: document.querySelector('#txtDocumentoPersonal').value.trim(),
                sexo: document.querySelector('#txtSexoPersonal').value.trim(),
                nombre: document.querySelector('#txtNombrePersonal').value.trim(),
                apellido: document.querySelector('#txtApellidoPersonal').value.trim(),
                telefono: document.querySelector('#txtTelefonoPersonal').value.trim(),
                email: document.querySelector('#txtEmailPersonal').value.trim(),
                estado: document.querySelector('#txtEstadoPersonal').checked == true ? 1 : 0,
                direccion: document.querySelector('#txtDireccionPersonal').value.trim(),
                area: areaSelected,
                cargo: cargoSelected

            };
        } catch (error) {
            circleCargando.toggleLoader("hide");
            showAlertTopEnd('warning', "Los datos no son los correctos.");
        }

    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyPersonal").parentNode);
        circleCargando.container = $(document.querySelector("#tbodyPersonal").parentElement.parentElement);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestPersonal.operation) {
        case 'delete':
            parameters_pagination = '/' + personalSelected.idpersonal;
            break;

        case 'update':
            json.idpersonal = personalSelected.idpersonal;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterPersonal').value != '') {
                document.querySelector('#pagePersonal').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterPersonal').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pagePersonal').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePagePersonal').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestPersonal,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestPersonal.operation == "delete") {
                    eliminarlistPersonal(personalSelected.idpersonal);
                    toListPersonal(beanPaginationPersonal);
                } else {
                    addPersonal();
                    $('#addPersonalHtml').modal('hide');
                }
                showAlertTopEnd('success', 'Acción realizada exitosamente');


            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationPersonal = beanCrudResponse.beanPagination;
            toListPersonal(beanPaginationPersonal);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestPersonal.operation == 'update') {
                updatelistPersonal(beanCrudResponse.classGeneric);
                toListPersonal(beanPaginationPersonal);
                return;
            }
            beanPaginationPersonal.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationPersonal.count_filter++;
            toListPersonal(beanPaginationPersonal);
        }

    }, false);
}

function toListPersonal(beanPagination) {
    document.querySelector('#tbodyPersonal').innerHTML = '';
    document.querySelector('#titleManagerPersonal').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] PERSONAL';
    let row;
    row = `
        <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2">
        <!-- Widget Info -->
        <div class="dt-widget__info" >
            <p class="mb-0  ">DOCUMENTO</p>
        </div>
        <!-- Widget Info -->
        <div class="dt-widget__info" >
            <p class="mb-0  " >
               NOMBRE
            </p>
        </div>
        <!-- Widget Info -->
        <!-- Widget Info -->
        <div class="dt-widget__info" >
            <p class="mb-0  " >
               TELEFONO
            </p>
        </div>
        <!-- Widget Info -->
        <!-- Widget Info -->
        <div class="dt-widget__info" >
            <p class="mb-0  " >
               EMAIL
            </p>
        </div>
        <!-- Widget Info -->
        
        <div class="dt-widget__info  text-center" >
            <p class="mb-0" >ESTADO</p>
        </div>
        <!-- Widget Extra -->
        <div class="dt-widget__extra" >
              ACCIONES
        </div>
    </div>
            `;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationPersonal'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterPersonal').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2">
    <!-- Widget Info -->
    <div class="dt-widget__info  text-center" >
        <p class="mb-0  " >
           NO HAY PERSONALS
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyPersonal').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyPersonal').innerHTML += row;
    beanPagination.list.forEach((personal) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >

              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                ${personal.documento}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                <cite class="" >${personal.apellido} ${personal.nombre}</cite>
                
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                ${personal.telefono} 
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                ${personal.email} 
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-center " >
					<label class="switch">
                <input  idpersonal='${personal.idpersonal}' class="check-personal" type="checkbox" ${personal.estado == 1 ? 'checked' : ''}>
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
                  idpersonal='${personal.idpersonal}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-personal"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-personal" idpersonal='${personal.idpersonal}'
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
        document.querySelector('#tbodyPersonal').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    beanRequestPersonal.operation = 'paginate';
    beanRequestPersonal.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePagePersonal').value),
        document.querySelector('#pagePersonal'),
        processAjaxPersonal, beanRequestPersonal,
        $('#paginationPersonal')
    );
    addEventsPersonals();
    if (beanRequestPersonal.operation == 'paginate') {
        document.querySelector('#txtFilterPersonal').focus();
    }

}

function addEventsPersonals() {
    document.querySelectorAll('.editar-personal').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            personalSelected = findByPersonal(
                btn.getAttribute('idpersonal')
            );
            if (personalSelected != undefined) {
                beanRequestPersonal.operation = 'update';
                beanRequestPersonal.type_request = 'PUT';
                addPersonal(personalSelected);
                document.querySelector('#TituloModalPersonal').innerHTML =
                    'EDITAR PERSONAL';
                document.querySelector('#txtDocumentoPersonal').focus();
                $('#addPersonalHtml').modal('show');

            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Personal para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.check-personal').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            personalSelected = findByPersonal(btn.getAttribute('idpersonal'));
            if (personalSelected != undefined) {
                personalSelected.estado = btn.checked == true ? 1 : 0;
                addPersonal(personalSelected);
                beanRequestPersonal.operation = 'update';
                beanRequestPersonal.type_request = 'PUT';
                processAjaxPersonal("estado");
            } else {
                showAlertTopEnd('warning', 'No se encontró el personal para poder editar');
            }
        };

    });
    document.querySelectorAll('.ubicacion-personal').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            personalSelected = findByPersonal(
                btn.getAttribute('idpersonal')
            );
            if (personalSelected != undefined) {
                document.querySelector('#pagePersonalProducto').value = 1;
                beanRequestPersonalProducto.operation = 'personal/paginate';
                beanRequestPersonalProducto.type_request = 'GET';
                processAjaxPersonalProducto();
                displayPersonalProducto("show");
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Personal para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-personal').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            personalSelected = findByPersonal(
                btn.getAttribute('idpersonal')
            );
            if (personalSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Personal para poder eliminar'
                );
            beanRequestPersonal.operation = 'delete';
            beanRequestPersonal.type_request = 'DELETE';
            processAjaxPersonal();
        };
    });

}

function validateFormPersonal() {
    let numero = numero_campo(
        document.querySelector('#txtTipoDocumentoPersonal'),
        document.querySelector('#txtDocumentoPersonal'),
        document.querySelector('#txtSexoPersonal'),
        document.querySelector('#txtTelefonoPersonal')
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
        document.querySelector('#txtNombrePersonal'),
        document.querySelector('#txtApellidoPersonal')
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
        document.querySelector('#txtEmailPersonal')
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
    if (document.querySelector('#txtTipoDocumentoPersonal').value == 0) {
        document.querySelector('#txtTipoDocumentoPersonal').focus();
        showAlertTopEnd('info', 'Por favor Seleccione un Tipo de Documento');
        return false;
    }
    if (document.querySelector('#txtSexoPersonal').value == 0) {
        document.querySelector('#txtSexoPersonal').focus();
        showAlertTopEnd('info', 'Por favor Seleccione un Tipo de Sexo');
        return false;
    }
    if (cargoSelected == undefined) {
        showAlertTopEnd('info', 'Por favor Seleccione un Cargo');
        return false;
    }
    if (areaSelected == undefined) {
        showAlertTopEnd('info', 'Por favor Seleccione un Área');
        return false;
    }
    document.querySelector('#txtDireccionPersonal').value = limpiar_campo(document.querySelector('#txtDireccionPersonal').value);
    return true;
}

function eliminarlistPersonal(idbusqueda) {
    beanPaginationPersonal.count_filter--;
    beanPaginationPersonal.list.splice(findIndexPersonal(parseInt(idbusqueda)), 1);
}

function updatelistPersonal(classBean) {
    beanPaginationPersonal.list.splice(findIndexPersonal(classBean.idpersonal), 1, classBean);
}

function findIndexPersonal(idbusqueda) {
    return beanPaginationPersonal.list.findIndex(
        (personal) => {
            if (personal.idpersonal == parseInt(idbusqueda))
                return personal;


        }
    );
}

function findByPersonal(idpersonal) {
    return beanPaginationPersonal.list.find(
        (personal) => {
            if (parseInt(idpersonal) == personal.idpersonal) {
                return personal;
            }


        }
    );
}
