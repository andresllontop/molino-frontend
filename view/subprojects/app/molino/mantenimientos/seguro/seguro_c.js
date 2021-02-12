
var beanPaginationSeguroC;
var seguroCSelected;
var btnUnidadSelected = 0;
var beanRequestSeguroC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestSeguroC.entity_api = 'api/seguros';
  beanRequestSeguroC.operation = 'paginate';
  beanRequestSeguroC.type_request = 'GET';
  /*SEGURO ADD*/

  removeClass(document.getElementById('addSeguroHtml'), 'col-xl-4 col-sm-4 p-1 order-xl-1 order-sm-1');
  addClass(document.getElementById('addSeguroHtml'), 'modal fade');
  document.getElementById('addSeguroHtml').style.zIndex = '1070';
  document.getElementById('addSeguroHtml').style.backgroundColor =
    '#1312129e';
  removeClass(
    document.getElementById('addSeguroHtml').firstChild.nextElementSibling,
    'h-100'
  );
  addClass(
    document.getElementById('addSeguroHtml').firstChild.nextElementSibling,
    'modal-dialog modal-sm modal-dialog-centered'
  );

  addClass(
    document.getElementById('addSeguroHtml').firstChild.nextElementSibling
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
    .getElementById('addSeguroHtml')
    .firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
      parrafo
    );
  /* /AGREGAR BOTON X PARA CERRAR */
  document.querySelector('#btnSelecionarNewSeguroc').onclick = function () {
    $('#addSeguroHtml').modal('show');
  };

  document.getElementById('FrmSeguroModal').onsubmit = (event) => {
    //CONFIGURAMOS LA SOLICITUD
    beanRequestSeguroC.operation = 'add';
    beanRequestSeguroC.type_request = 'POST';

    if (validateFormSeguro()) {
      processAjaxSeguroC();
    }
    event.preventDefault();
    event.stopPropagation();
  };

  $('#ventanaModalSelectedSeguroC').on('hidden.bs.modal', function () {
    beanRequestSeguroC.operation = 'paginate';
    beanRequestSeguroC.type_request = 'GET';
  });
  if (document.querySelector('#btnSeleccionarSeguro') != undefined) {
    document.querySelector('#btnSeleccionarSeguro').onclick = function () {
      if (seguroSelected != undefined) {
        $('#ventanaModalSelectedSeguroC').modal('show');
      } else {
        processAjaxSeguroC();
        $('#ventanaModalSelectedSeguroC').modal('show');
      }
    };
  }



  $('#FrmSeguroC').submit(function (event) {

    beanRequestSeguroC.operation = 'paginate';
    beanRequestSeguroC.type_request = 'GET';
    processAjaxSeguroC();
    event.preventDefault();
    event.stopPropagation();

  });

});

function processAjaxSeguroC() {
  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
  let parameters_pagination = '';
  let json = '';

  switch (beanRequestSeguroC.operation) {
    case 'add':
      json = {
        nombre: document
          .querySelector('#txtNombreSeguro')
          .value.toUpperCase(),
        valor: document
          .querySelector('#txtValorSeguro')
          .value.trim()
      };
      circleCargando.container = $(document.querySelector("#FrmSeguroModal").parentElement);
      circleCargando.containerOcultar = $(document.querySelector("#FrmSeguroModal"));
      circleCargando.createLoader();
      break;

    default:
      parameters_pagination +=
        '?nombre=' +
        limpiar_campo(document.querySelector('#txtFilterSeguroC').value)
          .toLowerCase();
      parameters_pagination += '&page=1&size=5';
      circleCargando.containerOcultar = $(document.querySelector("#tbodySeguroC"));
      circleCargando.container = $(document.querySelector("#tbodySeguroC").parentElement);
      circleCargando.createLoader();

      break;
  }
  circleCargando.toggleLoader("show");
  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestSeguroC,
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
      beanPaginationSeguroC = beanCrudResponse.beanPagination;
      toListSeguroC(beanPaginationSeguroC);
    }
    if (beanCrudResponse.classGeneric !== undefined) {
      beanPaginationSeguroC.list.unshift(beanCrudResponse.classGeneric);
      beanPaginationSeguroC.count_filter++;
      toListSeguroC(beanPaginationSeguroC);
    }
  }, false);
}

function toListSeguroC(beanPagination) {
  document.querySelector('#tbodySeguroC').innerHTML = '';
  document.querySelector('#titleManagerSeguroC').innerHTML =
    '[ ' + beanPagination.count_filter + ' ] SEGUROS';
  if (beanPagination.count_filter > 0) {
    let row;
    beanPagination.list.forEach((seguro) => {
      row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-seguro form-control form-control-sm " type="checkbox" idseguro="${
        seguro.idseguro
        }">
                                <label class="dt-checkbox-content" for="${
        seguro.idseguro
        }"">${getStringCapitalize(
          seguro.nombre
        )}</label>
                            </div>
                            <!-- /tasks -->
			`;
      document.querySelector('#tbodySeguroC').innerHTML += row;
    });

    addEventsSeguroCes();
    if (beanRequestSeguroC.operation == 'paginate') {
      document.querySelector('#txtFilterSeguroC').focus();
    }

  } else {
    showAlertTopEnd('warning', 'No se encontraron resultados');
    document.querySelector('#txtFilterSeguroC').focus();
  }
}

function addEventsSeguroCes() {
  document
    .querySelectorAll('.click-selection-seguro')
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
          seguroCSelected = findBySeguroC(
            this.getAttribute('idseguro')
          );
        } else {
          seguroCSelected = undefined;
        }

        if (seguroCSelected != undefined) {
          switch (btnUnidadSelected) {
            case 1:
              seguroIngresoSelected = seguroCSelected;
              document.querySelector(
                '#txtSeguroIngresoProducto'
              ).value = seguroCSelected.nombre.toUpperCase();
              break;
            case 2:
              seguroSalidaSelected = seguroCSelected;
              document.querySelector(
                '#txtSeguroSalidaProducto'
              ).value = seguroCSelected.nombre.toUpperCase();
              break;
            default:
              seguroSelected = seguroCSelected;
              document.querySelector(
                '#txtSeguroProducto'
              ).value = seguroCSelected.nombre.toUpperCase();
              break;
          }
          $('#ventanaModalSelectedSeguroC').modal('hide');
        }
      };
    });
}

function findBySeguroC(idseguro) {
  return beanPaginationSeguroC.list.find(
    (seguro) => {
      if (parseInt(idseguro) == seguro.idseguro) {
        return seguro;
      }


    }
  );
}
function validateFormSeguro() {
  let letra = letra_campo(
    document.querySelector('#txtNombreSeguro')
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
  let numero = numero_campo(
    document.querySelector('#txtValorSeguro')
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
