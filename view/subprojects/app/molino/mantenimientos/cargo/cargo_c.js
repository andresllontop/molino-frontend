/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationCargoC;
var cargoCSelected;
var beanRequestCargoC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestCargoC.entity_api = 'api/cargos';
  beanRequestCargoC.operation = 'paginate';
  beanRequestCargoC.type_request = 'GET';
  /*CARGO ADD*/
  if (document.getElementById('addCargoHtml') != undefined) {
    removeClass(document.getElementById('addCargoHtml'), 'col-xl-4 col-sm-4 p-1 order-xl-1 order-sm-1');
    addClass(document.getElementById('addCargoHtml'), 'modal fade');
    document.getElementById('addCargoHtml').style.zIndex = '1070';
    document.getElementById('addCargoHtml').style.backgroundColor =
      '#1312129e';
    removeClass(
      document.getElementById('addCargoHtml').firstChild.nextElementSibling,
      'h-100'
    );
    addClass(
      document.getElementById('addCargoHtml').firstChild.nextElementSibling,
      'modal-dialog modal-sm modal-dialog-centered'
    );

    addClass(
      document.getElementById('addCargoHtml').firstChild.nextElementSibling
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
      .getElementById('addCargoHtml')
      .firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
        parrafo
      );
    document.getElementById('FrmCargoModal').onsubmit = (event) => {
      //CONFIGURAMOS LA SOLICITUD
      beanRequestCargoC.operation = 'add';
      beanRequestCargoC.type_request = 'POST';

      if (validateFormCargo()) {
        processAjaxCargoC();
      }
      event.preventDefault();
      event.stopPropagation();
    };

  }


  document.querySelector('#btnSelecionarNewCargoc').onclick = function () {
    $('#addCargoHtml').modal('show');
  };


  /* */

  $('#FrmCargoC').submit(function (event) {
    beanRequestCargoC.operation = 'paginate';
    beanRequestCargoC.type_request = 'GET';
    processAjaxCargoC();
    event.preventDefault();
    event.stopPropagation();
  });

  $('#ventanaModalSelectedCargoC').on('hidden.bs.modal', function () {
    beanRequestCargoC.operation = 'paginate';
    beanRequestCargoC.type_request = 'GET';
  });

  document.querySelector('#btnSeleccionarCargo').onclick = function () {
    if (cargoSelected != undefined) {
      $('#ventanaModalSelectedCargoC').modal('show');
    } else {
      processAjaxCargoC();
      $('#ventanaModalSelectedCargoC').modal('show');
    }
  };
});

function processAjaxCargoC() {
  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");


  let parameters_pagination = '';
  let json = '';

  switch (beanRequestCargoC.operation) {
    case 'add':
      json = {
        nombre: document
          .querySelector('#txtNombreCargo')
          .value.toUpperCase()
      };
      circleCargando.container = $(document.querySelector("#FrmCargoModal").parentElement);
      circleCargando.containerOcultar = $(document.querySelector("#FrmCargoModal"));
      circleCargando.createLoader();
      break;

    default:
      parameters_pagination +=
        '?nombre=' +
        limpiar_campo(document.querySelector('#txtFilterCargoC').value)
          .toLowerCase();
      parameters_pagination += '&page=1&size=5';
      circleCargando.containerOcultar = $(document.querySelector("#tbodyCargoC"));
      circleCargando.container = $(document.querySelector("#tbodyCargoC").parentElement);
      circleCargando.createLoader();

      break;
  }
  circleCargando.toggleLoader("show");
  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestCargoC,
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
      beanPaginationCargoC = beanCrudResponse.beanPagination;
      toListCargoC(beanPaginationCargoC);
    }
  }, false);
}

function toListCargoC(beanPagination) {
  document.querySelector('#tbodyCargoC').innerHTML = '';
  document.querySelector('#titleManagerCargoC').innerHTML =
    '[ ' + beanPagination.count_filter + ' ] CARGOS';
  if (beanPagination.count_filter > 0) {
    let row;
    beanPagination.list.forEach((cargo) => {
      row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-cargo form-control form-control-sm " type="checkbox" idcargo="${
        cargo.idcargo
        }">
                                <label class="dt-checkbox-content" for="${
        cargo.idcargo
        }"">${getStringCapitalize(
          cargo.nombre
        )}</label>
                            </div>
                            <!-- /tasks -->
			`;
      document.querySelector('#tbodyCargoC').innerHTML += row;
    });

    addEventsCargoCes();
    if (beanRequestCargoC.operation == 'paginate') {
      document.querySelector('#txtFilterCargoC').focus();
    }
    $('[data-toggle="tooltip"]').tooltip();
  } else {
    showAlertTopEnd('warning', 'No se encontraron resultados');
    document.querySelector('#txtFilterCargoC').focus();
  }
}

function addEventsCargoCes() {
  document
    .querySelectorAll('.click-selection-cargo')
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
          cargoCSelected = findByCargoC(
            this.getAttribute('idcargo')
          );
        } else {
          cargoCSelected = undefined;
        }

        if (cargoCSelected != undefined) {
          cargoSelected = cargoCSelected;
          document.querySelector(
            '#txtCargoPersonal'
          ).value = cargoCSelected.nombre.toUpperCase();
          $('#ventanaModalSelectedCargoC').modal('hide');


        }
      };
    });
}

function findByCargoC(idcargo) {
  let cargo_;
  beanPaginationCargoC.list.forEach((cargo) => {
    if (parseInt(idcargo) == parseInt(cargo.idcargo)) {
      cargo_ = cargo;
      return;
    }
  });
  return cargo_;
}
function validateFormCargo() {
  if (
    limpiar_campo(document.querySelector('#txtNombreCargo').value) == ''
  ) {
    showAlertTopEnd('warning', 'Por favor ingrese nombre');
    document.querySelector('#txtNombrenCargo').focus();
    return false;
  }
  return true;
}
