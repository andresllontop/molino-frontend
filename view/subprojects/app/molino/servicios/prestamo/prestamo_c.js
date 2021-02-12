
var beanPaginationPrestamoC;
var prestamoCSelected;
var btnUnidadSelected = 0;
var beanRequestPrestamoC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestPrestamoC.entity_api = 'api/prestamos';
  beanRequestPrestamoC.operation = 'paginate';
  beanRequestPrestamoC.type_request = 'GET';

  $("#ventanaModalSelectedPrestamoC").detach().appendTo("#drawer-agregarPrestamo");

  $('#FrmPrestamoC').submit(function (event) {
    beanRequestPrestamoC.operation = 'paginate';
    beanRequestPrestamoC.type_request = 'GET';
    processAjaxPrestamoC();
    event.preventDefault();
    event.stopPropagation();
  });

  $('#ventanaModalSelectedPrestamoC').on('hidden.bs.modal', function () {
    beanRequestPrestamoC.operation = 'paginate';
    beanRequestPrestamoC.type_request = 'GET';
  });

  $("#addUnidadMedidaHtml").detach().appendTo("#drawer-agregarUnidadMedida");
  /*
  if (document.querySelector('#btnSeleccionarPrestamo') != undefined) {
    document.querySelector('#btnSeleccionarPrestamo').onclick = function () {
      if (prestamoSelected != undefined) {
        $('#ventanaModalSelectedPrestamoC').modal('show');
      } else {
        processAjaxPrestamoC();
        $('#ventanaModalSelectedPrestamoC').modal('show');
      }
    };
  }
*/

});

function processAjaxPrestamoC() {
  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
  let parameters_pagination = '';
  let json = '';

  switch (beanRequestPrestamoC.operation) {
    default:
      parameters_pagination +=
        '?nombre=' +
        limpiar_campo(
          document.querySelector('#txtFilterPrestamoC').value
        ).toLowerCase();
      parameters_pagination +=
        '&fechai=';
      parameters_pagination +=
        '&fechaf=';
      parameters_pagination +=
        '&id=' + (clienteSelected == undefined ? 0 : clienteSelected.idcliente);
      parameters_pagination +=
        '&page=' + document.querySelector('#pagePrestamoC').value;
      parameters_pagination +=
        '&size=' + document.querySelector('#sizePagePrestamoC').value;
      circleCargando.containerOcultar = $(document.querySelector("#tbodyPrestamoC"));
      circleCargando.container = $(document.querySelector("#tbodyPrestamoC").parentElement);
      circleCargando.createLoader();

      break;
  }
  circleCargando.toggleLoader("show");
  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestPrestamoC,
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
      beanPaginationPrestamoC = beanCrudResponse.beanPagination;
      toListPrestamoC(beanPaginationPrestamoC);
    }
    if (beanCrudResponse.classGeneric !== undefined) {
      beanPaginationPrestamoC.list.unshift(beanCrudResponse.classGeneric);
      beanPaginationPrestamoC.count_filter++;
      toListPrestamoC(beanPaginationPrestamoC);
    }
  }, false);
}

function toListPrestamoC(beanPagination) {
  document.querySelector('#tbodyPrestamoC').innerHTML = '';
  document.querySelector('#titleManagerPrestamoC').innerHTML =
    '[ ' + beanPagination.count_filter + ' ] PRESTAMOS';
  if (beanPagination.count_filter == 0) {
    destroyPagination($('#paginationPrestamoC'));
    showAlertTopEnd('warning', 'No se encontraron resultados');
    document.querySelector('#txtFilterPrestamoC').focus();
    return;
  }
  let row;
  row = `
						
    <!-- Widget Item -->
    <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2">
        <!-- Widget Info -->
        <div class="dt-widget__info ">
            <p class="dt-widget__subtitle ">
           FECHA
            </p>
        </div>
        <!-- /widget info -->
        <!-- Widget Info -->
        <div class="dt-widget__info ">
            <p class="dt-widget__subtitle ">
           CANTIDAD
            </p>
        </div>
        <!-- /widget info -->

        <!-- Widget Info -->
        <div class="dt-widget__info text-center">
            <p class="dt-widget__subtitle ">
           MONTO
            </p>
        </div>
        <!-- /widget info -->
    </div>
`;
  beanPagination.list.forEach((prestamo) => {
    row += `
            <!-- Widget Item -->
            <div class="dt-widget__item mb-0 pb-2">
                <!-- Widget Info -->
                <div class="dt-widget__info ">
                    <p class="dt-widget__subtitle ">
                    ${getStringCapitalize(prestamo.fecha)}
                    </p>
                </div>
                <!-- /widget info -->
                <!-- Widget Info -->
                <div class="dt-widget__info ">
                    <p class="dt-widget__subtitle ">
                    ${prestamo.total}
                    </p>
                </div>
                <!-- /widget info -->

                <!-- Widget Info -->
                <div class="dt-widget__info text-center">
                    <p class="dt-widget__subtitle ">
                    S/. ${numeroConComas(prestamo.monto)}
                    </p>
                </div>
                <!-- /widget info -->
            </div>
			`;

  });
  document.querySelector('#tbodyPrestamoC').innerHTML = row;
  addEventsPrestamoCes();
  buildPagination(
    beanPagination.count_filter,
    parseInt(document.querySelector('#sizePagePrestamoC').value),
    document.querySelector('#pagePrestamoC'),
    processAjaxPrestamoC, beanRequestPrestamoC,
    $('#paginationPrestamoC')
  );
  if (beanRequestPrestamoC.operation == 'paginate') {
    document.querySelector('#txtFilterPrestamoC').focus();
  }


}

function addEventsPrestamoCes() {
  document
    .querySelectorAll('.click-selection-prestamo')
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
          prestamoCSelected = findByPrestamoC(
            this.getAttribute('idprestamo')
          );
        } else {
          prestamoCSelected = undefined;
        }

        if (prestamoCSelected != undefined) {
          switch (btnUnidadSelected) {
            case 1:
              prestamoIngresoSelected = prestamoCSelected;
              document.querySelector(
                '#txtPrestamoIngresoProducto'
              ).value = prestamoCSelected.nombre.toUpperCase();
              document.querySelectorAll(
                '.unidad-medida-1'
              ).forEach((data) => {
                data.textContent = prestamoCSelected.abreviatura;
              });
              break;
            case 2:
              prestamoPrestamoSelected = prestamoCSelected;
              document.querySelector(
                '#txtPrestamoPrestamoProducto'
              ).value = prestamoCSelected.nombre.toUpperCase();
              document.querySelectorAll(
                '.unidad-medida-2'
              ).forEach((data) => {
                data.textContent = prestamoCSelected.abreviatura;
              });
              break;
            default:
              prestamoSelected = prestamoCSelected;
              document.querySelector(
                '#txtPrestamoProducto'
              ).value = prestamoCSelected.nombre.toUpperCase();
              break;
          }
          $('#ventanaModalSelectedPrestamoC').modal('hide');
        }
      };
    });
}

function findByPrestamoC(idprestamo) {
  return beanPaginationPrestamoC.list.find(
    (prestamo) => {
      if (parseInt(idprestamo) == prestamo.idprestamo) {
        return prestamo;
      }


    }
  );
}
function validateFormPrestamo() {
  if (
    limpiar_campo(document.querySelector('#txtNombrePrestamo').value) == ''
  ) {
    showAlertTopEnd('warning', 'Por favor ingrese nombre');
    document.querySelector('#txtNombrenPrestamo').focus();
    return false;
  }
  return true;
}
