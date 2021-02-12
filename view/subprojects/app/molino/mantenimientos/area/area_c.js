/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationAreaC;
var areaCSelected;
var beanRequestAreaC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestAreaC.entity_api = 'api/areas';
  beanRequestAreaC.operation = 'paginate';
  beanRequestAreaC.type_request = 'GET';
  /*AREA ADD*/
  if (document.getElementById('addAreaHtml') != undefined) {
    removeClass(document.getElementById('addAreaHtml'), 'col-xl-4 col-sm-4 p-1 order-xl-1 order-sm-1');
    addClass(document.getElementById('addAreaHtml'), 'modal fade');
    document.getElementById('addAreaHtml').style.zIndex = '1070';
    document.getElementById('addAreaHtml').style.backgroundColor =
      '#1312129e';
    removeClass(
      document.getElementById('addAreaHtml').firstChild.nextElementSibling,
      'h-100'
    );
    addClass(
      document.getElementById('addAreaHtml').firstChild.nextElementSibling,
      'modal-dialog modal-sm modal-dialog-centered'
    );

    addClass(
      document.getElementById('addAreaHtml').firstChild.nextElementSibling
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
      .getElementById('addAreaHtml')
      .firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
        parrafo
      );
    document.getElementById('FrmAreaModal').onsubmit = (event) => {
      //CONFIGURAMOS LA SOLICITUD
      beanRequestAreaC.operation = 'add';
      beanRequestAreaC.type_request = 'POST';

      if (validateFormArea()) {
        processAjaxAreaC();
      }
      event.preventDefault();
      event.stopPropagation();
    };

  }


  document.querySelector('#btnSelecionarNewAreac').onclick = function () {
    $('#addAreaHtml').modal('show');
  };


  /* */

  $('#FrmAreaC').submit(function (event) {
    beanRequestAreaC.operation = 'paginate';
    beanRequestAreaC.type_request = 'GET';
    processAjaxAreaC();
    event.preventDefault();
    event.stopPropagation();
  });

  $('#ventanaModalSelectedAreaC').on('hidden.bs.modal', function () {
    beanRequestAreaC.operation = 'paginate';
    beanRequestAreaC.type_request = 'GET';
  });

  document.querySelector('#btnSeleccionarArea').onclick = function () {
    if (areaSelected != undefined) {
      $('#ventanaModalSelectedAreaC').modal('show');
    } else {
      processAjaxAreaC();
      $('#ventanaModalSelectedAreaC').modal('show');
    }
  };
});

function processAjaxAreaC() {
  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");


  let parameters_pagination = '';
  let json = '';

  switch (beanRequestAreaC.operation) {
    case 'add':
      json = {
        nombre: document
          .querySelector('#txtNombreArea')
          .value.toUpperCase()
      };
      circleCargando.container = $(document.querySelector("#FrmAreaModal").parentElement);
      circleCargando.containerOcultar = $(document.querySelector("#FrmAreaModal"));
      circleCargando.createLoader();
      break;

    default:
      parameters_pagination +=
        '?nombre=' +
        limpiar_campo(document.querySelector('#txtFilterAreaC').value)
          .toLowerCase();
      parameters_pagination += '&page=1&size=5';
      circleCargando.containerOcultar = $(document.querySelector("#tbodyAreaC"));
      circleCargando.container = $(document.querySelector("#tbodyAreaC").parentElement);
      circleCargando.createLoader();

      break;
  }
  circleCargando.toggleLoader("show");
  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestAreaC,
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
      beanPaginationAreaC = beanCrudResponse.beanPagination;
      toListAreaC(beanPaginationAreaC);
    }
  }, false);
}

function toListAreaC(beanPagination) {
  document.querySelector('#tbodyAreaC').innerHTML = '';
  document.querySelector('#titleManagerAreaC').innerHTML =
    '[ ' + beanPagination.count_filter + ' ] AREAS';
  if (beanPagination.count_filter > 0) {
    let row;
    beanPagination.list.forEach((area) => {
      row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-area form-control form-control-sm " type="checkbox" idarea="${
        area.idarea
        }">
                                <label class="dt-checkbox-content" for="${
        area.idarea
        }"">${getStringCapitalize(
          area.nombre
        )}</label>
                            </div>
                            <!-- /tasks -->
			`;
      document.querySelector('#tbodyAreaC').innerHTML += row;
    });

    addEventsAreasC();
    if (beanRequestAreaC.operation == 'paginate') {
      document.querySelector('#txtFilterAreaC').focus();
    }
    $('[data-toggle="tooltip"]').tooltip();
  } else {
    showAlertTopEnd('warning', 'No se encontraron resultados');
    document.querySelector('#txtFilterAreaC').focus();
  }
}

function addEventsAreasC() {
  document
    .querySelectorAll('.click-selection-area')
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
          areaCSelected = findByAreaC(
            this.getAttribute('idarea')
          );
        } else {
          areaCSelected = undefined;
        }

        if (areaCSelected != undefined) {
          areaSelected = areaCSelected;
          document.querySelector(
            '#txtAreaPersonal'
          ).value = areaCSelected.nombre.toUpperCase();
          $('#ventanaModalSelectedAreaC').modal('hide');


        }
      };
    });
}

function findByAreaC(idarea) {
  let area_;
  beanPaginationAreaC.list.forEach((area) => {
    if (parseInt(idarea) == parseInt(area.idarea)) {
      area_ = area;
      return;
    }
  });
  return area_;
}
function validateFormArea() {
  if (
    limpiar_campo(document.querySelector('#txtNombreArea').value) == ''
  ) {
    showAlertTopEnd('warning', 'Por favor ingrese nombre');
    document.querySelector('#txtNombrenArea').focus();
    return false;
  }
  return true;
}
