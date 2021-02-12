
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    //addPrestamo();
    beanRequestPrestamo.entity_api = 'api/prestamos';
    beanRequestPrestamo.operation = 'paginate';
    beanRequestPrestamo.type_request = 'GET';
    processAjaxPrestamo();
    $('#FrmPrestamo').submit(function (event) {

        beanRequestPrestamo.operation = 'paginate';
        beanRequestPrestamo.type_request = 'GET';
        processAjaxPrestamo();
        event.preventDefault();
        event.stopPropagation();

    });

    $('#sizePagePrestamo').change(function () {
        beanRequestPrestamo.operation = 'paginate';
        beanRequestPrestamo.type_request = 'GET';
        processAjaxPrestamo();
    });

    /* FECHAS*/
    $('#txtFechaIFilterPrestamo').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: removeDays(new Date(), 30),
        lang: 'es',
        icons: calIcons
    });


    $('#txtFechaIFilterPrestamo').on('keyup.datetimepicker', function (e) {
        console.log(e.target.value);
        let valordate = e.target.value;
        valordate = eliminarCaracteres(valordate, "/");
        if (!(/^[0-9]*$/.test(valordate))) {
            return;
        }

        if (valordate.length > 0 && valordate.length <= 2) {
            if (valordate.length == 2) {
                e.target.value = valordate.concat("/");
            } else {
                e.target.value = valordate.concat("");
            }

        }
        if (valordate.length > 2 && valordate.length <= 4) {
            e.target.value = valordate.concat("/");
        }

        if (valordate.length > 4 && valordate.length <= 8) {
            e.target.value = valordate.concat("/");
        } else {

        }


    });


    /* FECHAS*/
    $('#txtFechaFFilterPrestamo').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date(),
        lang: 'es',
        icons: calIcons

    });


    document.querySelector('#btnEliminarFechaIFilterPrestamo').onclick = function () {

        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaIFilterPrestamo').value = '';
    };

    document.querySelector('#btnEliminarFechaFFilterPrestamo').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaFFilterPrestamo').value = '';
    };


});

var addPrestamo = (prestamo = undefined) => {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtFechaDesembolsoPrestamo').value = (prestamo == undefined ? getDateJava() : prestamo.fecha);
    document.querySelector('#txtTasaEfectivaPrestamo').value = (prestamo == undefined ? '' : prestamo.tasa_porcentaje);
    document.querySelector('#txtPlazoCuotaPrestamo').value = (prestamo == undefined ? '' : prestamo.plazo);
    document.querySelector('#txtTceaPrestamo').value = "";
    document.querySelector('#txtMontoSolicitadoPrestamo').value = (prestamo == undefined ? '' : prestamo.monto);
    document.querySelector('#txtDiaPagoPrestamo').value = (prestamo == undefined ? '' : prestamo.dia_plazo);
    document.querySelector('#txtTipoCronogramaPrestamo').value = (prestamo == undefined ? 1 : prestamo.tipo_cronograma);
    document.querySelector('#txtTipoGraciaPrestamo').value = (prestamo == undefined ? 1 : 1);
    document.querySelector('#txtTipoFechaPrestamo').value = (prestamo == undefined ? 1 : prestamo.tipo_fecha);
    document.querySelector('#txtMontoSeguroPrestamo').value = (prestamo == undefined ? '' : (prestamo.suma_seguro / prestamo.plazo));
    document.querySelector('#txtITFPrestamo').value = (prestamo == undefined ? '0.005' : (prestamo.suma_itf / prestamo.plazo));

    clienteSelected = (prestamo == undefined ? undefined : prestamo.cliente);
    document.querySelector('#txtClienteUbicacionProducto').value = (prestamo == undefined ? '' : (prestamo.cliente.apellido + " " + prestamo.cliente.nombre));

};

var toListPrestamo = (beanPagination) => {
    document.querySelector('#tbodyPrestamo').innerHTML = '';
    document.querySelector('#titleManagerPrestamo').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] PRESTAMOS';
    let row;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationPrestamo'));
        row = `
      <!-- Widget Item -->
      <div class="dt-widget__item border-bottom pr-4">
        <!-- Widget Info -->
        <div class="dt-widget__info  ">
          <div class="dt-card__title text-left">
            <cite class="f-12" title="lISTA VACÍA">No hay Préstamos</cite>
          </div>
        </div>
        <!-- /widget info -->
  
      </div>
      <!-- /widgets item -->
      `;
        document.querySelector('#tbodyPrestamo').innerHTML += row;
        showAlertTopEnd('warning', 'No se encontraron resultados');
        return;
    }

    beanPagination.list.forEach((prestamo) => {
        row = `
                  <!-- Widget Item -->
                  <div class="dt-widget__item pr-2">
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${prestamo.fecha}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle" >${prestamo.cliente.nombre}
                      </p>
                      <p class="dt-widget__subtitle " >
                     ${prestamo.cliente.documento}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info text-center">
                      <p class="dt-widget__subtitle ">S/. ${prestamo.monto} 
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info text-center" >
                        <p class="dt-widget__subtitle text-center">${prestamo.plazo}
                        </p>
                      <p class="dt-widget__subtitle text-center">${tipoCronogramaPrestamo(prestamo.tipo_cronograma)}
                      </p>
                    </div>
                    <!-- /widget info -->
                   
                    <!-- Widget Info -->
                    <div class="dt-widget__info text-center">
                      <p class="dt-widget__subtitle " >
                      S/. ${ numeroConComas(redondearDecimal(prestamo.suma_cuota))} 
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Extra -->
                    <div class="dt-widget__extra">
                    <div class="dt-task" style="min-width: 85px;">
                    <div class="dt-task__redirect">
                      <!-- Action Button Group -->
                      <div class="action-btn-group">
                        <button
                          type="button"
                          class="btn btn-default text-info dt-fab-btn editar-prestamo" idprestamo_cliente='${prestamo.idprestamo_cliente}'
                          data-toggle="tooltip"
                          data-html="true"
                          title=""
                          data-original-title="<em>Editar</em>"
                        >
                          <i class="icon icon-editors  icon-1x"></i>
                        </button>
                        <button
                        type="button"
                        class="btn btn-default text-danger dt-fab-btn eliminar-prestamo" idprestamo_cliente='${prestamo.idprestamo_cliente}'
                        data-toggle="tooltip"
                        data-html="true"
                        title=""
                        data-original-title="<em>Eliminar</em>"
                      >
                        <i class="icon icon-circle-remove-o icon-1x"></i>
                      </button>
                        </div>
                      <!-- /action button group -->
                    </div>
                    </div>
                    <!-- /widget extra -->
                  </div>
                  <!-- /widgets item -->
              `;
        document.querySelector('#tbodyPrestamo').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });

    addEventsPrestamos();
    beanRequestPrestamo.operation = 'paginate';
    beanRequestPrestamo.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePagePrestamo').value),
        document.querySelector('#pagePrestamo'),
        processAjaxPrestamo, beanRequestPrestamo,
        $('#paginationPrestamo')
    );

};

var addEventsPrestamos = () => {
    document.querySelectorAll('.editar-prestamo').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            prestamoSelected = findByPrestamo(btn.getAttribute('idprestamo_cliente'));
            if (prestamoSelected != undefined) {
                beanRequestPrestamo.operation = 'update';
                beanRequestPrestamo.type_request = 'PUT';

                document.querySelector('#TituloModalPrestamo').innerHTML =
                    'EDITAR PRESTAMO';
                addPrestamo(prestamoSelected);
                displayPrestamo("show");
                processAjaxSeguroC();
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la prestamo para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-prestamo').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            prestamoSelected = findByPrestamo(btn.getAttribute('idprestamo_cliente'));
            beanRequestPrestamo.operation = 'delete';
            beanRequestPrestamo.type_request = 'DELETE';
            processAjaxPrestamo();
        };
    });

};

function eliminarlistPrestamo(idbusqueda) {
    beanPaginationPrestamo.count_filter--;
    beanPaginationPrestamo.list.splice(findIndexPrestamo(parseInt(idbusqueda)), 1);
}

function updatelistPrestamo(classBean) {
    beanPaginationPrestamo.list.splice(findIndexPrestamo(classBean.idprestamo_cliente), 1, classBean);
}

function findIndexPrestamo(idbusqueda) {
    return beanPaginationPrestamo.list.findIndex(
        (prestamo) => {
            if (prestamo.idprestamo_cliente == parseInt(idbusqueda))
                return prestamo;


        }
    );
}

function findByPrestamo(idprestamo) {
    return beanPaginationPrestamo.list.find(
        (prestamo) => {
            if (parseInt(idprestamo) == prestamo.idprestamo_cliente) {
                return prestamo;
            }


        }
    );
}


var displayPrestamo = (display = "hide") => {

    if (display == "show") {
        removeClass(document.querySelector("#addPrestamoHtml"), "d-none");
        addClass(document.querySelector("#listPrestamoHtml"), "d-none");

    } else {
        removeClass(document.querySelector("#listPrestamoHtml"), "d-none");
        addClass(document.querySelector("#addPrestamoHtml"), "d-none");

    }

}
var tipoFechaPrestamo = (key) => {
    switch (key) {
        case 1:

            return "Fecha Fija";
        case 2:

            return "Fecha Relativa";

        default:
            return "";
    }
}
var tipoCronogramaPrestamo = (key) => {
    switch (key) {
        case 1:

            return "Mensual";
        case 2:

            return "Quincenal";
        case 3:

            return "Trimestral";

        default:
            return "";
    }
}