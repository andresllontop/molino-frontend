var beanPaginationPresentacionC;
var presentacionCSelected;
var beanRequestPresentacionC = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestPresentacionC.entity_api = 'api/presentaciones';
    beanRequestPresentacionC.operation = 'paginate';
    beanRequestPresentacionC.type_request = 'GET';
    /* */


    $('#FrmPresentacionC').submit(function (event) {
        event.preventDefault();
        event.stopPropagation();
        processAjaxPresentacionC();
    });

    document.getElementById('txtFilterPresentacionC').onclick = () => {
        if (beanPaginationPresentacionC == undefined) return;
        // if (
        // 	beanPaginationPresentacionC.list.length > 0 &&
        // 	!document.querySelector('#tbodyPresentacionC').className.includes('show')
        // )
        // 	addClass(document.querySelector('#tbodyPresentacionC'), 'show');
    };


});

function processAjaxPresentacionC() {
    if (beanRequestPresentacionC.operation != "paginate") {
        return;
    }
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");

    circleCargando.containerOcultar = $(document.querySelector("#tbodyPresentacionC"));
    circleCargando.container = $(document.querySelector("#tbodyPresentacionC").parentElement);
    circleCargando.createLoader();

    circleCargando.toggleLoader("show");
    let parameters_pagination = '';
    parameters_pagination +=
        '?idcliente=' + ((clienteSelected == undefined) ? 0 : clienteSelected.idcliente);
    parameters_pagination +=
        '&nombre=' +
        limpiar_campo(
            document.querySelector('#txtFilterPresentacionC').value
        ).toLowerCase();
    parameters_pagination += '&page=1&size=5';

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestPresentacionC,
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
            beanPaginationPresentacionC = beanCrudResponse.beanPagination;
            toListPresentacionC(beanPaginationPresentacionC);
        }
    };
}

function toListPresentacionC(beanPagination) {
    document.querySelector('#tbodyPresentacionC').innerHTML = '';
    if (beanPagination.count_filter == 0) {
        removeClass(document.querySelector('#tbodyPresentacionC'), 'show');
        showAlertTopEnd('warning', 'El Cliente no cuenta con Productos en el almacén, o no ingresó el inventario inical');
        document.querySelector('#txtFilterPresentacionC').focus();
        return;
    }
    addClass(document.querySelector('#tbodyPresentacionC'), 'show');

    let row;
    beanPagination.list.forEach((presentacion) => {

        row = `
    <!-- Contact -->
    <div class="dt-contact px-2 click-selection-presentacion" idpresentacion="${presentacion.idpresentacion}">
      <!-- Avatar -->
      <span class="dt-avatar bg-orange text-white d-none"></span>
      <!-- /avatar -->
      <!-- Contact Info -->
      <div class="dt-contact__info border-left border-w-5 border-dark-blue">
        <h4 class="text-truncate dt-contact__title">${presentacion.ubicacion_producto.producto.nombre}<span class="dt-separator-v">&nbsp;</span><span class="f-12">${presentacion.ubicacion_producto.almacen.nombre} - ${presentacion.ubicacion_producto.codigo}</span></h4>
        
        <p class="text-truncate dt-contact__desc my-1"><i class="icon icon-metrics icon-fw mr-1"></i>
        <span class="">${presentacion.existencia + " " + presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}</span>
        <span class="dt-separator-v">&nbsp;</span>
        <span class="">${presentacion.existencia_otro + " " + presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}</span></p>

        <p class="text-truncate dt-contact__desc">
        <i class="icon icon-revenue2 icon-fw  my-1"></i>
        <span class="">PC: S/. ${presentacion.ubicacion_producto.precio_compra + " x " + presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}</span>
        <span class="dt-separator-v">&nbsp;</span>
        <span class="">PV: S/. ${presentacion.ubicacion_producto.precio_venta + " x " + presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}</span>
        <span class="dt-separator-v">&nbsp;</span>
         </p>
        <p class="text-truncate dt-contact__desc">
        <i class="icon icon-revenue2 icon-fw  my-1"></i>
        <span class="">PS: S/. ${presentacion.ubicacion_producto.precio_servicio + " x " + presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}</span>
        </p>

      </div>
      <!-- /contact info -->

    </div>
    <!-- /contact -->
      `;
        document.querySelector('#tbodyPresentacionC').innerHTML += row;

    });
    addEventsPresentacionsC();
    if (beanRequestPresentacionC.operation == 'paginate') {
        document.querySelector('#txtFilterPresentacionC').focus();
    }

}

function addEventsPresentacionsC() {
    document.querySelectorAll('.click-selection-presentacion')
        .forEach(function (element) {
            element.onclick = function () {
                presentacionCSelected = findByPresentacionC(
                    this.getAttribute('idpresentacion')
                );
                if (presentacionCSelected == undefined) {
                    return showAlertTopEnd('warning', 'No seleccionaste Presentacion');
                }
                presentacionSelected = presentacionCSelected;
                newSelected();
            };
        });



}

function findByPresentacionC(idpresentacion) {
    let presentacion_;
    beanPaginationPresentacionC.list.forEach((presentacion) => {
        if (
            parseInt(idpresentacion) == parseInt(presentacion.idpresentacion) &&
            parseInt(idpresentacion) > 0
        ) {
            presentacion_ = presentacion;
            return;
        }
    });
    return presentacion_;
}

