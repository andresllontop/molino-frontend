var beanPaginationCostoC;
var beanPaginationCostoColorC;
var costoCSelected;
var beanRequestCostoC = new BeanRequest();
let timeout;
document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestCostoC.entity_api = 'api/costos';
  beanRequestCostoC.operation = 'paginate-presentacion';
  beanRequestCostoC.type_request = 'GET';
  /* */


  $('#FrmCostoC').submit(function (event) {
    event.preventDefault();
    event.stopPropagation();
    processAjaxCostoC();
  });

  document.getElementById('txtFilterCostoC').onclick = () => {
    if (beanPaginationCostoC == undefined) return;
    // if (
    // 	beanPaginationCostoC.list.length > 0 &&
    // 	!document.querySelector('#tbodyCostoC').className.includes('show')
    // )
    // 	addClass(document.querySelector('#tbodyCostoC'), 'show');
  };

});

function processAjaxCostoC() {
  if (beanRequestCostoC.operation != 'paginate-presentacion')
    return;


  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");

  circleCargando.containerOcultar = $(document.querySelector("#tbodyCostoC"));
  circleCargando.container = $(document.querySelector("#tbodyCostoC").parentElement);
  circleCargando.createLoader();

  circleCargando.toggleLoader("show");
  let parameters_pagination = '';
  parameters_pagination +=
    '?nombre=' +
    limpiar_campo(
      document.querySelector('#txtFilterCostoC').value
    ).toLowerCase();
  parameters_pagination += '&page=1&size=5';

  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestCostoC,
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
      beanPaginationCostoC = beanCrudResponse.beanPagination;
      toListCostoC(beanPaginationCostoC);
    }
  };
}

function toListCostoC(beanPagination) {
  document.querySelector('#tbodyCostoC').innerHTML = '';
  if (beanPagination.count_filter == 0) {
    removeClass(document.querySelector('#tbodyCostoC'), 'show');
    showAlertTopEnd('warning', 'No se encontraron resultados');
    document.querySelector('#txtFilterCostoC').focus();
    return;
  }
  addClass(document.querySelector('#tbodyCostoC'), 'show');

  let row;
  beanPagination.list.forEach((costo) => {

    row = `
    <!-- Contact -->
    <div class="dt-contact px-2 click-selection-costo" idcosto="${costo.idcosto}">
      <!-- Avatar -->
      <span class="dt-avatar bg-orange text-white"></span>
      <!-- /avatar -->
      <!-- Contact Info -->
      <div class="dt-contact__info">
        <h4 class="text-truncate dt-contact__title">${costo.descripcion}</h4>
        <p class="text-truncate dt-contact__desc">${costo.codigo}</p>
        <p class="text-truncate dt-contact__desc">
        <i class="icon icon-dollar-circle icon-fw mr-1"></i> <span class="">${costo.precio_servicio}</span>
        </p>


      </div>
      <!-- /contact info -->

    </div>
    <!-- /contact -->
      `;
    document.querySelector('#tbodyCostoC').innerHTML += row;

  });
  addEventsCostosC();
  if (beanRequestCostoC.operation == 'paginate-presentacion') {
    document.querySelector('#txtFilterCostoC').focus();
  }

}

function addEventsCostosC() {
  document.querySelectorAll('.click-selection-costo')
    .forEach(function (element) {
      element.onclick = function () {
        costoCSelected = findByCostoC(
          this.getAttribute('idcosto')
        );
        if (costoCSelected == undefined) {
          return showAlertTopEnd('warning', 'No seleccionaste Costo');
        }
        costoSelected = costoCSelected;
        newSelected();
      };
    });



  eventoCosto();
}

function findByCostoC(idcosto) {
  let costo_;
  beanPaginationCostoC.list.forEach((costo) => {
    if (
      parseInt(idcosto) == parseInt(costo.idcosto) &&
      parseInt(idcosto) > 0
    ) {
      costo_ = costo;
      return;
    }
  });
  return costo_;
}

let presentSelected;
function eventoCosto() {
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
      presentSelected = findByCostoC(
        this.getAttribute('idcosto')
      );
      if (presentSelected == undefined) {
        return showAlertTopEnd('warning', 'No seleccionaste Costo');
      }
      var contactWidth = $contact.outerWidth(true);
      var positionValue = $contact.offset();
      var bodyHeight = $body.outerHeight(true);
      var bodyWidth = $body.outerWidth(true);
      if (bodyWidth > 767) {
        $('.dt-costo-name', $userInfoCard).text(presentSelected.descripcion);
        $('.dt-costo-codigo', $userInfoCard).text(presentSelected.codigo);
        $('.dt-costo-precio-costo', $userInfoCard).text(12);

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
