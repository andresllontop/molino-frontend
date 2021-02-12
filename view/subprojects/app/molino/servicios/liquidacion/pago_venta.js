var beanPaginationPagoVenta;
var pagoVentaSelected;
var beanRequestPagoVenta = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestPagoVenta.entity_api = 'api/ventas/pago';
    $('#FrmPagoVentaModal').submit(function (event) {
        beanRequestPagoVenta.operation = 'update';
        beanRequestPagoVenta.type_request = 'PUT';
        processAjaxPagoVenta();
        event.preventDefault();
        event.stopPropagation();
    });
});

function processAjaxPagoVenta() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestPagoVenta.operation == 'update' ||
        beanRequestPagoVenta.operation == 'add'
    ) {
        json = {
            metodo_pago: parseInt(document.querySelector('#txtMetodoPagoVenta').value.trim()),
            monto: parseFloat(document.querySelector('#txtMontoPagadoVenta').value.trim()),
            estado: 1,
            referencia: null,
            venta: { idventa: ventaSelected.idventa }
        };
        circleCargando.container = $(document.querySelector("#btnCambiarPagoVenta").parentElement.parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#btnCambiarPagoVenta").parentElement);
        circleCargando.createLoader();
    } else {
        circleCargando.containerOcultar = $(document.querySelector("#modalPagoVenta").children[0].children[0]);
        circleCargando.container = $(document.querySelector("#modalPagoVenta").children[0].children[0].children[1]);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestPagoVenta.operation) {
        case 'update':
            json.idpago_venta = pagoVentaSelected.idpago_venta;
            break;
        case 'add':
            break;

        default:
            parameters_pagination +=
                '?idventa=' + ventaSelected.idventa;
            parameters_pagination +=
                '&page=1';
            parameters_pagination +=
                '&size=10';
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestPagoVenta,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestPagoVenta.operation == "delete") {
                    eliminarlistOficina(oficinaSelected.idoficina);
                    toListOficina(beanPaginationOficina);
                }
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                $('#modalPagoVenta').modal('hide');
            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.list !== undefined) {
            beanPaginationPagoVenta = beanCrudResponse;
            pagoVentaSelected = beanPaginationPagoVenta.list[0];
            addPagoVenta(pagoVentaSelected);
        }

    }, false);
}

function addPagoVenta(pagoVenta) {
    document.querySelector("#txtMetodoPagoVenta").value = pagoVenta.metodo_pago;
    document.querySelector("#txtMontoPagadoVenta").value = pagoVenta.monto;

    if (pagoVenta.estado == 1) {
        removeClass(document.querySelector("#FrmPagoVentaModal").children[0], "btn-danger");
        addClass(document.querySelector("#FrmPagoVentaModal").children[0], "btn-success");
    } else {
        removeClass(document.querySelector("#FrmPagoVentaModal").children[0], "btn-success");
        addClass(document.querySelector("#FrmPagoVentaModal").children[0], "btn-danger");
    }




}