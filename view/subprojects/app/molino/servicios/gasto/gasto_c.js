var beanPaginationGastoC;
var beanPaginationGastoColorC;
var gastoCSelected;
var beanRequestGastoC = new BeanRequest();
let timeout;
document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestGastoC.entity_api = 'api/gastos';
  beanRequestGastoC.operation = 'paginate-presentacion';
  beanRequestGastoC.type_request = 'GET';
  /* */


  $('#FrmGastoC').submit(function (event) {
    event.preventDefault();
    event.stopPropagation();
    processAjaxGastoC();
  });

  document.getElementById('txtFilterGastoC').onclick = () => {
    if (beanPaginationGastoC == undefined) return;
    // if (
    // 	beanPaginationGastoC.list.length > 0 &&
    // 	!document.querySelector('#tbodyGastoC').className.includes('show')
    // )
    // 	addClass(document.querySelector('#tbodyGastoC'), 'show');
  };

});

function processAjaxGastoC() {
  if (beanRequestGastoC.operation != 'paginate-presentacion')
    return;


  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");

  circleCargando.containerOcultar = $(document.querySelector("#tbodyGastoC"));
  circleCargando.container = $(document.querySelector("#tbodyGastoC").parentElement);
  circleCargando.createLoader();

  circleCargando.toggleLoader("show");
  let parameters_pagination = '';
  parameters_pagination +=
    '?nombre=' +
    limpiar_campo(
      document.querySelector('#txtFilterGastoC').value
    ).toLowerCase();
  parameters_pagination += '&page=1&size=5';

  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestGastoC,
    '',
    parameters_pagination,
    circleCargando.loader.firstElementChild
  );
  xhr.onload = () => {
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
      beanPaginationGastoC = beanCrudResponse.beanPagination;
      toListGastoC(beanPaginationGastoC);
    }
  };
}

function toListGastoC(beanPagination) {
  document.querySelector('#tbodyGastoC').innerHTML = '';
  if (beanPagination.count_filter == 0) {
    removeClass(document.querySelector('#tbodyGastoC'), 'show');
    showAlertTopEnd('warning', 'No se encontraron resultados');
    document.querySelector('#txtFilterGastoC').focus();
    return;
  }
  addClass(document.querySelector('#tbodyGastoC'), 'show');

  let row;
  beanPagination.list.forEach((gasto) => {

    row = `
    <!-- Contact -->
    <div class="dt-contact px-2 click-selection-gasto" idgasto="${gasto.idgasto}">
      <!-- Avatar -->
      <span class="dt-avatar bg-orange text-white"></span>
      <!-- /avatar -->
      <!-- Contact Info -->
      <div class="dt-contact__info">
        <h4 class="text-truncate dt-contact__title">${gasto.descripcion}</h4>
        <p class="text-truncate dt-contact__desc">${gasto.codigo}</p>
        <p class="text-truncate dt-contact__desc">
        <i class="icon icon-dollar-circle icon-fw mr-1"></i> <span class="">${gasto.precio_servicio}</span>
        </p>


      </div>
      <!-- /contact info -->

    </div>
    <!-- /contact -->
      `;
    document.querySelector('#tbodyGastoC').innerHTML += row;

  });
  addEventsGastosC();
  if (beanRequestGastoC.operation == 'paginate-presentacion') {
    document.querySelector('#txtFilterGastoC').focus();
  }

}

function addEventsGastosC() {
  document.querySelectorAll('.click-selection-gasto')
    .forEach(function (element) {
      element.onclick = function () {
        gastoCSelected = findByGastoC(
          this.getAttribute('idgasto')
        );
        if (gastoCSelected == undefined) {
          return showAlertTopEnd('warning', 'No seleccionaste Gasto');
        }
        gastoSelected = gastoCSelected;
        newSelected();
      };
    });



  eventoGasto();
}

function findByGastoC(idgasto) {
  let gasto_;
  beanPaginationGastoC.list.forEach((gasto) => {
    if (
      parseInt(idgasto) == parseInt(gasto.idgasto) &&
      parseInt(idgasto) > 0
    ) {
      gasto_ = gasto;
      return;
    }
  });
  return gasto_;
}

let presentSelected;
function eventoGasto() {
  var $userInfoCard = $('.user-info-card');
  var $body = $('body');
  $userInfoCard.hover(function () {
    $userInfoCard.addClass('active').show();
  }, function () {
    $userInfoCard.hide().removeClass('active');
  });

  document.querySelectorAll('.dt-contact').forEach((btn) => {
    var $contact = $(btn);
    $contact.hover(function (event) {
      presentSelected = findByGastoC(
        this.getAttribute('idgasto')
      );
      if (presentSelected == undefined) {
        return showAlertTopEnd('warning', 'No seleccionaste Gasto');
      }
      var contactWidth = $contact.outerWidth(true);
      var positionValue = $contact.offset();
      var bodyHeight = $body.outerHeight(true);
      var bodyWidth = $body.outerWidth(true);
      if (bodyWidth > 767) {
        $('.dt-gasto-name', $userInfoCard).text(presentSelected.descripcion);
        $('.dt-gasto-codigo', $userInfoCard).text(presentSelected.codigo);
        $('.dt-gasto-precio-costo', $userInfoCard).text(12);

        var infoCardHeight = $userInfoCard.outerHeight(true);
        var offsetTop = positionValue.top;

        if (bodyHeight < (positionValue.top + infoCardHeight + 20)) {
          offsetTop = (bodyHeight - infoCardHeight - 20)
        }

        $userInfoCard.css({
          top: offsetTop,
          left: (positionValue.left + contactWidth - 15)
        }).show();
      }
    }, function (event) {
      if (!$userInfoCard.hasClass('active')) {
        $userInfoCard.hide();
      }
    });
  });
}
