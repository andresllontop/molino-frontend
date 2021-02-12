
var beanPaginationDocumentoC;
var documentoCSelected;
var btnUnidadSelected = 0;
var beanRequestDocumentoC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestDocumentoC.entity_api = 'api/documentos';
  beanRequestDocumentoC.operation = 'paginate';
  beanRequestDocumentoC.type_request = 'GET';
  /*UNIDAD DE MEDIDA ADD*/

});

function processAjaxDocumentoC() {
  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
  let parameters_pagination = '';
  let json = '';

  switch (beanRequestDocumentoC.operation) {
    case 'add':
      json = {
        nombre: document
          .querySelector('#txtNombreDocumento')
          .value.toUpperCase(),
        abreviatura: document
          .querySelector('#txtAbreviaturaDocumento')
          .value.trim()
      };
      circleCargando.container = $(document.querySelector("#FrmDocumentoModal").parentElement);
      circleCargando.containerOcultar = $(document.querySelector("#FrmDocumentoModal"));
      circleCargando.createLoader();
      break;

    default:
      parameters_pagination +=
        '?tipo=' +
        document.querySelector('#selectTipoComprobante').value;
      parameters_pagination +=
        '&nombre=';
      parameters_pagination += '&page=1&size=100';

      circleCargando.containerOcultar = $(document.querySelector("#tbodyDocumentoC"));
      circleCargando.container = $(document.querySelector("#tbodyDocumentoC").parentElement);
      circleCargando.createLoader();

      break;
  }
  circleCargando.toggleLoader("show");
  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestDocumentoC,
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
      beanPaginationDocumentoC = beanCrudResponse.beanPagination;
      toListDocumentoC(beanPaginationDocumentoC);
    }
    if (beanCrudResponse.classGeneric !== undefined) {
      beanPaginationDocumentoC.list.unshift(beanCrudResponse.classGeneric);
      beanPaginationDocumentoC.count_filter++;
      toListDocumentoC(beanPaginationDocumentoC);
    }
  }, false);
}

function toListDocumentoC(beanPagination) {
  document.querySelector('#tbodyDocumentoC').innerHTML = '';

  if (beanPagination.count_filter > 0) {
    removeClass(document.querySelector('#txtNumeroDocumento').parentElement, "d-none");
    removeClass(document.querySelector('#tbodyDocumentoC'), "d-none");
    let row;
    beanPagination.list.forEach((documento) => {
      row = `
      <option value="${documento.idserie}">${documento.serie}</option>
			`;
      document.querySelector('#tbodyDocumentoC').innerHTML += row;
    });
    documentoCSelected = beanPagination.list[0];
    document.querySelector('#txtNumeroDocumento').value = documentoCSelected.numero_actual + 1;

    // addEventsDocumentoCes();


  } else {

    document.querySelector('#txtNumeroDocumento').value = "";
    showAlertTopEnd('warning', 'No se encontraron Comprobantes');
    addClass(document.querySelector('#tbodyDocumentoC'), "d-none");
    addClass(document.querySelector('#txtNumeroDocumento').parentElement, "d-none");

  }
}

function addEventsDocumentoCes() {
  document
    .querySelectorAll('.click-selection-documento')
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
          documentoCSelected = findByDocumentoC(
            this.getAttribute('iddocumento')
          );
        } else {
          documentoCSelected = undefined;
        }

        if (documentoCSelected != undefined) {
          switch (btnUnidadSelected) {
            case 1:
              documentoIngresoSelected = documentoCSelected;
              document.querySelector(
                '#txtDocumentoIngresoProducto'
              ).value = documentoCSelected.nombre.toUpperCase();
              document.querySelectorAll(
                '.unidad-medida-1'
              ).forEach((data) => {
                data.textContent = documentoCSelected.abreviatura;
              });
              break;
            case 2:
              documentoSalidaSelected = documentoCSelected;
              document.querySelector(
                '#txtDocumentoSalidaProducto'
              ).value = documentoCSelected.nombre.toUpperCase();
              document.querySelectorAll(
                '.unidad-medida-2'
              ).forEach((data) => {
                data.textContent = documentoCSelected.abreviatura;
              });
              break;
            default:
              documentoSelected = documentoCSelected;
              document.querySelector(
                '#txtDocumentoProducto'
              ).value = documentoCSelected.nombre.toUpperCase();
              break;
          }
          $('#ventanaModalSelectedDocumentoC').modal('hide');
        }
      };
    });
}

function findByDocumentoC(iddocumento) {
  return beanPaginationDocumentoC.list.find(
    (documento) => {
      if (parseInt(iddocumento) == documento.iddocumento) {
        return documento;
      }


    }
  );
}

function validateFormDocumento() {
  if (
    limpiar_campo(document.querySelector('#txtNombreDocumento').value) == ''
  ) {
    showAlertTopEnd('warning', 'Por favor ingrese nombre');
    document.querySelector('#txtNombrenDocumento').focus();
    return false;
  }
  return true;
}
