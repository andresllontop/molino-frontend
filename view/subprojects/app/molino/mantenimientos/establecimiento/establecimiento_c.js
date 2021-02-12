/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationEstablecimientoC;
var establecimientoCSelected;
var beanRequestEstablecimientoC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestEstablecimientoC.entity_api = 'api/establecimientos';
  beanRequestEstablecimientoC.operation = 'paginate';
  beanRequestEstablecimientoC.type_request = 'GET';
  /*ESTABLECIMIENTO ADD*/

  removeClass(document.getElementById('addEstablecimientoHtml'), 'col-xl-4 col-sm-4 p-1 order-xl-1 order-sm-1');
  addClass(document.getElementById('addEstablecimientoHtml'), 'modal fade');
  document.getElementById('addEstablecimientoHtml').style.zIndex = '1070';
  document.getElementById('addEstablecimientoHtml').style.backgroundColor =
    '#1312129e';
  removeClass(
    document.getElementById('addEstablecimientoHtml').firstChild.nextElementSibling,
    'h-100'
  );
  addClass(
    document.getElementById('addEstablecimientoHtml').firstChild.nextElementSibling,
    'modal-dialog modal-sm modal-dialog-centered'
  );

  addClass(
    document.getElementById('addEstablecimientoHtml').firstChild.nextElementSibling
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
    .getElementById('addEstablecimientoHtml')
    .firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
      parrafo
    );
  /* /AGREGAR BOTON X PARA CERRAR */
  document.querySelector('#btnSelecionarNewEstablecimientoc').onclick = function () {
    $('#addEstablecimientoHtml').modal('show');
    processAjaxEstablecimientoC();
  };

  document.getElementById('FrmEstablecimientoModal').onsubmit = (event) => {
    //CONFIGURAMOS LA SOLICITUD
    beanRequestEstablecimientoC.operation = 'add';
    beanRequestEstablecimientoC.type_request = 'POST';

    if (validateFormEstablecimiento()) {
      processAjaxEstablecimientoC();
    }
    event.preventDefault();
    event.stopPropagation();
  };

  /* */

  $('#FrmEstablecimientoC').submit(function (event) {
    beanRequestEstablecimientoC.operation = 'paginate';
    beanRequestEstablecimientoC.type_request = 'GET';
    processAjaxEstablecimientoC();
    event.preventDefault();
    event.stopPropagation();
  });

  $('#ventanaModalSelectedEstablecimientoC').on('hidden.bs.modal', function () {
    beanRequestEstablecimientoC.operation = 'paginate';
    beanRequestEstablecimientoC.type_request = 'GET';
  });

  document.querySelector('#btnSeleccionarEstablecimiento').onclick = function () {
    if (establecimientoSelected != undefined) {
      $('#ventanaModalSelectedEstablecimientoC').modal('show');
    } else {
      processAjaxEstablecimientoC();
      $('#ventanaModalSelectedEstablecimientoC').modal('show');
    }
  };
});

function processAjaxEstablecimientoC() {
  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
  let parameters_pagination = '';
  let json = '';

  switch (beanRequestEstablecimientoC.operation) {
    case 'add':
      json = {
        nombre: document
          .querySelector('#txtNombreEstablecimiento')
          .value.toUpperCase()
      };
      circleCargando.container = $(document.querySelector("#FrmEstablecimientoModal").parentElement);
      circleCargando.containerOcultar = $(document.querySelector("#FrmEstablecimientoModal"));
      circleCargando.createLoader();
      break;

    default:
      parameters_pagination +=
        '?nombre=' +
        limpiar_campo(document.querySelector('#txtFilterEstablecimientoC').value)
          .toLowerCase();
      parameters_pagination += '&page=1&size=5';
      circleCargando.containerOcultar = $(document.querySelector("#tbodyEstablecimientoC"));
      circleCargando.container = $(document.querySelector("#tbodyEstablecimientoC").parentElement);
      circleCargando.createLoader();

      break;
  }
  circleCargando.toggleLoader("show");
  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestEstablecimientoC,
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
      beanPaginationEstablecimientoC = beanCrudResponse.beanPagination;
      toListEstablecimientoC(beanPaginationEstablecimientoC);
    }
  }, false);
}

function toListEstablecimientoC(beanPagination) {
  document.querySelector('#tbodyEstablecimientoC').innerHTML = '';
  document.querySelector('#titleManagerEstablecimientoC').innerHTML =
    '[ ' + beanPagination.count_filter + ' ] ESTABLECIMIENTOS';
  if (beanPagination.count_filter > 0) {
    let row;
    beanPagination.list.forEach((establecimiento) => {
      row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-establecimiento form-control form-control-sm " type="checkbox" idestablecimiento="${
        establecimiento.idestablecimiento
        }">
                                <label class="dt-checkbox-content" for="${
        establecimiento.idestablecimiento
        }"">${getStringCapitalize(
          establecimiento.nombre
        )}</label>
                            </div>
                            <!-- /tasks -->
			`;
      document.querySelector('#tbodyEstablecimientoC').innerHTML += row;
    });

    addEventsEstablecimientoCes();
    if (beanRequestEstablecimientoC.operation == 'paginate') {
      document.querySelector('#txtFilterEstablecimientoC').focus();
    }
  } else {
    showAlertTopEnd('warning', 'No se encontraron resultados');
    document.querySelector('#txtFilterEstablecimientoC').focus();
  }
}

function addEventsEstablecimientoCes() {
  document
    .querySelectorAll('.click-selection-establecimiento')
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
          establecimientoCSelected = findByEstablecimientoC(
            this.getAttribute('idestablecimiento')
          );
        } else {
          establecimientoCSelected = undefined;
        }

        if (establecimientoCSelected != undefined) {
          establecimientoSelected = establecimientoCSelected;
          document.querySelector(
            '#txtEstablecimientoProducto'
          ).value = establecimientoCSelected.nombre.toUpperCase();
          $('#ventanaModalSelectedEstablecimientoC').modal('hide');
        }
      };
    });
}

function findByEstablecimientoC(idestablecimiento) {
  let establecimiento_;
  beanPaginationEstablecimientoC.list.forEach((establecimiento) => {
    if (parseInt(idestablecimiento) == parseInt(establecimiento.idestablecimiento)) {
      establecimiento_ = establecimiento;
      return;
    }
  });
  return establecimiento_;
}
function validateFormEstablecimiento() {
  if (
    limpiar_campo(document.querySelector('#txtNombreEstablecimiento').value) == ''
  ) {
    showAlertTopEnd('warning', 'Por favor ingrese nombre');
    document.querySelector('#txtNombrenEstablecimiento').focus();
    return false;
  }
  return true;
}
