var beanPaginationCompra;
var beanPaginationDetalleCompra;
var compraSelected;
var presentacionSelected;
var detalle_compraSelected;
var clienteSelected
var metodo = false;
var beanRequestCompra = new BeanRequest();
var contador = 0;
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    //addCompra();

    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestCompra.entity_api = 'api/compras';
    beanRequestCompra.operation = 'paginate';
    beanRequestCompra.type_request = 'GET';

    $('#FrmCompraModal').submit(function (event) {
        if (metodo) {
            beanRequestCompra.operation = 'update';
            beanRequestCompra.type_request = 'PUT';
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestCompra.operation = 'add';
            beanRequestCompra.type_request = 'POST';
        }
        event.preventDefault();
        event.stopPropagation();
        // if (validateFormCompra()) {
        processAjaxCompra();
        // }
    });

    document.querySelector("#btnCancelAddDetalleCompraHtml").onclick = () => {
        listDetalleCompra.length = 0;
        toListDetalleCompra(listDetalleCompra);


    };

    document.querySelector('#checkComprobanteCompra').onchange = function (e) {
        e.target.parentElement.nextElementSibling.classList.toggle("d-none");
    };

    document.querySelector('#selectTipoComprobante').onchange = function (e) {
        processAjaxDocumentoC();
    };

    document.querySelector('#tbodyDocumentoC').onchange = function (e) {
        documentoCSelected = findByDocumentoC(
            e.target.value
        );
        if (documentoCSelected == null) {
            return showAlertTopEnd('warning', 'No se encontraron Comprobantes');
        }
        document.querySelector('#txtNumeroDocumento').value = documentoCSelected.numero_actual;
    };

    document.querySelector("#btnCambiarPagoCompra").onclick = (e) => {
        if (e.target.textContent == "Pagado") {
            removeClass(e.target, "btn-success");
            addClass(e.target, "btn-danger");
            e.target.textContent = "Deuda";
            document.querySelector("#txtTotalDeuda").value = totalPrecioByDetalleCompra().toFixed(
                2);
        } else {
            removeClass(e.target, "btn-danger");
            addClass(e.target, "btn-success");
            e.target.textContent = "Pagado";
            document.querySelector("#txtTotalDeuda").value = 0;
        }

    };
});

/* AJAX */
var processAjaxCompra = (detalle = undefined) => {

    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");

    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestCompra.operation == 'add' ||
        beanRequestCompra.operation == 'update'
    ) {
        circleCargando.container = $(document.querySelector("#tbodyCompraDetalle").parentElement.parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#tbodyCompraDetalle").parentElement);
        eliminarAtributosDetalleCompra();

        listPagoCompra.push(new PagoCompra(
            parseInt(document.querySelector("#txtMetodoPago").value),
            parseFloat(document.querySelector("#txtMontoPagado").value),
            (document.querySelector("#btnCambiarPagoCompra").textContent.toUpperCase().charAt(0) == 'P') ? 1 : 2,
            null
        ));
        json = {
            compra: new Compra(
                parseInt(1),
                getFullDateJava(),
                getFullDateJava(addDays(new Date(), 30)),
                (document.querySelector('#checkComprobanteCompra').checked == false || documentoCSelected == undefined) ? null : documentoCSelected,
                (document.querySelector('#checkComprobanteCompra').checked == false || documentoCSelected == undefined) ? null : parseInt(limpiar_campo(document.querySelector("#txtNumeroDocumento").value)),
                (document.querySelector('#txtObservacionCompra').value == "") ? null : limpiar_campo(document.querySelector("#txtObservacionCompra").value),
                clienteSelected,
                parseFloat(subTotalByDetalleCompra().toFixed(2)),
                parseFloat(totalPrecioByDetalleCompra().toFixed(2)),
                (document.querySelector("#btnCambiarPagoCompra").textContent.toUpperCase().charAt(0) == 'P') ? 1 : 2


            ),
            list: listDetalleCompra,
            list_pago: listPagoCompra
        };

    } else {

        if (detalle == undefined) {
            circleCargando.container = $(document.querySelector("#tbodyCompra").parentElement);
            circleCargando.containerOcultar = $(document.querySelector("#tbodyCompra"));

        } else {
            if (detalle == "detalle-ver") {
                circleCargando.container = $(document.querySelector("#tbodyCompraDetalle").parentElement.parentElement);
                circleCargando.containerOcultar = $(document.querySelector("#tbodyCompraDetalle").parentElement);
            } else {
                circleCargando.container = $(document.querySelectorAll(".popover-body")[0].parentElement);
                circleCargando.containerOcultar = $(document.querySelectorAll(".popover-body")[0]);
            }

        }

    }
    circleCargando.createLoader();
    circleCargando.toggleLoader("show");
    switch (beanRequestCompra.operation) {
        case 'delete':
            parameters_pagination = '/' + compraSelected.idcompra;
            break;
        case 'update':
            json.compra.idcompra = compraSelected.idcompra;
            break;
        case 'add':
            break;

        case 'detalle/paginate':
            parameters_pagination += '?idcompra=' + compraSelected.idcompra;
            break;

        default:
            if (document.querySelector('#txtFilterCompra').value != '') {
                document.querySelector('#pageCompra').value = 1;
            }
            parameters_pagination += '?tipo_compra=4&nombre=' + limpiar_campo(document.querySelector('#txtFilterCompra').value
            ).toLowerCase();
            parameters_pagination += '&fechai=' + document.querySelector('#txtFechaIFilterCompra').value;
            parameters_pagination += '&fechaf=' + document.querySelector('#txtFechaFFilterCompra').value;
            parameters_pagination += '&page=' + document.querySelector('#pageCompra').value;
            parameters_pagination += '&size=' + document.querySelector('#sizePageCompra').value;
            break;
    }
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(beanRequestCompra, json, parameters_pagination,
        circleCargando.loader.firstElementChild);
    xhr.onload = () => {
        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                listDetalleCompra.length = 0;
                toListDetalleCompra(listDetalleCompra);
                document.querySelector('#FrmPresentacionC').dispatchEvent(new Event('submit'));
            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            if (beanRequestCompra.operation == "detalle/paginate") {
                beanPaginationDetalleCompra = beanCrudResponse.beanPagination;
                if (detalle == "detalle-ver") {
                    addClass(document.querySelector("#FrmCompraModal").parentElement, "d-none");
                    addCompra();
                    return;
                }
                //$('[data-toggle="popover"]').popover();
                let row = "";
                beanPaginationDetalleCompra.list.forEach((detalle) => {
                    row += detalle.presentacion.ubicacion_producto.producto.nombre + " - " +
                        detalle.cantidad + " " + detalle.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura + " || ";
                });
                row = row.substring(0, row.length - 3)
                detalle.setAttribute("data-content", row);
                $(detalle).popover("show");

            } else {
                beanPaginationCompra = beanCrudResponse.beanPagination;
                toListCompra(beanPaginationCompra);
            }

        }
    };
};

/* DETALLE SALIDA*/
var newSelected = () => {
    /* VALIDAR PRODUCTO Y PRODUCTOCOLOR*/
    if (presentacionSelected == undefined) {
        return showAlertTopEnd('info', 'Por favor ingrese Producto');
    }
    if (listDetalleCompra.length > 0 && findByClienteDetalleCompra(presentacionSelected.ubicacion_producto.cliente.idcliente) == undefined) {
        return showAlertTopEnd('info', 'Guarda la Entra de Cliente para poder registrar otra compra del nuevo Ciente');
    }
    if (findByPresentacionDetalleCompra(presentacionSelected.idpresentacion) != undefined) {
        return showAlertTopEnd('info', 'Ya Seleccionaste este Producto');
    }

    presentacionSelected.existencia_otro = presentacionSelected.existencia_otro;
    presentacionSelected.existencia_inicial = presentacionSelected.existencia;
    presentacionSelected.existencia_inicial_otro = presentacionSelected.existencia_otro;
    presentacionSelected.existencia = (presentacionSelected.existencia + 1);
    /* OPERACION AGREGAR*/
    listDetalleCompra.push(
        new Detalle_Compra(
            contador++,
            presentacionSelected,
            1,
            presentacionSelected.existencia,
            presentacionSelected.ubicacion_producto.precio_compra * presentacionSelected.ubicacion_producto.producto.factor_conversion,
            0,
            0

        )
    );

    //presentacionSelected = undefined;
    toListDetalleCompra(listDetalleCompra);
};

var cantidadDetalleCompra = (eleme, btn) => {
    if (numeroSepararDecimal(btn.value).length > 0)
        btn.value = parseInt(btn.value);

    if (btn.value < 0) {
        btn.value = 0;
        return false;
    }
    compraSelected = findByDetalleCompra(eleme.getAttribute('iddetalle_compra'));
    if (compraSelected == undefined) return false;
    eliminarDetalleCompra(compraSelected.iddetalle_compra);
    compraSelected.presentacion.existencia = (compraSelected.presentacion.existencia_inicial + parseInt(btn.value));
    listDetalleCompra.push(
        new Object(
            new Detalle_Compra(
                compraSelected.iddetalle_compra,
                compraSelected.presentacion,
                parseInt(btn.value),
                compraSelected.presentacion.existencia_inicial + parseInt(btn.value),
                compraSelected.precio,
                compraSelected.porcentaje_igv,
                compraSelected.tipo_igv,
                compraSelected.descuento
            )
        )
    );
    document.getElementById('txtImporteTotal').innerText = "S/. " + numeroConComas(totalPrecioByDetalleCompra().toFixed(2));
    document.getElementById('txtTotalGravada').innerText = "S/. " + numeroConComas(subTotalByDetalleCompra().toFixed(2));
    document.getElementById('txtIgvTotal').innerText = "S/. " + numeroConComas((totalPrecioByDetalleCompra() - subTotalByDetalleCompra()).toFixed(2));

    document.getElementById('txtMontoPagado').value = totalPrecioByDetalleCompra().toFixed(2);
    document.getElementById('txtTotalPagado').innerText = numeroConComas(totalPrecioByDetalleCompra().toFixed(2));
    eleme.getElementsByTagName("a")[0].text =
        "S/. " +
        numeroConComas((compraSelected.precio * parseFloat(btn.value) * (1 - (compraSelected.porcentaje_igv / 100))).toFixed(2));
    eleme.getElementsByTagName("a")[1].text =
        "S/. " +
        numeroConComas((compraSelected.precio * parseFloat(btn.value)).toFixed(2));

    return true;
};

var precioCompra = (eleme, btn) => {
    if (btn.value < 0) {
        if (numeroSepararDecimal(btn.value).length > 1) {
            btn.value = 0;
        } else {
            btn.value = -1;
            return false;
        }
    }
    compraSelected = findByDetalleCompra(eleme.getAttribute("iddetalle_compra"));
    if (compraSelected == undefined) return false;

    if (
        compraSelected.cantidad *
        ((compraSelected.precio * compraSelected.descuento_minimo) / 100) <
        btn.value
    ) {
        showAlertTopEnd(
            "info",
            "El monto del descuento es superior al descuento mínimo del producto"
        );

        btn.value = (
            compraSelected.cantidad *
            ((compraSelected.precio * compraSelected.descuento_minimo) / 100)
        ).toFixed(2);
    }

    eliminarDetalleCompra(compraSelected.iddetalle_compra);
    listDetalleCompra.push(
        new Object(
            new Detalle_Compra(
                compraSelected.iddetalle_compra,
                compraSelected.presentacion,
                compraSelected.cantidad,
                compraSelected.presentacion.existencia,
                parseFloat(btn.value),
                compraSelected.porcentaje_igv,
                compraSelected.tipo_igv,
                compraSelected.descuento
            )
        )
    );

    eleme.getElementsByTagName("a")[0].text =
        "S/. " +
        numeroConComas((compraSelected.cantidad * parseFloat(btn.value) * (1 - (compraSelected.porcentaje_igv / 100))).toFixed(2));
    eleme.getElementsByTagName("a")[1].text =
        "S/. " +
        numeroConComas((compraSelected.cantidad * parseFloat(btn.value)).toFixed(2));

    document.getElementById('txtImporteTotal').innerText = "S/. " + numeroConComas(totalPrecioByDetalleCompra().toFixed(2));
    document.getElementById('txtTotalGravada').innerText = "S/. " + numeroConComas(subTotalByDetalleCompra().toFixed(2));
    document.getElementById('txtIgvTotal').innerText = "S/. " + numeroConComas((totalPrecioByDetalleCompra() - subTotalByDetalleCompra()).toFixed(2));

    document.getElementById('txtMontoPagado').value = totalPrecioByDetalleCompra().toFixed(2);
    document.getElementById('txtTotalPagado').innerText = numeroConComas(totalPrecioByDetalleCompra().toFixed(2));
    return true;
};

var igvCompra = (eleme, btn) => {
    if (btn.value < 0) {
        if (numeroSepararDecimal(btn.value).length > 1) {
            btn.value = 0;
        } else {
            btn.value = -1;
            return false;
        }
    }

    compraSelected = findByDetalleCompra(eleme.getAttribute('iddetalle_compra'));
    if (compraSelected == undefined) return false;

    eliminarDetalleCompra(compraSelected.iddetalle_compra);

    listDetalleCompra.push(
        new Object(
            new Detalle_Compra(
                compraSelected.iddetalle_compra,
                compraSelected.presentacion,
                compraSelected.cantidad,
                compraSelected.existencia,
                compraSelected.precio,
                parseFloat(btn.value),
                eleme.getElementsByTagName("select")[0].value,
                compraSelected.descuento
            )
        )
    );

    eleme.getElementsByTagName("a")[0].text = "S/. " +
        numeroConComas((compraSelected.precio * compraSelected.cantidad * (1 - (parseFloat(btn.value) / 100))).toFixed(2));

    document.getElementById('txtImporteTotal').innerText = "S/. " + numeroConComas(totalPrecioByDetalleCompra().toFixed(2));
    document.getElementById('txtTotalGravada').innerText = "S/. " + numeroConComas(subTotalByDetalleCompra().toFixed(2));
    document.getElementById('txtIgvTotal').innerText = "S/. " + numeroConComas((totalPrecioByDetalleCompra() - subTotalByDetalleCompra()).toFixed(2));

    return true;
};

var addEventsDetalleCompra = () => {

    document.querySelectorAll('.tipo-porcentaje').forEach((btn) => {
        btn.onchange = () => {
            if (parseInt(btn.value) == 1) {
                removeClass(btn.nextElementSibling, "d-none");
                removeClass(btn.nextElementSibling.nextElementSibling, "d-none");
                btn.nextElementSibling.value = 18;
                let eleme = btn.parentElement.parentElement.parentElement;
                if (igvCompra(eleme, btn.nextElementSibling));

            } else {
                addClass(btn.nextElementSibling, "d-none");
                addClass(btn.nextElementSibling.nextElementSibling, "d-none");
                btn.nextElementSibling.value = 0;
                let eleme = btn.parentElement.parentElement.parentElement;
                if (igvCompra(eleme, btn.nextElementSibling));
            }
        };
    });

    document.querySelectorAll(".porcentaje-igv").forEach(btn => {
        btn.onkeyup = () => {
            if (btn.value == "") return;
            let numero = numero_campo(btn);
            if (numero != undefined) {
                if (numero.value != "") {
                    numero.focus();
                    btn.value = btn.value.substring(1, btn.value.length - 1);
                    showAlertTopEnd(
                        "info",
                        "Por favor ingrese solo numeros al campo"
                    );
                }
                return;
            }
            let eleme = btn.parentElement.parentElement.parentElement;
            if (igvCompra(eleme, btn));
        };
    });


    document.querySelectorAll(".btn-precio-menos").forEach(btn => {
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName("input")[1].value--;

            if (!precioCompra(eleme, eleme.getElementsByTagName("input")[1]))
                eleme.getElementsByTagName("input")[1].value++;

            eleme.getElementsByTagName("input")[1].value = parseFloat(
                eleme.getElementsByTagName("input")[1].value
            ).toFixed(2);
        };
    });
    document.querySelectorAll(".btn-precio-mas").forEach(btn => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName("input")[1].value++;
            if (!precioCompra(eleme, eleme.getElementsByTagName("input")[1]))
                eleme.getElementsByTagName("input")[1].value--;
            eleme.getElementsByTagName("input")[1].value = parseFloat(
                eleme.getElementsByTagName("input")[1].value
            ).toFixed(2);
        };
    });
    document.querySelectorAll(".precio-compra").forEach(btn => {
        btn.onkeyup = () => {
            if (btn.value == "") return;
            let numero = numero_campo(btn);
            if (numero != undefined) {
                if (numero.value != "") {
                    numero.focus();
                    btn.value = btn.value.substring(1, btn.value.length - 1);
                    showAlertTopEnd(
                        "info",
                        "Por favor ingrese solo numeros al campo"
                    );
                }
                return;
            }
            let eleme = btn.parentElement.parentElement.parentElement;
            if (precioCompra(eleme, btn));
        };
    });


    /* mas y menos*/
    document.querySelectorAll('.btn-cantidad-menos').forEach((btn) => {
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName('input')[2].value--;
            if (eleme.getElementsByTagName('input')[2].value < 0)
                return eleme.getElementsByTagName('input')[2].value++;
            if (!cantidadDetalleCompra(eleme, eleme.getElementsByTagName('input')[2]))
                eleme.getElementsByTagName('input')[2].value++;
        };
    });
    document.querySelectorAll('.btn-cantidad-mas').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName('input')[2].value++;
            if (!cantidadDetalleCompra(eleme, eleme.getElementsByTagName('input')[2]))
                eleme.getElementsByTagName('input')[2].value--;
        };
    });
    /* inputs teclado*/
    document.querySelectorAll('.cantidad-compra').forEach((btn) => {
        btn.onkeyup = () => {
            if (btn.value == '') return;

            let numero = numero_campo(btn);
            if (numero != undefined) {
                if (numero.value != '') {
                    numero.focus();
                    btn.value = btn.value.substring(1, btn.value.length - 1);
                    showAlertTopEnd('info', 'Por favor ingrese sólo numeros al campo');
                }
                return;
            }
            let eleme = btn.parentElement.parentElement.parentElement;
            if (cantidadDetalleCompra(eleme, btn));
        };
    });


    /* eliminar compra*/
    document.querySelectorAll('.eliminar-detalle-compra').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            detalle_compraSelected = findByDetalleCompra(
                btn.parentElement.parentElement.parentElement.parentElement.getAttribute(
                    'iddetalle_compra'
                )
            );
            eliminarDetalleCompra(detalle_compraSelected.iddetalle_compra);
            toListDetalleCompra(listDetalleCompra);
        };
    });

};

var totalByDetalleCompra = () => {
    let total = 0;
    listDetalleCompra.forEach(
        (detalle) => {
            total += detalle.cantidad;
        }

    );
    return total;
};

var totalOtroByDetalleCompra = () => {
    let total = 0;
    listDetalleCompra.forEach(
        (detalle) => {
            total += detalle.cantidad_otro;
        }

    );
    return total;
};

var totalPrecioByDetalleCompra = () => {
    let total = 0;
    listDetalleCompra.forEach(
        (detalle) => {
            total += (detalle.cantidad * detalle.precio);
        }

    );
    return total;
};

var subTotalByDetalleCompra = () => {
    let total = 0;
    listDetalleCompra.forEach(
        (detalle) => {
            total += (detalle.precio * detalle.cantidad * (1 - (detalle.porcentaje_igv / 100)));
        }

    );
    return total;
};

var findByDetalleCompra = (iddetalle_compra) => {

    return listDetalleCompra.find(
        (detalle) => {
            if (parseInt(iddetalle_compra) == detalle.iddetalle_compra) {
                return detalle;
            }


        }
    );
};

var findByClienteDetalleCompra = (idcliente) => {

    return listDetalleCompra.find(
        (detalle) => {
            if (parseInt(idcliente) == detalle.presentacion.ubicacion_producto.cliente.idcliente) {
                return detalle;
            }


        }
    );
};

var findByPresentacionDetalleCompra = (idpresentacion) => {

    return listDetalleCompra.find(
        (detalle) => {
            if (parseInt(idpresentacion) == detalle.presentacion.idpresentacion) {
                return detalle;
            }


        }
    );
};

function findIndexDetalleCompra(idbusqueda) {
    return listDetalleCompra.findIndex(
        (cargo) => {
            if (cargo.iddetalle_compra == parseInt(idbusqueda))
                return cargo;


        }
    );
}

var eliminarDetalleCompra = (idbusqueda) => {
    listDetalleCompra.splice(findIndexDetalleCompra(parseInt(idbusqueda)), 1);

};

var toListDetalleCompra = (beanPagination) => {
    document.getElementById('tbodyCompraDetalle').innerHTML = "";
    let row;
    let sumaTotal = 0,
        sumaTotalOtro = 0,
        sumaTotalPrecio = 0;
    if (beanPagination.length == 0) {
        row = `
  <!-- Widget Item -->
  <div class="dt-widget__item border-bottom pr-4">
    <!-- Widget Info -->
    <div class="dt-widget__info text-truncate ">
      <div class="dt-card__title text-left">
        <cite class="f-12" title="lISTA VACÍA">No hay Productos</cite>
      </div>
    </div>
    <!-- /widget info -->

  </div>
  <!-- /widgets item -->
  `;
        document.getElementById('txtTotalGravada').innerHTML = sumaTotal;
        document.getElementById('txtIgvTotal').innerHTML = sumaTotalOtro;
        document.getElementById('txtImporteTotal').innerHTML = sumaTotalPrecio;
        document.getElementById('tbodyCompraDetalle').innerHTML += row;
        return;
    }

    beanPagination.forEach((detalle_compra) => {
        sumaTotal += detalle_compra.cantidad;
        sumaTotalOtro += (detalle_compra.cantidad * detalle_compra.precio * (1 - (detalle_compra.porcentaje_igv / 100)));

        sumaTotalPrecio += detalle_compra.cantidad * detalle_compra.precio;

        row = `
			<!-- Widget Item -->
			<div class="dt-widget__item pt-1 pb-1 pr-4 border-bottom" iddetalle_compra="${
            detalle_compra.iddetalle_compra
            }">

			<!-- Widget Extra -->
				<div class="dt-widget__extra">
					<!-- Hide Content -->
					<div class="hide-content">
						<!-- Action Button Group -->
						<div class="action-btn-group mr-2" style="margin-left: -30px;">
							<button  class="btn btn-default text-danger dt-fab-btn eliminar-detalle-compra"
							data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Eliminar</em>">
								<i class="icon icon-trash-filled icon-lg pulse-danger"></i>
							</button>
						</div>
						<!-- /action button group -->
					</div>
					<!-- /hide content -->
				</div>
			<!-- /widget extra -->

				<!-- Widget Info -->
				<div class="dt-widget__info" >
          <div class="dt-widget__title text-left">${
            detalle_compra.presentacion.ubicacion_producto.producto.nombre

            }
					</div>
					<span class="dt-widget__subtitle">
					${ detalle_compra.presentacion.ubicacion_producto.producto.codigo
            }</span>
				</div>
        <!-- /widget info -->
        <!-- Widget Info -->
				<div class="dt-widget__info">
          <div class="dt-widget__title pl-2 pr-2">
          ${ detalle_compra.presentacion.ubicacion_producto.codigo
            }
          </div>
          <span class="dt-widget__subtitle pl-2 pr-2">
					${detalle_compra.presentacion.ubicacion_producto.almacen.nombre
            }</span>
				</div>
        <!-- /widget info -->
      	<!-- Widget Info -->
				<div class="dt-widget__info text-right pl-2 pr-2 border-right border-left" style="min-width: 145px;">
					<div class="input-group search-box right-side-icon">
						    <select class="form-control form-control-sm w-100 mb-2 tipo-porcentaje">
                      <option value="0">Sin IGV</option>
                      <option value="1">Incluye IGV</option>
                </select>
						<input class="form-control form-control-sm porcentaje-igv p-1 d-none"
						value="${numeroConComas(
                detalle_compra.porcentaje_igv
            )}" type="text" style="height: 27px;">

            <div class="input-group-append d-none" style="height: 27px;">
            <span class="border p-1">%</span>
            </div>
          </div>
          
				</div>
        <!-- /widget info -->
        
        <!-- Widget Info -->
				<div class="dt-widget__info text-right pl-2 pr-2 " style="min-width: 180px;">
					<div class="input-group search-box right-side-icon">
						<div class="input-group-prepend" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-precio-menos molino-cursor-mano"> <i
              class="icon icon-minus icon-2x"></i></span>
              <span class="btn m-0 p-0 btn-light">s/. </span>
						</div>

						<input class="form-control form-control-sm precio-compra p-1"
						value="${numeroConComas(detalle_compra.precio)}" type="text" style="height: 27px;">

						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-precio-mas molino-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
            </div>
            <span class="dt-widget__title ml-2 align-self-center" >x ${detalle_compra.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}</span>
          </div>
          
				</div>
        <!-- /widget info -->
        
				<!-- Widget Info -->
        <div class="dt-widget__info text-right pl-2 pr-2 border-left border-right" style="min-width: 150px;">
					<div class="input-group search-box right-side-icon">
						<div class="input-group-prepend" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-cantidad-menos molino-cursor-mano"> <i
							class="icon icon-minus icon-2x"></i></span>
						</div>

						<input class="form-control form-control-sm cantidad-compra p-1"
						value="${numeroConComas(
                detalle_compra.cantidad
            )}" type="text" style="height: 27px;">

						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-cantidad-mas molino-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
            </div>
            <span class="dt-widget__title ml-2 align-self-center" >${detalle_compra.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}</span>
          </div>

				</div>
        <!-- /widget info -->
        
        <!-- Widget Info -->
				<div class="dt-widget__info" style="min-width: 100px;">
          <div class="dt-widget__title  text-right">	
          <a href="javascript:void(0)">S/. ${numeroConComas((detalle_compra.cantidad * detalle_compra.precio * (1 - (detalle_compra.porcentaje_igv / 100))).toFixed(2))
            }</a>
					</div>
				</div>
        <!-- /widget info -->
        <!-- Widget Info -->
				<div class="dt-widget__info" style="min-width: 100px;">
          <div class="dt-widget__title border-left text-right">	
          <a href="javascript:void(0)">S/. ${numeroConComas((detalle_compra.cantidad * detalle_compra.precio).toFixed(2))
            }</a>
					</div>
				</div>
        <!-- /widget info -->
			</div>
			<!-- /widgets item -->
			`;
        document.getElementById('tbodyCompraDetalle').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });

    document.getElementById('txtTotalGravada').innerHTML = sumaTotalOtro;
    document.getElementById('txtIgvTotal').innerHTML = sumaTotalPrecio - sumaTotalOtro;

    document.getElementById('txtImporteTotal').innerHTML = "S/. " + numeroConComas(sumaTotalPrecio.toFixed(2));
    document.getElementById('txtMontoPagado').value = parseFloat(sumaTotalPrecio).toFixed(2);
    document.getElementById('txtTotalPagado').innerText = numeroConComas(sumaTotalPrecio.toFixed(2));
    addEventsDetalleCompra();
};

var eliminarAtributosDetalleCompra = () => {
    listDetalleCompra.forEach(function (obj) {
        delete obj.presentacion['existencia_inicial'];
        delete obj.presentacion['existencia_inicial_otro'];
    });
};

//FACTURA


