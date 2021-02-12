/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationPersonalC;
var personalCSelected;

var beanRequestPersonalC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestPersonalC.entity_api = 'api/personals';
  beanRequestPersonalC.operation = 'paginate';
  beanRequestPersonalC.type_request = 'GET';
  /*PERSONAL ADD*/
  if (document.getElementById('addPersonalHtml') != undefined) {
    removeClass(document.getElementById('addPersonalHtml'), 'col-xl-4 col-sm-4 p-1 order-xl-1 order-sm-1');
    addClass(document.getElementById('addPersonalHtml'), 'modal fade');
    document.getElementById('addPersonalHtml').style.zIndex = '1070';
    document.getElementById('addPersonalHtml').style.backgroundColor =
      '#1312129e';
    removeClass(
      document.getElementById('addPersonalHtml').firstChild.nextElementSibling,
      'h-100'
    );
    addClass(
      document.getElementById('addPersonalHtml').firstChild.nextElementSibling,
      'modal-dialog modal-sm modal-dialog-centered'
    );

    addClass(
      document.getElementById('addPersonalHtml').firstChild.nextElementSibling
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
      .getElementById('addPersonalHtml')
      .firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
        parrafo
      );
    document.getElementById('FrmPersonalModal').onsubmit = (event) => {
      //CONFIGURAMOS LA SOLICITUD
      beanRequestPersonalC.operation = 'add';
      beanRequestPersonalC.type_request = 'POST';

      if (validateFormPersonal()) {
        processAjaxPersonalC();
      }
      event.preventDefault();
      event.stopPropagation();
    };

  }


  document.querySelector('#btnSelecionarNewPersonalc').onclick = function () {
    $('#addPersonalHtml').modal('show');
  };


  /* */

  $('#FrmPersonalC').submit(function (event) {
    beanRequestPersonalC.operation = 'paginate';
    beanRequestPersonalC.type_request = 'GET';
    processAjaxPersonalC();
    event.preventDefault();
    event.stopPropagation();
  });

  $('#ventanaModalSelectedPersonalC').on('hidden.bs.modal', function () {
    beanRequestPersonalC.operation = 'paginate';
    beanRequestPersonalC.type_request = 'GET';
  });

  document.querySelector('#btnSeleccionarPersonal').onclick = function () {
    if (personalSelected != undefined) {
      $('#ventanaModalSelectedPersonalC').modal('show');
    } else {
      processAjaxPersonalC();
      $('#ventanaModalSelectedPersonalC').modal('show');
    }
  };
});

function processAjaxPersonalC() {
  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");


  let parameters_pagination = '';
  let json = '';

  switch (beanRequestPersonalC.operation) {
    case 'add':
      json = {
        nombre: document
          .querySelector('#txtNombrePersonal')
          .value.toUpperCase()
      };
      circleCargando.container = $(document.querySelector("#FrmPersonalModal").parentElement);
      circleCargando.containerOcultar = $(document.querySelector("#FrmPersonalModal"));
      circleCargando.createLoader();
      break;

    default:
      parameters_pagination +=
        '?nombre=' +
        limpiar_campo(document.querySelector('#txtFilterPersonalC').value)
          .toLowerCase();
      parameters_pagination += '&page=1&size=5';
      circleCargando.containerOcultar = $(document.querySelector("#tbodyPersonalC"));
      circleCargando.container = $(document.querySelector("#tbodyPersonalC").parentElement);
      circleCargando.createLoader();

      break;
  }
  circleCargando.toggleLoader("show");
  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestPersonalC,
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
      beanPaginationPersonalC = beanCrudResponse.beanPagination;
      toListPersonalC(beanPaginationPersonalC);
    }
  }, false);
}

function toListPersonalC(beanPagination) {
  document.querySelector('#tbodyPersonalC').innerHTML = '';
  document.querySelector('#titleManagerPersonalC').innerHTML =
    '[ ' + beanPagination.count_filter + ' ] PERSONALS';
  if (beanPagination.count_filter > 0) {
    let row;
    beanPagination.list.forEach((personal) => {
      row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-personal form-control form-control-sm " type="checkbox" idpersonal="${
        personal.idpersonal
        }">
                                <label class="dt-checkbox-content" for="${
        personal.idpersonal
        }"">${getStringCapitalize(
          personal.nombre
        )}</label>
                            </div>
                            <!-- /tasks -->
			`;
      document.querySelector('#tbodyPersonalC').innerHTML += row;
    });

    addEventsPersonalCes();
    if (beanRequestPersonalC.operation == 'paginate') {
      document.querySelector('#txtFilterPersonalC').focus();
    }
    $('[data-toggle="tooltip"]').tooltip();
  } else {
    showAlertTopEnd('warning', 'No se encontraron resultados');
    document.querySelector('#txtFilterPersonalC').focus();
  }
}

function addEventsPersonalCes() {
  document
    .querySelectorAll('.click-selection-personal')
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
          personalCSelected = findByPersonalC(
            this.getAttribute('idpersonal')
          );
        } else {
          personalCSelected = undefined;
        }

        if (personalCSelected != undefined) {
          personalSelected = personalCSelected;
          document.querySelector(
            '#txtPersonalUbicacionProducto'
          ).value = personalCSelected.nombre.toUpperCase();
          $('#ventanaModalSelectedPersonalC').modal('hide');
          if (document.querySelector('#FrmPresentacionC') != undefined) {
            document.querySelector('#FrmPresentacionC').dispatchEvent(new Event('submit'));
          }

        }
      };
    });
}

function findByPersonalC(idpersonal) {
  let personal_;
  beanPaginationPersonalC.list.forEach((personal) => {
    if (parseInt(idpersonal) == parseInt(personal.idpersonal)) {
      personal_ = personal;
      return;
    }
  });
  return personal_;
}
function validateFormPersonal() {
  if (
    limpiar_campo(document.querySelector('#txtNombrePersonal').value) == ''
  ) {
    showAlertTopEnd('warning', 'Por favor ingrese nombre');
    document.querySelector('#txtNombrenPersonal').focus();
    return false;
  }
  return true;
}
