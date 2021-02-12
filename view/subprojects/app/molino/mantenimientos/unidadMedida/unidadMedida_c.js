
var beanPaginationUnidadMedidaC;
var unidadMedidaCSelected;
var btnUnidadSelected = 0;
var beanRequestUnidadMedidaC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestUnidadMedidaC.entity_api = 'api/unidadmedidas';
  beanRequestUnidadMedidaC.operation = 'paginate';
  beanRequestUnidadMedidaC.type_request = 'GET';
  /*UNIDAD DE MEDIDA ADD*/

  removeClass(document.getElementById('addUnidadMedidaHtml'), 'col-xl-4 col-sm-4 p-1 order-xl-1 order-sm-1');
  addClass(document.getElementById('addUnidadMedidaHtml'), 'modal fade');
  document.getElementById('addUnidadMedidaHtml').style.zIndex = '1070';
  document.getElementById('addUnidadMedidaHtml').style.backgroundColor =
    '#1312129e';
  removeClass(
    document.getElementById('addUnidadMedidaHtml').firstChild.nextElementSibling,
    'h-100'
  );
  addClass(
    document.getElementById('addUnidadMedidaHtml').firstChild.nextElementSibling,
    'modal-dialog modal-sm modal-dialog-centered'
  );

  addClass(
    document.getElementById('addUnidadMedidaHtml').firstChild.nextElementSibling
      .firstChild.nextElementSibling,
    'modal-content dt-social-card animate-slide border border-w-2 border-indigo p-4'
  );
  /* AGREGAR BOTON X PARA CERRAR */
  let parrafo = document.createElement('div');
  let row = `
		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		<span aria-hidden="true">×</span>
		</button>
		`;

  parrafo.innerHTML = row;
  document
    .getElementById('addUnidadMedidaHtml')
    .firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
      parrafo
    );
  /* /AGREGAR BOTON X PARA CERRAR */
  document.querySelector('#btnSelecionarNewUnidadMedidac').onclick = function () {
    $('#addUnidadMedidaHtml').modal('show');
  };

  document.getElementById('FrmUnidadMedidaModal').onsubmit = (event) => {
    //CONFIGURAMOS LA SOLICITUD
    beanRequestUnidadMedidaC.operation = 'add';
    beanRequestUnidadMedidaC.type_request = 'POST';

    if (validateFormUnidadMedida()) {
      processAjaxUnidadMedidaC();
    }
    event.preventDefault();
    event.stopPropagation();
  };

  /* */

  $('#FrmUnidadMedidaC').submit(function (event) {
    beanRequestUnidadMedidaC.operation = 'paginate';
    beanRequestUnidadMedidaC.type_request = 'GET';
    processAjaxUnidadMedidaC();
    event.preventDefault();
    event.stopPropagation();
  });

  $('#ventanaModalSelectedUnidadMedidaC').on('hidden.bs.modal', function () {
    beanRequestUnidadMedidaC.operation = 'paginate';
    beanRequestUnidadMedidaC.type_request = 'GET';
  });
  if (document.querySelector('#btnSeleccionarUnidadMedida') != undefined) {
    document.querySelector('#btnSeleccionarUnidadMedida').onclick = function () {
      if (unidadMedidaSelected != undefined) {
        $('#ventanaModalSelectedUnidadMedidaC').modal('show');
      } else {
        processAjaxUnidadMedidaC();
        $('#ventanaModalSelectedUnidadMedidaC').modal('show');
      }
    };
  }


});

function processAjaxUnidadMedidaC() {
  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
  let parameters_pagination = '';
  let json = '';

  switch (beanRequestUnidadMedidaC.operation) {
    case 'add':
      json = {
        nombre: document
          .querySelector('#txtNombreUnidadMedida')
          .value.toUpperCase(),
        abreviatura: document
          .querySelector('#txtAbreviaturaUnidadMedida')
          .value.trim()
      };
      circleCargando.container = $(document.querySelector("#FrmUnidadMedidaModal").parentElement);
      circleCargando.containerOcultar = $(document.querySelector("#FrmUnidadMedidaModal"));
      circleCargando.createLoader();
      break;

    default:
      parameters_pagination +=
        '?nombre=' +
        limpiar_campo(document.querySelector('#txtFilterUnidadMedidaC').value)
          .toLowerCase();
      parameters_pagination += '&page=1&size=5';
      circleCargando.containerOcultar = $(document.querySelector("#tbodyUnidadMedidaC"));
      circleCargando.container = $(document.querySelector("#tbodyUnidadMedidaC").parentElement);
      circleCargando.createLoader();

      break;
  }
  circleCargando.toggleLoader("show");
  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestUnidadMedidaC,
    json,
    parameters_pagination,
    circleCargando.loader.firstElementChild
  );
  xhr.addEventListener('load', () => {
    circleCargando.toggleLoader("hide");

    beanCrudResponse = xhr.response;
    if (beanCrudResponse.messageServer !== undefined) {
      if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
        showAlertTopEnd('success', 'Acción realizada exitosamente');
      } else {
        showAlertTopEnd('warning', beanCrudResponse.messageServer);
      }
    }
    if (beanCrudResponse.beanPagination !== undefined) {
      beanPaginationUnidadMedidaC = beanCrudResponse.beanPagination;
      toListUnidadMedidaC(beanPaginationUnidadMedidaC);
    }
    if (beanCrudResponse.classGeneric !== undefined) {
      beanPaginationUnidadMedidaC.list.unshift(beanCrudResponse.classGeneric);
      beanPaginationUnidadMedidaC.count_filter++;
      toListUnidadMedidaC(beanPaginationUnidadMedidaC);
    }
  }, false);
}

function toListUnidadMedidaC(beanPagination) {
  document.querySelector('#tbodyUnidadMedidaC').innerHTML = '';
  document.querySelector('#titleManagerUnidadMedidaC').innerHTML =
    '[ ' + beanPagination.count_filter + ' ] UNIDAD DE MEDIDAS';
  if (beanPagination.count_filter > 0) {
    let row;
    beanPagination.list.forEach((unidadMedida) => {
      row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-unidadMedida form-control form-control-sm " type="checkbox" idunidad_medida="${
        unidadMedida.idunidad_medida
        }">
                                <label class="dt-checkbox-content" for="${
        unidadMedida.idunidad_medida
        }"">${getStringCapitalize(
          unidadMedida.nombre
        )}</label>
                            </div>
                            <!-- /tasks -->
			`;
      document.querySelector('#tbodyUnidadMedidaC').innerHTML += row;
    });

    addEventsUnidadMedidaCes();
    if (beanRequestUnidadMedidaC.operation == 'paginate') {
      document.querySelector('#txtFilterUnidadMedidaC').focus();
    }

  } else {
    showAlertTopEnd('warning', 'No se encontraron resultados');
    document.querySelector('#txtFilterUnidadMedidaC').focus();
  }
}

function addEventsUnidadMedidaCes() {
  document
    .querySelectorAll('.click-selection-unidadMedida')
    .forEach(function (element) {
      element.onclick = function () {
        if (this.checked) {
          for (
            let index = 0;
            index < this.parentElement.parentElement.children.length;
            index++
          ) {
            this.parentElement.parentElement.children[
              index
            ].children[0].checked = false;
          }
          this.checked = true;
          unidadMedidaCSelected = findByUnidadMedidaC(
            this.getAttribute('idunidad_medida')
          );
        } else {
          unidadMedidaCSelected = undefined;
        }

        if (unidadMedidaCSelected != undefined) {
          switch (btnUnidadSelected) {
            case 1:
              unidadMedidaIngresoSelected = unidadMedidaCSelected;
              document.querySelector(
                '#txtUnidadMedidaIngresoProducto'
              ).value = unidadMedidaCSelected.nombre.toUpperCase();
              document.querySelectorAll(
                '.unidad-medida-1'
              ).forEach((data) => {
                data.textContent = unidadMedidaCSelected.abreviatura;
              });
              break;
            case 2:
              unidadMedidaSalidaSelected = unidadMedidaCSelected;
              document.querySelector(
                '#txtUnidadMedidaSalidaProducto'
              ).value = unidadMedidaCSelected.nombre.toUpperCase();
              document.querySelectorAll(
                '.unidad-medida-2'
              ).forEach((data) => {
                data.textContent = unidadMedidaCSelected.abreviatura;
              });
              break;
            default:
              unidadMedidaSelected = unidadMedidaCSelected;
              document.querySelector(
                '#txtUnidadMedidaProducto'
              ).value = unidadMedidaCSelected.nombre.toUpperCase();
              break;
          }
          $('#ventanaModalSelectedUnidadMedidaC').modal('hide');
        }
      };
    });
}

function findByUnidadMedidaC(idunidad_medida) {
  return beanPaginationUnidadMedidaC.list.find(
    (unidadMedida) => {
      if (parseInt(idunidad_medida) == unidadMedida.idunidad_medida) {
        return unidadMedida;
      }


    }
  );
}
function validateFormUnidadMedida() {
  if (
    limpiar_campo(document.querySelector('#txtNombreUnidadMedida').value) == ''
  ) {
    showAlertTopEnd('warning', 'Por favor ingrese nombre');
    document.querySelector('#txtNombrenUnidadMedida').focus();
    return false;
  }
  return true;
}
