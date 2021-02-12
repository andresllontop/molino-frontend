
var beanPaginationSeguroC;
var seguroCSelected;
var beanRequestSeguroC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestSeguroC.entity_api = 'api/seguros';
  beanRequestSeguroC.operation = 'paginate';
  beanRequestSeguroC.type_request = 'GET';
  /*SEGURO ADD*/
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
    default:
      parameters_pagination +=
        '?nombre=';
      parameters_pagination += '&page=1&size=100';
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
  }, false);
}

function toListSeguroC(beanPagination) {
  document.querySelector('#tbodySeguroC').innerHTML = '';

  if (beanPagination.count_filter > 0) {
    let row;
    beanPagination.list.forEach((seguro) => {

      row = `
      <div class="custom-control custom-checkbox mb-3 d-flex">
      <input type="checkbox" id="${seguro.idseguro}" name="customcheckboxInline1"
        class="custom-control-input">
      <label class="custom-control-label  align-self-center w-50" for="${seguro.idseguro}">
        <span class="user-name">${getStringCapitalize(seguro.nombre)}</span>
      </label>
      <div class="input-group input-group-sm w-50 d-none">
        <input type="text" id="txt${seguro.idseguro}Value" class="form-control form-control-sm"
          value="${seguro.valor}" disabled>
        <div class="input-group-append">
          <span class="input-group-text">%</span>
        </div>
        
      </div>
    </div>
			`;
      document.querySelector('#tbodySeguroC').innerHTML += row;
    });

    addEventsSeguroCes();

  } else {
    showAlertTopEnd('warning', 'No se encontraron resultados');
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
