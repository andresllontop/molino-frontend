
var beanPaginationComprobanteC;
var comprobanteCSelected;
var beanRequestComprobanteC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestComprobanteC.entity_api = 'api/comprobantes';
  beanRequestComprobanteC.operation = 'paginate';
  beanRequestComprobanteC.type_request = 'GET';


  $('#FrmComprobanteC').submit(function (event) {
    beanRequestComprobanteC.operation = 'paginate';
    beanRequestComprobanteC.type_request = 'GET';
    processAjaxComprobanteC();
    event.preventDefault();
    event.stopPropagation();
  });

  $('#ventanaModalSelectedComprobanteC').on('hidden.bs.modal', function () {
    beanRequestComprobanteC.operation = 'paginate';
    beanRequestComprobanteC.type_request = 'GET';
  });
  if (document.querySelector('#btnSeleccionarComprobante') != undefined) {
    document.querySelector('#btnSeleccionarComprobante').onclick = function () {
      if (comprobanteSelected != undefined) {
        $('#ventanaModalSelectedComprobanteC').modal('show');
      } else {
        processAjaxComprobanteC();
        $('#ventanaModalSelectedComprobanteC').modal('show');
      }
    };
  }


});

function processAjaxComprobanteC() {
  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
  let parameters_pagination = '';
  let json = '';

  switch (beanRequestComprobanteC.operation) {
    case 'add':
      json = {
        nombre: document
          .querySelector('#txtNombreComprobante')
          .value.toUpperCase(),
        codigo: document
          .querySelector('#txtCodigoComprobante')
          .value.trim()
      };
      circleCargando.container = $(document.querySelector("#FrmComprobanteModal").parentElement);
      circleCargando.containerOcultar = $(document.querySelector("#FrmComprobanteModal"));
      circleCargando.createLoader();
      break;

    default:
      parameters_pagination +=
        '?nombre=' +
        limpiar_campo(document.querySelector('#txtFilterComprobanteC').value)
          .toLowerCase();
      parameters_pagination += '&page=1&size=5';
      circleCargando.containerOcultar = $(document.querySelector("#tbodyComprobanteC"));
      circleCargando.container = $(document.querySelector("#tbodyComprobanteC").parentElement);
      circleCargando.createLoader();

      break;
  }
  circleCargando.toggleLoader("show");
  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestComprobanteC,
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
      beanPaginationComprobanteC = beanCrudResponse.beanPagination;
      toListComprobanteC(beanPaginationComprobanteC);
    }
    if (beanCrudResponse.classGeneric !== undefined) {
      beanPaginationComprobanteC.list.unshift(beanCrudResponse.classGeneric);
      beanPaginationComprobanteC.count_filter++;
      toListComprobanteC(beanPaginationComprobanteC);
    }
  }, false);
}

function toListComprobanteC(beanPagination) {
  document.querySelector('#tbodyComprobanteC').innerHTML = '';
  document.querySelector('#titleManagerComprobanteC').innerHTML =
    '[ ' + beanPagination.count_filter + ' ] COMPROBANTES';
  if (beanPagination.count_filter > 0) {
    let row;
    beanPagination.list.forEach((comprobante) => {
      row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-comprobante form-control form-control-sm " type="checkbox" idcomprobante="${
        comprobante.idcomprobante
        }">
                                <label class="dt-checkbox-content" for="${
        comprobante.idcomprobante
        }"">${getStringCapitalize(
          comprobante.nombre
        )}</label>
                            </div>
                            <!-- /tasks -->
			`;
      document.querySelector('#tbodyComprobanteC').innerHTML += row;
    });

    addEventsComprobanteCes();
    if (beanRequestComprobanteC.operation == 'paginate') {
      document.querySelector('#txtFilterComprobanteC').focus();
    }

  } else {
    showAlertTopEnd('warning', 'No se encontraron resultados');
    document.querySelector('#txtFilterComprobanteC').focus();
  }
}

function addEventsComprobanteCes() {
  document
    .querySelectorAll('.click-selection-comprobante')
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
          comprobanteCSelected = findByComprobanteC(
            this.getAttribute('idcomprobante')
          );
        } else {
          comprobanteCSelected = undefined;
        }

        if (comprobanteCSelected != undefined) {

          comprobanteSelected = comprobanteCSelected;
          document.querySelector(
            '#txtComprobante'
          ).value = comprobanteCSelected.nombre.toUpperCase();


          $('#ventanaModalSelectedComprobanteC').modal('hide');
        }
      };
    });
}

function findByComprobanteC(idcomprobante) {
  return beanPaginationComprobanteC.list.find(
    (comprobante) => {
      if (parseInt(idcomprobante) == comprobante.idcomprobante) {
        return comprobante;
      }


    }
  );
}
function validateFormComprobante() {
  if (
    limpiar_campo(document.querySelector('#txtNombreComprobante').value) == ''
  ) {
    showAlertTopEnd('warning', 'Por favor ingrese nombre');
    document.querySelector('#txtNombrenComprobante').focus();
    return false;
  }
  return true;
}
