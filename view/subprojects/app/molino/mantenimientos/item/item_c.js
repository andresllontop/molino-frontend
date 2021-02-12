var beanPaginationProductoC;
var beanPaginationProductoColorC;
var productoCSelected;
var beanRequestProductoC = new BeanRequest();
let timeout;
document.addEventListener('DOMContentLoaded', function () {
  "use strict";
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestProductoC.entity_api = 'api/productos';
  beanRequestProductoC.operation = 'paginate-presentacion';
  beanRequestProductoC.type_request = 'GET';
  /* */


  $('#FrmProductoC').submit(function (event) {
    event.preventDefault();
    event.stopPropagation();
    processAjaxProductoC();
  });

  document.getElementById('txtFilterProductoC').onclick = () => {
    if (beanPaginationProductoC == undefined) return;
    // if (
    // 	beanPaginationProductoC.list.length > 0 &&
    // 	!document.querySelector('#tbodyProductoC').className.includes('show')
    // )
    // 	addClass(document.querySelector('#tbodyProductoC'), 'show');
  };

});

function processAjaxProductoC() {
  if (beanRequestProductoC.operation != 'paginate-presentacion')
    return;


  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");

  circleCargando.containerOcultar = $(document.querySelector("#tbodyProductoC"));
  circleCargando.container = $(document.querySelector("#tbodyProductoC").parentElement);
  circleCargando.createLoader();

  circleCargando.toggleLoader("show");
  let parameters_pagination = '';
  parameters_pagination +=
    '?nombre=' +
    limpiar_campo(
      document.querySelector('#txtFilterProductoC').value
    ).toLowerCase();
  parameters_pagination += '&page=1&size=5';

  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestProductoC,
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
      beanPaginationProductoC = beanCrudResponse.beanPagination;
      toListProductoC(beanPaginationProductoC);
    }
  };
}

function toListProductoC(beanPagination) {
  document.querySelector('#tbodyProductoC').innerHTML = '';
  if (beanPagination.count_filter == 0) {
    removeClass(document.querySelector('#tbodyProductoC'), 'show');
    showAlertTopEnd('warning', 'No se encontraron resultados');
    document.querySelector('#txtFilterProductoC').focus();
    return;
  }
  addClass(document.querySelector('#tbodyProductoC'), 'show');

  let row;
  beanPagination.list.forEach((producto) => {

    row = `
    <!-- Contact -->
    <div class="dt-contact px-2 click-selection-producto" idproducto="${producto.idproducto}">
      <!-- Avatar -->
      <span class="dt-avatar bg-orange text-white"></span>
      <!-- /avatar -->
      <!-- Contact Info -->
      <div class="dt-contact__info">
        <h4 class="text-truncate dt-contact__title">${producto.descripcion}</h4>
        <p class="text-truncate dt-contact__desc">${producto.codigo}</p>
        <p class="text-truncate dt-contact__desc">
        <i class="icon icon-dollar-circle icon-fw mr-1"></i> <span class="">${producto.precio_servicio}</span>
        </p>


      </div>
      <!-- /contact info -->

    </div>
    <!-- /contact -->
      `;
    document.querySelector('#tbodyProductoC').innerHTML += row;

  });
  addEventsProductosC();
  if (beanRequestProductoC.operation == 'paginate-presentacion') {
    document.querySelector('#txtFilterProductoC').focus();
  }

}

function addEventsProductosC() {
  document.querySelectorAll('.click-selection-producto')
    .forEach(function (element) {
      element.onclick = function () {
        productoCSelected = findByProductoC(
          this.getAttribute('idproducto')
        );
        if (productoCSelected == undefined) {
          return showAlertTopEnd('warning', 'No seleccionaste Producto');
        }
        productoSelected = productoCSelected;
        newSelected();
      };
    });



  eventoProducto();
}

function findByProductoC(idproducto) {
  let producto_;
  beanPaginationProductoC.list.forEach((producto) => {
    if (
      parseInt(idproducto) == parseInt(producto.idproducto) &&
      parseInt(idproducto) > 0
    ) {
      producto_ = producto;
      return;
    }
  });
  return producto_;
}

let presentSelected;
function eventoProducto() {
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
      presentSelected = findByProductoC(
        this.getAttribute('idproducto')
      );
      if (presentSelected == undefined) {
        return showAlertTopEnd('warning', 'No seleccionaste Producto');
      }
      var contactWidth = $contact.outerWidth(true);
      var positionValue = $contact.offset();
      var bodyHeight = $body.outerHeight(true);
      var bodyWidth = $body.outerWidth(true);
      if (bodyWidth > 767) {
        $('.dt-producto-name', $userInfoCard).text(presentSelected.descripcion);
        $('.dt-producto-codigo', $userInfoCard).text(presentSelected.codigo);
        $('.dt-producto-precio-costo', $userInfoCard).text(12);

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
