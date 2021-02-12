var beanPaginationSalida;
var salidaSelected;
var presentacionSelected;
var detalle_salidaSelected;
var clienteSelected;
var documentoSelected;
var metodo = false;
var beanRequestSalida = new BeanRequest();
var contador = 0;
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    //addSalida();

    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestSalida.entity_api = 'api/salidas';
    beanRequestSalida.operation = 'paginate';
    beanRequestSalida.type_request = 'GET';

    $('#FrmSalidaModal').submit(function (event) {
        if (metodo) {
            beanRequestSalida.operation = 'update';
            beanRequestSalida.type_request = 'PUT';
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestSalida.operation = 'add';
            beanRequestSalida.type_request = 'POST';
        }
        event.preventDefault();
        event.stopPropagation();
        // if (validateFormSalida()) {
        processAjaxSalida();
        // }
    });
    document.querySelector('#btnAbrirNewSalida').onclick = function () {
        metodo = false;
        $('[data-toggle="tooltip"]').tooltip("hide");
        removeClass(document.querySelector('#txtClienteUbicacionProducto').nextElementSibling, "d-none");
        removeClass(document.querySelector("#FrmSalidaModal").parentElement, "d-none");
        addSalida();
        listDetalleSalida = [];
        toListDetalleSalida(listDetalleSalida);
        displaySalida("show");
    };
    document.querySelector(".cerrar-salida").onclick = () => {
        displaySalida("hide");
        beanRequestSalida.operation = 'paginate';
        beanRequestSalida.type_request = 'GET';
        processAjaxSalida();

    };
    document.querySelector("#btnCancelAddDetalleSalidaHtml").onclick = () => {
        listDetalleSalida.length = 0;
        toListDetalleSalida(listDetalleSalida);


    };

    document.querySelector('#checkComprobanteSalida').onchange = function (e) {
        e.target.parentElement.nextElementSibling.classList.toggle("d-none");
    };




    $('#txtFechaEmisionSalida').datetimepicker({
        format: 'DD/MM/YYYY HH:mm:ss',
        defaultDate: new Date(),
        locale: 'es',
        icons: calIcons

    });


});

var processAjaxSalida = () => {
    eliminarAtributosDetalleSalida();
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestSalida.operation == 'add' ||
        beanRequestSalida.operation == 'update'
    ) {

        if (document.querySelector('#checkComprobanteSalida').checked == true) {
            if (documentoSelected != undefined) {
                documentoSelected.numero_actual = parseInt(limpiar_campo(document.querySelector("#txtNumeroDocumento").value));
                if (documentoSelected.numero_actual == documentoSelected.numero_final) {
                    documentoSelected.estado = 2;
                }

            } else {
                showAlertTopEnd('warning', 'por favor, selecciona Comprobante.');
            }

        } else {
            documentoSelected = undefined;
        }

        json = {
            salida: new Salida(
                parseInt(1),
                getFullDateJava(),
                (documentoSelected == undefined) ? null : documentoSelected,
                (documentoSelected == undefined) ? null : parseInt(limpiar_campo(document.querySelector("#txtNumeroDocumento").value)),
                (document.querySelector('#txtObservacionSalida').value == "") ? null : limpiar_campo(document.querySelector("#txtObservacionSalida").value),
                clienteSelected,
                totalByDetalleSalida(),
                totalOtroByDetalleSalida(),
                parseInt(1)
            ),
            list: listDetalleSalida
        };
        circleCargando.container = $(document.querySelector("#tbodySalidaDetalle").parentElement.parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#tbodySalidaDetalle").parentElement);

    } else {
        circleCargando.container = $(document.querySelector("#tbodySalida").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#tbodySalida"));
    }
    circleCargando.createLoader();
    circleCargando.toggleLoader("show");
    switch (beanRequestSalida.operation) {
        case 'delete':
            parameters_pagination = '/' + salidaSelected.idsalida;
            break;
        case 'update':
            json.salida.idsalida = salidaSelected.idsalida;
            break;
        case 'add':
            json.salida.servicio_estado = 0;
            break;

        default:
            if (document.querySelector('#txtFilterSalida').value != '') {
                document.querySelector('#pageSalida').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterSalida').value
                ).toLowerCase();
            parameters_pagination +=
                '&fechai=' + document.querySelector('#txtFechaIFilterSalida').value;
            parameters_pagination +=
                '&fechaf=' + document.querySelector('#txtFechaFFilterSalida').value;
            parameters_pagination +=
                '&page=' + document.querySelector('#pageSalida').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageSalida').value;
            break;
    }
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(beanRequestSalida, json, parameters_pagination,
        circleCargando.loader.firstElementChild);
    xhr.onload = () => {
        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                addSalida();
                notifyUser('Acción realizada exitosamente!.');
                listDetalleSalida.length = 0;
                toListDetalleSalida(listDetalleSalida);

                /* document.querySelector('#FrmPresentacionC').dispatchEvent(new Event('submit'));*/
            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationSalida = beanCrudResponse.beanPagination;
            toListSalida(beanPaginationSalida);
        }
    };
};

/* DETALLE SALIDA*/
var newSelected = () => {
    /* VALIDAR PRODUCTO Y PRODUCTOCOLOR*/
    if (presentacionSelected == undefined) {
        return showAlertTopEnd('info', 'Por favor ingrese Producto');
    }
    if (listDetalleSalida.length > 0 && findByClienteDetalleSalida(presentacionSelected.ubicacion_producto.cliente.idcliente) == undefined) {
        return showAlertTopEnd('info', 'Guarda la Entra de Cliente para poder registrar otra salida del nuevo Ciente');
    }
    if (findByPresentacionDetalleSalida(presentacionSelected.idpresentacion) != undefined) {
        return showAlertTopEnd('info', 'Ya Seleccionaste este Producto');
    }


    presentacionSelected.existencia_otro = presentacionSelected.existencia_otro;
    presentacionSelected.existencia_inicial = presentacionSelected.existencia;
    presentacionSelected.existencia_inicial_otro = presentacionSelected.existencia_otro;
    presentacionSelected.existencia = (presentacionSelected.existencia - 1);
    /* OPERACION AGREGAR*/
    listDetalleSalida.push(
        new Detalle_Salida(
            contador++,
            presentacionSelected,
            presentacionSelected.ubicacion_producto.producto.factor_conversion,
            1,
            0,
            presentacionSelected.existencia,
            presentacionSelected.existencia_otro,
            presentacionSelected.ubicacion_producto.precio_servicio,
            presentacionSelected.ubicacion_producto.precio_venta

        )
    );

    //presentacionSelected = undefined;
    toListDetalleSalida(listDetalleSalida);
};

var cantidadDetalleSalida = (eleme, btn) => {
    if (numeroSepararDecimal(btn.value).length > 1)
        btn.value = parseInt(btn.value);

    if (btn.value < 0) {
        btn.value = 0;
        return false;
    }
    salidaSelected = findByDetalleSalida(
        eleme.getAttribute('iddetalle_salida')
    );
    if (salidaSelected == undefined) return false;
    eliminarDetalleSalida(salidaSelected.iddetalle_salida);

    salidaSelected.presentacion.existencia = (salidaSelected.presentacion.existencia_inicial - parseInt(btn.value));

    listDetalleSalida.push(
        new Object(
            new Detalle_Salida(
                salidaSelected.iddetalle_salida,
                salidaSelected.presentacion,
                salidaSelected.factor_conversion,
                parseInt(btn.value),
                salidaSelected.cantidad_otro,
                salidaSelected.presentacion.existencia_inicial - parseInt(btn.value),
                salidaSelected.existencia_otro,
                salidaSelected.precio_servicio,
                salidaSelected.precio

            )
        )
    );
    document.getElementById('txtTotal1').innerText = totalByDetalleSalida();
    document.getElementById('txtTotal3').innerText = "S/. " + numeroConComas(totalPrecioByDetalleSalida().toFixed(
        2));
    eleme.getElementsByTagName("a")[0].text =
        "S/. " +
        numeroConComas(
            (salidaSelected.precio_servicio * parseInt(btn.value) * salidaSelected.factor_conversion +
                salidaSelected.precio_servicio * salidaSelected.cantidad_otro).toFixed(
                    2
                )
        );
    return true;
};

var cantidadOtroDetalleSalida = (eleme, btn) => {
    if (numeroSepararDecimal(btn.value).length > 1)
        btn.value = parseInt(btn.value);

    if (btn.value < 0) {
        btn.value = 0;
        return false;
    }
    salidaSelected = findByDetalleSalida(
        eleme.getAttribute('iddetalle_salida')
    );
    if (salidaSelected == undefined) return false;
    eliminarDetalleSalida(salidaSelected.iddetalle_salida);

    salidaSelected.presentacion.existencia_otro = (salidaSelected.presentacion.existencia_inicial_otro - parseInt(btn.value));

    listDetalleSalida.push(
        new Object(
            new Detalle_Salida(
                salidaSelected.iddetalle_salida,
                salidaSelected.presentacion,
                salidaSelected.factor_conversion,
                salidaSelected.cantidad,
                parseInt(btn.value),
                salidaSelected.existencia,
                salidaSelected.presentacion.existencia_inicial_otro - parseInt(btn.value),
                salidaSelected.precio_servicio,
                salidaSelected.precio

            )
        )
    );
    document.getElementById('txtTotal2').innerText = totalOtroByDetalleSalida();
    document.getElementById('txtTotal3').innerText = "S/. " + numeroConComas(totalPrecioByDetalleSalida().toFixed(
        2));
    eleme.getElementsByTagName("a")[0].text =
        "S/. " +
        numeroConComas(
            (salidaSelected.precio_servicio * salidaSelected.cantidad * salidaSelected.factor_conversion +
                salidaSelected.precio_servicio * parseInt(btn.value)).toFixed(
                    2
                )
        );
    return true;
};

var precioSalida = (eleme, btn) => {
    if (btn.value < 0) {
        if (numeroSepararDecimal(btn.value).length > 1) {
            btn.value = 0;
        } else {
            btn.value = -1;
            return false;
        }
    }
    salidaSelected = findByDetalleSalida(eleme.getAttribute("iddetalle_salida"));
    if (salidaSelected == undefined) return false;


    eliminarDetalleSalida(salidaSelected.iddetalle_salida);
    listDetalleSalida.push(
        new Object(
            new Detalle_Salida(
                salidaSelected.iddetalle_salida,
                salidaSelected.presentacion,
                salidaSelected.factor_conversion,
                salidaSelected.cantidad,
                salidaSelected.cantidad_otro,
                salidaSelected.existencia,
                salidaSelected.existencia_otro,
                parseFloat(btn.value),
                salidaSelected.precio
            )
        )
    );

    eleme.getElementsByTagName("input")[1].value =
        (parseFloat(btn.value) * salidaSelected.factor_conversion).toFixed(
            2
        )
        ;

    eleme.getElementsByTagName("a")[0].text =
        "S/. " +
        numeroConComas(
            (salidaSelected.cantidad * parseFloat(btn.value) * salidaSelected.factor_conversion + salidaSelected.cantidad_otro * parseFloat(btn.value)).toFixed(
                2
            )
        );
    document.getElementById('txtTotal3').innerText = "S/. " + numeroConComas(totalPrecioByDetalleSalida().toFixed(
        2));
    return true;
};

var precioSalidaOtro = (eleme, btn) => {
    if (btn.value < 0) {
        if (numeroSepararDecimal(btn.value).length > 1) {
            btn.value = 0;
        } else {
            btn.value = -1;
            return false;
        }
    }
    salidaSelected = findByDetalleSalida(eleme.getAttribute("iddetalle_salida"));
    if (salidaSelected == undefined) return false;


    eliminarDetalleSalida(salidaSelected.iddetalle_salida);
    listDetalleSalida.push(
        new Object(
            new Detalle_Salida(
                salidaSelected.iddetalle_salida,
                salidaSelected.presentacion,
                salidaSelected.factor_conversion,
                salidaSelected.cantidad,
                salidaSelected.cantidad_otro,
                salidaSelected.existencia,
                salidaSelected.existencia_otro,
                parseFloat(btn.value) / salidaSelected.factor_conversion,
                salidaSelected.precio
            )
        )
    );
    eleme.getElementsByTagName("input")[0].value =
        (parseFloat(btn.value) / salidaSelected.factor_conversion).toFixed(
            2
        )
        ;
    eleme.getElementsByTagName("a")[0].text =
        "S/. " +
        numeroConComas(
            (salidaSelected.cantidad * parseFloat(btn.value) + salidaSelected.cantidad_otro * parseFloat(btn.value) / salidaSelected.factor_conversion).toFixed(
                2
            )
        );
    document.getElementById('txtTotal3').innerText = "S/. " + numeroConComas(totalPrecioByDetalleSalida().toFixed(
        2));
    return true;
};

var addEventsDetalleSalida = () => {


    document.querySelectorAll(".btn-precio-menos").forEach(btn => {
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName("input")[0].value--;

            if (!precioSalida(eleme, eleme.getElementsByTagName("input")[0]))
                eleme.getElementsByTagName("input")[0].value++;

            eleme.getElementsByTagName("input")[0].value = parseFloat(
                eleme.getElementsByTagName("input")[0].value
            ).toFixed(2);
        };
    });
    document.querySelectorAll(".btn-precio-mas").forEach(btn => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName("input")[0].value++;
            if (!precioSalida(eleme, eleme.getElementsByTagName("input")[0]))
                eleme.getElementsByTagName("input")[0].value--;
            eleme.getElementsByTagName("input")[0].value = parseFloat(
                eleme.getElementsByTagName("input")[0].value
            ).toFixed(2);
        };
    });
    document.querySelectorAll(".precio-salida").forEach(btn => {
        btn.onkeyup = () => {
            if (btn.value == "") return;
            let numero = numero_campo(btn);
            if (numero != undefined) {
                if (numero.value != "") {
                    numero.focus();
                    btn.value = btn.value.substring(1, btn.value.length - 1);
                    showAlertTopEnd(
                        "info",
                        "Por favor ingrese sólo números al campo"
                    );
                }
                return;
            }
            let eleme = btn.parentElement.parentElement.parentElement;
            if (precioSalida(eleme, btn));
        };
    });


    document.querySelectorAll(".btn-precio-menos2").forEach(btn => {
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName("input")[1].value--;

            if (!precioSalidaOtro(eleme, eleme.getElementsByTagName("input")[1]))
                eleme.getElementsByTagName("input")[1].value++;

            eleme.getElementsByTagName("input")[1].value = parseFloat(
                eleme.getElementsByTagName("input")[1].value
            ).toFixed(2);
        };
    });
    document.querySelectorAll(".btn-precio-mas2").forEach(btn => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName("input")[1].value++;
            if (!precioSalidaOtro(eleme, eleme.getElementsByTagName("input")[1]))
                eleme.getElementsByTagName("input")[1].value--;
            eleme.getElementsByTagName("input")[1].value = parseFloat(
                eleme.getElementsByTagName("input")[1].value
            ).toFixed(2);
        };
    });
    document.querySelectorAll(".precio-salida2").forEach(btn => {
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
            if (precioSalidaOtro(eleme, btn));
        };
    });

    /* mas y menos*/
    document.querySelectorAll('.btn-cantidad-menos').forEach((btn) => {
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName('input')[0].value--;
            if (eleme.getElementsByTagName('input')[0].value < 0)
                return eleme.getElementsByTagName('input')[0].value++;
            if (!cantidadDetalleSalida(eleme, eleme.getElementsByTagName('input')[0]))
                eleme.getElementsByTagName('input')[0].value++;
        };
    });
    document.querySelectorAll('.btn-cantidad-mas').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName('input')[0].value++;
            if (!cantidadDetalleSalida(eleme, eleme.getElementsByTagName('input')[0]))
                eleme.getElementsByTagName('input')[0].value--;
        };
    });
    /* inputs teclado*/
    document.querySelectorAll('.cantidad-salida').forEach((btn) => {
        btn.onkeyup = () => {
            if (btn.value == '') return;

            let numero = numero_campo(btn);
            if (numero != undefined) {
                if (numero.value != '') {
                    numero.focus();
                    btn.value = btn.value.substring(1, btn.value.length - 1);
                    showAlertTopEnd('info', 'Por favor ingrese solo numeros al campo');
                }
                return;
            }
            let eleme = btn.parentElement.parentElement.parentElement;
            if (cantidadDetalleSalida(eleme, btn));
        };
    });

    /* mas y menos*/
    document.querySelectorAll('.btn-cantidad-menos2').forEach((btn) => {
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName('input')[1].value--;
            if (eleme.getElementsByTagName('input')[1].value < 0)
                return eleme.getElementsByTagName('input')[1].value++;
            if (!cantidadOtroDetalleSalida(eleme, eleme.getElementsByTagName('input')[1]))
                eleme.getElementsByTagName('input')[1].value++;
        };
    });
    document.querySelectorAll('.btn-cantidad-mas2').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName('input')[1].value++;
            if (!cantidadOtroDetalleSalida(eleme, eleme.getElementsByTagName('input')[1]))
                eleme.getElementsByTagName('input')[1].value--;
        };
    });
    /* inputs teclado*/
    document.querySelectorAll('.cantidad-salida2').forEach((btn) => {
        btn.onkeyup = () => {
            if (btn.value == '') return;

            let numero = numero_campo(btn);
            if (numero != undefined) {
                if (numero.value != '') {
                    numero.focus();
                    btn.value = btn.value.substring(1, btn.value.length - 1);
                    showAlertTopEnd('info', 'Por favor ingrese sólo números al campo');
                }
                return;
            }
            let eleme = btn.parentElement.parentElement.parentElement;
            if (cantidadOtroDetalleSalida(eleme, btn));
        };
    });



    /* eliminar salida*/
    document.querySelectorAll('.eliminar-detalle-salida').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            detalle_salidaSelected = findByDetalleSalida(
                btn.parentElement.parentElement.parentElement.parentElement.getAttribute(
                    'iddetalle_salida'
                )
            );
            eliminarDetalleSalida(detalle_salidaSelected.iddetalle_salida);
            toListDetalleSalida(listDetalleSalida);
        };
    });

};

var totalByDetalleSalida = () => {
    let total = 0;
    listDetalleSalida.forEach(
        (detalle) => {
            total += detalle.cantidad;
        }

    );
    return total;
};

var totalOtroByDetalleSalida = () => {
    let total = 0;
    listDetalleSalida.forEach(
        (detalle) => {
            total += detalle.cantidad_otro;
        }

    );
    return total;
};

var totalPrecioByDetalleSalida = () => {
    let total = 0;
    listDetalleSalida.forEach(
        (detalle) => {
            total += (detalle.precio_servicio * detalle.cantidad * detalle.factor_conversion + detalle.precio_servicio * detalle.cantidad_otro);
        }

    );
    return total;
};


var findByDetalleSalida = (iddetalle_salida) => {

    return listDetalleSalida.find(
        (detalle) => {
            if (parseInt(iddetalle_salida) == detalle.iddetalle_salida) {
                return detalle;
            }


        }
    );
};

var findByClienteDetalleSalida = (idcliente) => {

    return listDetalleSalida.find(
        (detalle) => {
            if (parseInt(idcliente) == detalle.presentacion.ubicacion_producto.cliente.idcliente) {
                return detalle;
            }


        }
    );
};

var findByPresentacionDetalleSalida = (idpresentacion) => {

    return listDetalleSalida.find(
        (detalle) => {
            if (parseInt(idpresentacion) == detalle.presentacion.idpresentacion) {
                return detalle;
            }


        }
    );
};

function findIndexDetalleSalida(idbusqueda) {
    return listDetalleSalida.findIndex(
        (cargo) => {
            if (cargo.iddetalle_salida == parseInt(idbusqueda))
                return cargo;


        }
    );
}

var eliminarDetalleSalida = (idbusqueda) => {
    listDetalleSalida.splice(findIndexDetalleSalida(parseInt(idbusqueda)), 1);

};

var toListDetalleSalida = (beanPagination) => {
    document.getElementById('tbodySalidaDetalle').innerHTML = "";
    let row;
    let sumaTotal = 0, sumaTotal2 = 0, sumaTotalPrecio = 0;
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
        document.getElementById('txtTotal1').innerHTML = sumaTotal;
        document.getElementById('txtTotal2').innerHTML = sumaTotal2;
        document.getElementById('txtTotal3').innerHTML = sumaTotalPrecio;
        document.getElementById('tbodySalidaDetalle').innerHTML += row;
        return;
    }

    beanPagination.forEach((detalle_salida) => {
        sumaTotal += detalle_salida.cantidad;
        sumaTotal2 += detalle_salida.cantidad_otro;
        sumaTotalPrecio += 10;
        row = `
			<!-- Widget Item -->
			<div class="dt-widget__item pt-1 pb-1 pr-4 border-bottom" iddetalle_salida="${
            detalle_salida.iddetalle_salida
            }">

			<!-- Widget Extra -->
				<div class="dt-widget__extra align-self-center">
					<!-- Hide Content -->
					<div class="hide-content">
						<!-- Action Button Group -->
						<div class="action-btn-group mr-2" style="margin-left: -30px;">
							<button  class="btn btn-default text-danger dt-fab-btn eliminar-detalle-salida"
							data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Eliminar</em>">
								<i class="icon icon-trash icon-lg pulse-danger"></i>
							</button>
						</div>
						<!-- /action button group -->
					</div>
					<!-- /hide content -->
				</div>
			<!-- /widget extra -->

				<!-- Widget Info -->
				<div class="dt-widget__info " >
					<div class="dt-widget__title text-left">
					${detalle_salida.presentacion.ubicacion_producto.producto.nombre}
					</div>
					<span class="dt-widget__subtitle">
					${ detalle_salida.presentacion.ubicacion_producto.producto.codigo
            }</span>
				</div>
        <!-- /widget info -->

        <!-- Widget Info -->
				<div class="dt-widget__info ">
					<div class="dt-widget__title pl-2 pr-2">${ detalle_salida.presentacion.ubicacion_producto.codigo
            }</div>
          <span class="dt-widget__subtitle pl-2 pr-2">
					${detalle_salida.presentacion.ubicacion_producto.almacen.nombre
            }</span>
				</div>
        <!-- Widget Info -->

        <div class="dt-widget__info  text-right pl-2 pr-2" style=" max-width: 180px;min-width: 180px;">
        <div class="input-group">
          <div class="dt-widget__title text-left">S/. ${numeroConComas(detalle_salida.precio_servicio)}
          </div>
          <span class="dt-widget__title ml-2 align-self-center" >x ${detalle_salida.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}</span>
          </div>

          <div class="input-group">
					<div class="dt-widget__title text-left">S/. ${numeroConComas((detalle_salida.precio_servicio * detalle_salida.factor_conversion).toFixed(2))}
          </div>
            <span class="dt-widget__title ml-2 align-self-center" >x ${detalle_salida.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}</span>
          </div>
          
				</div>
				<!-- /widget info -->
				<!-- Widget Info -->
				<div class="dt-widget__info  text-right pl-2 pr-2" style=" max-width: 180px;min-width: 150px;">
					<div class="input-group search-box right-side-icon">
						<div class="input-group-prepend" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-cantidad-menos tienda-cursor-mano"> <i
							class="icon icon-minus icon-2x"></i></span>
						</div>
						<input class="form-control form-control-sm cantidad-salida p-1"
						value="${numeroConComas(
                detalle_salida.cantidad
            )}" type="text" style="height: 27px;">
						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-cantidad-mas tienda-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
            </div>
            <span class="dt-widget__title ml-1 align-self-center" >${detalle_salida.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}</span>
					</div>
				</div>
				<!-- /widget info -->
				<!-- Widget Info -->
				<div class="dt-widget__info  text-right pl-2 pr-2" style=" max-width: 180px;min-width: 150px;">
					<div class="input-group search-box right-side-icon">
						<div class="input-group-prepend" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-cantidad-menos2 tienda-cursor-mano"> <i
							class="icon icon-minus icon-2x"></i></span>
						</div>
						<input class="form-control form-control-sm cantidad-salida2 p-1"
						value="${numeroConComas(
                detalle_salida.cantidad_otro
            )}" type="text" style="height: 27px;">
						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-cantidad-mas2 tienda-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
            </div>
            <span class="dt-widget__title ml-1 align-self-center" >${detalle_salida.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}</span>
					</div>
				</div>
				<!-- /widget info -->
        <!-- Widget Info -->
				<div class="dt-widget__info d-none" style=" max-width: 100px;min-width: 100px;">
          <div class="dt-widget__title border-left text-right">	
          <a href="javascript:void(0)">S/. ${numeroConComas(detalle_salida.precio_servicio * detalle_salida.cantidad * detalle_salida.factor_conversion + detalle_salida.precio_servicio * detalle_salida.cantidad_otro)}</a>
					</div>
				</div>
        <!-- /widget info -->
			</div>
			<!-- /widgets item -->
			`;
        document.getElementById('tbodySalidaDetalle').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });



    document.getElementById('txtTotal1').innerHTML = sumaTotal;
    document.getElementById('txtTotal2').innerHTML = sumaTotal2;
    document.getElementById('txtTotal3').innerHTML = "S/. " + numeroConComas(sumaTotalPrecio.toFixed(2));
    addEventsDetalleSalida();
};

var eliminarAtributosDetalleSalida = () => {
    listDetalleSalida.forEach(function (obj) {
        delete obj.presentacion['existencia_inicial'];
        delete obj.presentacion['existencia_inicial_otro'];
    });
};


