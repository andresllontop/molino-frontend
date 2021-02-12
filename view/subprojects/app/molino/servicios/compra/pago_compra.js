var beanPaginationPagoCompra;
var pagoCompraSelected;
var beanRequestPagoCompra = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestPagoCompra.entity_api = 'api/compras/pago';
    $('#FrmPagoCompraModal').submit(function (event) {
        beanRequestPagoCompra.operation = 'update';
        beanRequestPagoCompra.type_request = 'PUT';
        processAjaxPagoCompra();
        event.preventDefault();
        event.stopPropagation();
    });
});

function processAjaxPagoCompra() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestPagoCompra.operation == 'update' ||
        beanRequestPagoCompra.operation == 'add'
    ) {
        json = {
            metodo_pago: parseInt(document.querySelector('#txtMetodoPagoCompra').value.trim()),
            monto: parseFloat(document.querySelector('#txtMontoPagadoCompra').value.trim()),
            estado: 1,
            referencia: null,
            compra: { idcompra: compraSelected.idcompra }
        };
        circleCargando.container = $(document.querySelector("#btnCambiarPagoCompra").parentElement.parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#btnCambiarPagoCompra").parentElement);
        circleCargando.createLoader();
    } else {
        circleCargando.containerOcultar = $(document.querySelector("#modalPagoCompra").children[0].children[0]);
        circleCargando.container = $(document.querySelector("#modalPagoCompra").children[0].children[0].children[1]);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestPagoCompra.operation) {
        case 'update':
            json.idpago_compra = pagoCompraSelected.idpago_compra;
            break;
        case 'add':
            break;

        default:
            parameters_pagination +=
                '?idcompra=' + compraSelected.idcompra;
            parameters_pagination +=
                '&page=1';
            parameters_pagination +=
                '&size=10';
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestPagoCompra,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestPagoCompra.operation == "delete") {
                    eliminarlistOficina(oficinaSelected.idoficina);
                    toListOficina(beanPaginationOficina);
                }
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                $('#modalPagoCompra').modal('hide');
            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.list !== undefined) {
            beanPaginationPagoCompra = beanCrudResponse;
            pagoCompraSelected = beanPaginationPagoCompra.list[0];
            addPagoCompra(pagoCompraSelected);
        }

    }, false);
}

function addPagoCompra(pagoCompra) {
    document.querySelector("#txtMetodoPagoCompra").value = pagoCompra.metodo_pago;
    document.querySelector("#txtMontoPagadoCompra").value = pagoCompra.monto;

    if (pagoCompra.estado == 1) {
        removeClass(document.querySelector("#FrmPagoCompraModal").children[0], "btn-danger");
        addClass(document.querySelector("#FrmPagoCompraModal").children[0], "btn-success");
    } else {
        removeClass(document.querySelector("#FrmPagoCompraModal").children[0], "btn-success");
        addClass(document.querySelector("#FrmPagoCompraModal").children[0], "btn-danger");
    }




}