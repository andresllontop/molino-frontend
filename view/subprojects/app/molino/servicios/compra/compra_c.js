var beanPaginationCompraC;
var beanRequestCompraC = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {

    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestCompraC.entity_api = 'api/compras';
    beanRequestCompraC.operation = 'get-total';
    beanRequestCompraC.type_request = 'GET';

    $('#FrmCompraCModal').submit(function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (validateFormEntrada()) {
            processAjaxCompraC();
        }

    });
});

var processAjaxCompraC = () => {
    let parameters_pagination = '';
    let json = '';

    circleCargando.container = $(document.querySelector("#tbodyCompraC").parentElement);
    circleCargando.containerOcultar = $(document.querySelector("#tbodyCompraC"));

    circleCargando.createLoader();
    circleCargando.toggleLoader("show");
    switch (beanRequestCompraC.operation) {

        default:
            parameters_pagination +=
                '?idcliente=' + clienteSelected.idcliente;
            parameters_pagination +=
                '&nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterCompraC').value
                ).toLowerCase();
            parameters_pagination +=
                '&fechai=' + document.querySelector('#txtFechaIFilterEntrada').value;
            parameters_pagination +=
                '&fechaf=' + document.querySelector('#txtFechaFFilterEntrada').value;
            parameters_pagination +=
                '&page=1';
            parameters_pagination +=
                '&size=10';
            break;
    }
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(beanRequestCompraC, json, parameters_pagination,
        circleCargando.loader.firstElementChild);
    xhr.onload = () => {
        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.list !== undefined) {
            beanPaginationCompraC = beanCrudResponse;
            toListCompraC(beanPaginationCompraC);
        }
    };
};

function toListCompraC(beanPagination) {
    document.querySelector('#tbodyCompraC').innerHTML = "";
    let row,
        $fragmentCompra = document.createDocumentFragment();
    if (beanPagination.count_filter == 0) {
        showAlertTopEnd('warning', 'No se encontraron resultados');
        return;
    }

    beanPagination.list.forEach((detalle) => {
        let $divItem = document.createElement("div"),
            $divSubItem = document.createElement("div"),
            $h4SubItem = document.createElement("h4"),
            $parrafoSubItem = document.createElement("p"),
            $parrafo2SubItem = document.createElement("p"),
            $spanSubItem = document.createElement("span"),
            $span2SubItem = document.createElement("span");

        addClass($divItem, "dt-contact px-2");
        addClass($divSubItem, "dt-contact__info border-left border-w-5 border-dark-blue");
        addClass($h4SubItem, "text-truncate dt-contact__title px-2");
        $h4SubItem.innerHTML = detalle.presentacion.ubicacion_producto.producto.nombre + "  <span class='f-12'>" + detalle.presentacion.ubicacion_producto.producto.codigo + " </span>";
        addClass($parrafoSubItem, "text-truncate dt-contact__desc my-1 px-2");
        addClass($parrafo2SubItem, "text-truncate dt-contact__desc my-1 px-2");

        $spanSubItem.textContent = "Total Ingresada: S/. " + detalle.cantidad * detalle.presentacion.ubicacion_producto.precio_compra * detalle.presentacion.ubicacion_producto.producto.factor_conversion;
        $span2SubItem.textContent = " &  " + detalle.cantidad + " " + detalle.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura;
        $parrafoSubItem.appendChild($spanSubItem);
        $parrafoSubItem.appendChild($span2SubItem);

        $spanSubItem = document.createElement("span");
        $span2SubItem = document.createElement("span");
        $spanSubItem.textContent = "Total en Existencia: S/. " + detalle.compra.total;
        $span2SubItem.textContent = " &  " + detalle.cantidad + " " + detalle.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura;
        $parrafo2SubItem.appendChild($spanSubItem);
        $parrafo2SubItem.appendChild($span2SubItem);


        $divSubItem.appendChild($h4SubItem);
        $divSubItem.appendChild($parrafoSubItem);
        $divSubItem.appendChild($parrafo2SubItem);
        $divItem.appendChild($divSubItem);

        $fragmentCompra.appendChild($divItem)
    });
    document.querySelector('#tbodyCompraC').appendChild($fragmentCompra);



}
