var beanPaginationEntradaC;
var beanRequestEntrada = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {

    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestEntrada.entity_api = 'api/salidas';
    beanRequestEntrada.operation = 'get-total';
    beanRequestEntrada.type_request = 'GET';

    $('#FrmEntradaModal').submit(function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (validateFormEntrada()) {
            processAjaxEntrada();
        }

    });
    /* FECHAS*/
    $('#txtFechaIFilterEntrada').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: removeDays(new Date(), 30),
        lang: 'es',
        icons: calIcons
    });


    /* FECHAS*/
    $('#txtFechaFFilterEntrada').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date(),
        lang: 'es',
        icons: calIcons

    });


    document.querySelector('#btnEliminarFechaIFilterEntrada').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaIFilterEntrada').value = '';
    };

    document.querySelector('#btnEliminarFechaFFilterEntrada').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaFFilterEntrada').value = '';
    };

});

var processAjaxEntrada = () => {
    let parameters_pagination = '';
    let json = '';

    circleCargando.container = $(document.querySelector("#tbodyProductoC").parentElement);
    circleCargando.containerOcultar = $(document.querySelector("#tbodyProductoC"));

    circleCargando.createLoader();
    circleCargando.toggleLoader("show");
    switch (beanRequestEntrada.operation) {

        default:
            parameters_pagination +=
                '?idcliente=' + clienteSelected.idcliente;
            parameters_pagination +=
                '&nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterProductoC').value
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
    xhr = RequestServer(beanRequestEntrada, json, parameters_pagination,
        circleCargando.loader.firstElementChild);
    xhr.onload = () => {
        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.list !== undefined) {
            beanPaginationEntradaC = beanCrudResponse;
            toListEntrada(beanPaginationEntradaC);
        }
    };
};

function toListEntrada(beanPagination) {
    document.querySelector('#tbodyProductoC').innerHTML = "";
    let row,
        $fragmentVenta = document.createDocumentFragment();
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

        addClass($divItem, "dt-contact px-2 click-selection-presentacionC");
        addClass($divSubItem, "dt-contact__info border-left border-w-5 border-dark-blue");
        addClass($h4SubItem, "text-truncate dt-contact__title px-2");
        $divItem.setAttribute("idpresentacion", detalle.presentacion.idpresentacion);
        $h4SubItem.innerHTML = detalle.presentacion.ubicacion_producto.producto.nombre + "  <span class='f-12'>" + detalle.presentacion.ubicacion_producto.producto.codigo + " </span>";
        addClass($parrafoSubItem, "text-truncate dt-contact__desc my-1 px-2");
        addClass($parrafo2SubItem, "text-truncate dt-contact__desc my-1 px-2");

        $spanSubItem.textContent = "Total de Salidas: " + detalle.salida.total + " " + detalle.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura;
        $span2SubItem.textContent = "& " + detalle.salida.total_otro + " " + detalle.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura;
        $parrafoSubItem.appendChild($spanSubItem);
        $parrafoSubItem.appendChild($span2SubItem);

        $spanSubItem = document.createElement("span");
        $span2SubItem = document.createElement("span");
        $spanSubItem.textContent = "Total en Existencia: " + detalle.presentacion.existencia + " " + detalle.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura;
        $span2SubItem.textContent = "& " + detalle.presentacion.existencia_otro + " " + detalle.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura;
        $parrafo2SubItem.appendChild($spanSubItem);
        $parrafo2SubItem.appendChild($span2SubItem);


        $divSubItem.appendChild($h4SubItem);
        $divSubItem.appendChild($parrafoSubItem);
        $divSubItem.appendChild($parrafo2SubItem);
        $divItem.appendChild($divSubItem);

        $fragmentVenta.appendChild($divItem)
    });
    document.querySelector('#tbodyProductoC').appendChild($fragmentVenta);
    addEventsPresentacionsC();


}

function validateFormEntrada() {
    if (document.querySelector("#txtFechaFFilterEntrada").value == "") {
        showAlertTopEnd('info', 'Ingresa Fecha Inicial de busqueda');
        return false;
    }
    if (document.querySelector("#txtFechaIFilterEntrada").value == "") {
        showAlertTopEnd('info', 'Ingresa Fecha Final de busqueda');
        return false;
    }
    if (clienteSelected == undefined) {
        showAlertTopEnd('info', 'Selecciona Cliente');
        return false;
    }
    return true;
}

function addEventsPresentacionsC() {
    document.querySelectorAll('.click-selection-presentacionC')
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
    beanPaginationEntradaC.list.forEach((detalle) => {

        if (
            parseInt(idpresentacion) == parseInt(detalle.presentacion.idpresentacion) &&
            parseInt(idpresentacion) > 0
        ) {
            detalle.presentacion.existencia_inicial = detalle.salida.total + detalle.presentacion.existencia;
            detalle.presentacion.existencia_inicial_otro = detalle.salida.total_otro + detalle.presentacion.existencia_otro;
            presentacion_ = detalle.presentacion;
            return;
        }
    });
    return presentacion_;
}
