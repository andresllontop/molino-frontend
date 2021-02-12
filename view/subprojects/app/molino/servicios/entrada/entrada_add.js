var beanPaginationEntrada;
var entradaSelected;
var presentacionSelected;
var detalle_entradaSelected;
var clienteSelected;
var documentoSelected;
var metodo = false;
var beanRequestEntrada = new BeanRequest();
var contador = 0;
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    //addEntrada();

    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestEntrada.entity_api = 'api/entradas';
    beanRequestEntrada.operation = 'paginate';
    beanRequestEntrada.type_request = 'GET';

    $('#FrmEntradaModal').submit(function (event) {
        if (metodo) {
            beanRequestEntrada.operation = 'update';
            beanRequestEntrada.type_request = 'PUT';
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestEntrada.operation = 'add';
            beanRequestEntrada.type_request = 'POST';
        }
        event.preventDefault();
        event.stopPropagation();
        // if (validateFormEntrada()) {
        processAjaxEntrada();
        // }
    });
    document.querySelector('#btnAbrirNewEntrada').onclick = function () {
        metodo = false;
        $('[data-toggle="tooltip"]').tooltip("hide");
        removeClass(document.querySelector('#txtClienteUbicacionProducto').nextElementSibling, "d-none");
        removeClass(document.querySelector("#FrmEntradaModal").parentElement, "d-none");
        addEntrada();
        listDetalleEntrada = [];
        toListDetalleEntrada(listDetalleEntrada);
        displayEntrada("show");
    };
    document.querySelector(".cerrar-entrada").onclick = () => {
        displayEntrada("hide");
        beanRequestEntrada.operation = 'paginate';
        beanRequestEntrada.type_request = 'GET';
        processAjaxEntrada();

    };
    document.querySelector("#btnCancelAddDetalleEntradaHtml").onclick = () => {
        listDetalleEntrada.length = 0;
        toListDetalleEntrada(listDetalleEntrada);


    };

    document.querySelector('#checkComprobanteEntrada').onchange = function (e) {
        e.target.parentElement.nextElementSibling.classList.toggle("d-none");
    };


    $('#FechaEmisionEntrada').datetimepicker({
        format: 'DD/MM/YYYY HH:mm:ss',
        defaultDate: new Date(),
        locale: 'es',
        icons: calIcons

    });


});

var processAjaxEntrada = () => {
    eliminarAtributosDetalleEntrada();
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestEntrada.operation == 'add' ||
        beanRequestEntrada.operation == 'update'
    ) {
        if (document.querySelector('#checkComprobanteEntrada').checked == true) {
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
            entrada: new Entrada(
                parseInt(1),
                getFullDateJava(),
                (documentoSelected == undefined) ? null : documentoSelected,
                (documentoSelected == undefined) ? null : parseInt(limpiar_campo(document.querySelector("#txtNumeroDocumento").value)),
                (document.querySelector('#txtObservacionEntrada').value == "") ? null : limpiar_campo(document.querySelector("#txtObservacionEntrada").value),
                clienteSelected,
                totalByDetalleEntrada(),
                totalOtroByDetalleEntrada(),
                parseInt(1)
            ),
            list: listDetalleEntrada
        };
        circleCargando.container = $(document.querySelector("#tbodyEntradaDetalle").parentElement.parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#tbodyEntradaDetalle").parentElement);

    } else {
        circleCargando.container = $(document.querySelector("#tbodyEntrada").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#tbodyEntrada"));
    }
    circleCargando.createLoader();
    circleCargando.toggleLoader("show");
    switch (beanRequestEntrada.operation) {
        case 'delete':
            parameters_pagination = '/' + entradaSelected.identrada;
            break;
        case 'update':
            json.entrada.identrada = entradaSelected.identrada;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterEntrada').value != '') {
                document.querySelector('#pageEntrada').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterEntrada').value
                ).toLowerCase();
            parameters_pagination +=
                '&fechai=' + document.querySelector('#txtFechaIFilterEntrada').value;
            parameters_pagination +=
                '&fechaf=' + document.querySelector('#txtFechaFFilterEntrada').value;
            parameters_pagination +=
                '&page=' + document.querySelector('#pageEntrada').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageEntrada').value;
            break;
    }
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(beanRequestEntrada, json, parameters_pagination,
        circleCargando.loader.firstElementChild);
    xhr.onload = () => {
        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                addEntrada();
                notifyUser('Acción realizada exitosamente');
                listDetalleEntrada.length = 0;
                toListDetalleEntrada(listDetalleEntrada);
                /*        if (beanRequestEntrada.operation == "update") {
                          document.querySelector('#FrmPresentacionC').dispatchEvent(new Event('submit'));
                        }
                */

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationEntrada = beanCrudResponse.beanPagination;
            toListEntrada(beanPaginationEntrada);
        }
    };
};

/* DETALLE SALIDA*/
var newSelected = () => {
    /* VALIDAR PRODUCTO Y PRODUCTOCOLOR*/
    if (presentacionSelected == undefined) {
        return showAlertTopEnd('info', 'Por favor ingrese Producto');
    }
    if (listDetalleEntrada.length > 0 && findByClienteDetalleEntrada(presentacionSelected.ubicacion_producto.cliente.idcliente) == undefined) {
        return showAlertTopEnd('info', 'Guarda la Entra de Cliente para poder registrar otra entrada del nuevo Ciente');
    }
    if (findByPresentacionDetalleEntrada(presentacionSelected.idpresentacion) != undefined) {
        return showAlertTopEnd('info', 'Ya Seleccionaste este Producto');
    }


    presentacionSelected.existencia_otro = presentacionSelected.existencia_otro;
    presentacionSelected.existencia_inicial = presentacionSelected.existencia;
    presentacionSelected.existencia_inicial_otro = presentacionSelected.existencia_otro;
    presentacionSelected.existencia = (presentacionSelected.existencia + 1);
    /* OPERACION AGREGAR*/
    listDetalleEntrada.push(
        new Detalle_Entrada(
            contador++,
            presentacionSelected,
            presentacionSelected.ubicacion_producto.producto.factor_conversion,
            1,
            0,
            presentacionSelected.existencia,
            presentacionSelected.existencia_otro,
            presentacionSelected.ubicacion_producto.precio_servicio,
            presentacionSelected.ubicacion_producto.precio_compra

        )
    );

    //presentacionSelected = undefined;
    toListDetalleEntrada(listDetalleEntrada);
};

var cantidadDetalleEntrada = (eleme, btn) => {
    if (numeroSepararDecimal(btn.value).length > 1)
        btn.value = parseInt(btn.value);

    if (btn.value < 0) {
        btn.value = 0;
        return false;
    }
    entradaSelected = findByDetalleEntrada(
        eleme.getAttribute('iddetalle_entrada')
    );
    if (entradaSelected == undefined) return false;
    eliminarDetalleEntrada(entradaSelected.iddetalle_entrada);

    entradaSelected.presentacion.existencia = (parseInt(btn.value) + entradaSelected.presentacion.existencia_inicial);

    listDetalleEntrada.push(
        new Object(
            new Detalle_Entrada(
                entradaSelected.iddetalle_entrada,
                entradaSelected.presentacion,
                entradaSelected.factor_conversion,
                parseInt(btn.value),
                entradaSelected.cantidad_otro,
                parseInt(btn.value) + entradaSelected.presentacion.existencia_inicial,
                entradaSelected.existencia_otro,
                entradaSelected.precio_servicio,
                entradaSelected.precio

            )
        )
    );
    document.getElementById('txtTotal1').innerText = totalByDetalleEntrada();
    document.getElementById('txtTotal3').innerText = "S/. " + numeroConComas(totalPrecioByDetalleEntrada().toFixed(
        2));
    eleme.getElementsByTagName("a")[0].text =
        "S/. " +
        numeroConComas(
            (entradaSelected.precio_servicio * parseInt(btn.value) * entradaSelected.factor_conversion +
                entradaSelected.precio_servicio * entradaSelected.cantidad_otro).toFixed(
                    2
                )
        );
    return true;
};

var cantidadOtroDetalleEntrada = (eleme, btn) => {
    if (numeroSepararDecimal(btn.value).length > 1)
        btn.value = parseInt(btn.value);

    if (btn.value < 0) {
        btn.value = 0;
        return false;
    }
    entradaSelected = findByDetalleEntrada(
        eleme.getAttribute('iddetalle_entrada')
    );
    if (entradaSelected == undefined) return false;
    eliminarDetalleEntrada(entradaSelected.iddetalle_entrada);

    entradaSelected.presentacion.existencia_otro = (parseInt(btn.value) + entradaSelected.presentacion.existencia_inicial_otro);

    listDetalleEntrada.push(
        new Object(
            new Detalle_Entrada(
                entradaSelected.iddetalle_entrada,
                entradaSelected.presentacion,
                entradaSelected.factor_conversion,
                entradaSelected.cantidad,
                parseInt(btn.value),
                entradaSelected.existencia,
                parseInt(btn.value) + entradaSelected.presentacion.existencia_inicial_otro,
                entradaSelected.precio_servicio,
                entradaSelected.precio

            )
        )
    );
    document.getElementById('txtTotal2').innerText = totalOtroByDetalleEntrada();
    document.getElementById('txtTotal3').innerText = "S/. " + numeroConComas(totalPrecioByDetalleEntrada().toFixed(
        2));
    eleme.getElementsByTagName("a")[0].text =
        "S/. " +
        numeroConComas(
            (entradaSelected.precio_servicio * entradaSelected.cantidad * entradaSelected.factor_conversion +
                entradaSelected.precio_servicio * parseInt(btn.value)).toFixed(
                    2
                )
        );
    return true;
};

var precioEntrada = (eleme, btn) => {
    if (btn.value < 0) {
        if (numeroSepararDecimal(btn.value).length > 1) {
            btn.value = 0;
        } else {
            btn.value = -1;
            return false;
        }
    }
    entradaSelected = findByDetalleEntrada(eleme.getAttribute("iddetalle_entrada"));
    if (entradaSelected == undefined) return false;


    eliminarDetalleEntrada(entradaSelected.iddetalle_entrada);
    listDetalleEntrada.push(
        new Object(
            new Detalle_Entrada(
                entradaSelected.iddetalle_entrada,
                entradaSelected.presentacion,
                entradaSelected.factor_conversion,
                entradaSelected.cantidad,
                entradaSelected.cantidad_otro,
                entradaSelected.existencia,
                entradaSelected.existencia_otro,
                parseFloat(btn.value),
                entradaSelected.precio
            )
        )
    );

    eleme.getElementsByTagName("input")[1].value =
        (parseFloat(btn.value) * entradaSelected.factor_conversion).toFixed(
            2
        )
        ;

    eleme.getElementsByTagName("a")[0].text =
        "S/. " +
        numeroConComas(
            (entradaSelected.cantidad * parseFloat(btn.value) * entradaSelected.factor_conversion + entradaSelected.cantidad_otro * parseFloat(btn.value)).toFixed(
                2
            )
        );
    document.getElementById('txtTotal3').innerText = "S/. " + numeroConComas(totalPrecioByDetalleEntrada().toFixed(
        2));
    return true;
};

var precioEntradaOtro = (eleme, btn) => {
    if (btn.value < 0) {
        if (numeroSepararDecimal(btn.value).length > 1) {
            btn.value = 0;
        } else {
            btn.value = -1;
            return false;
        }
    }
    entradaSelected = findByDetalleEntrada(eleme.getAttribute("iddetalle_entrada"));
    if (entradaSelected == undefined) return false;


    eliminarDetalleEntrada(entradaSelected.iddetalle_entrada);
    listDetalleEntrada.push(
        new Object(
            new Detalle_Entrada(
                entradaSelected.iddetalle_entrada,
                entradaSelected.presentacion,
                entradaSelected.factor_conversion,
                entradaSelected.cantidad,
                entradaSelected.cantidad_otro,
                entradaSelected.existencia,
                entradaSelected.existencia_otro,
                parseFloat(btn.value) / entradaSelected.factor_conversion,
                entradaSelected.precio
            )
        )
    );
    eleme.getElementsByTagName("input")[0].value =
        (parseFloat(btn.value) / entradaSelected.factor_conversion).toFixed(
            2
        )
        ;
    eleme.getElementsByTagName("a")[0].text =
        "S/. " +
        numeroConComas(
            (entradaSelected.cantidad * parseFloat(btn.value) + entradaSelected.cantidad_otro * parseFloat(btn.value) / entradaSelected.factor_conversion).toFixed(
                2
            )
        );
    document.getElementById('txtTotal3').innerText = "S/. " + numeroConComas(totalPrecioByDetalleEntrada().toFixed(
        2));
    return true;
};

var addEventsDetalleEntrada = () => {


    document.querySelectorAll(".btn-precio-menos").forEach(btn => {
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName("input")[0].value--;

            if (!precioEntrada(eleme, eleme.getElementsByTagName("input")[0]))
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
            if (!precioEntrada(eleme, eleme.getElementsByTagName("input")[0]))
                eleme.getElementsByTagName("input")[0].value--;
            eleme.getElementsByTagName("input")[0].value = parseFloat(
                eleme.getElementsByTagName("input")[0].value
            ).toFixed(2);
        };
    });
    document.querySelectorAll(".precio-entrada").forEach(btn => {
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
            if (precioEntrada(eleme, btn));
        };
    });


    document.querySelectorAll(".btn-precio-menos2").forEach(btn => {
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName("input")[1].value--;

            if (!precioEntradaOtro(eleme, eleme.getElementsByTagName("input")[1]))
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
            if (!precioEntradaOtro(eleme, eleme.getElementsByTagName("input")[1]))
                eleme.getElementsByTagName("input")[1].value--;
            eleme.getElementsByTagName("input")[1].value = parseFloat(
                eleme.getElementsByTagName("input")[1].value
            ).toFixed(2);
        };
    });
    document.querySelectorAll(".precio-entrada2").forEach(btn => {
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
            if (precioEntradaOtro(eleme, btn));
        };
    });

    /* mas y menos*/
    document.querySelectorAll('.btn-cantidad-menos').forEach((btn) => {
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName('input')[2].value--;
            if (eleme.getElementsByTagName('input')[2].value < 0)
                return eleme.getElementsByTagName('input')[2].value++;
            if (!cantidadDetalleEntrada(eleme, eleme.getElementsByTagName('input')[2]))
                eleme.getElementsByTagName('input')[2].value++;
        };
    });
    document.querySelectorAll('.btn-cantidad-mas').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName('input')[2].value++;
            if (!cantidadDetalleEntrada(eleme, eleme.getElementsByTagName('input')[2]))
                eleme.getElementsByTagName('input')[2].value--;
        };
    });
    /* inputs teclado*/
    document.querySelectorAll('.cantidad-entrada').forEach((btn) => {
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
            if (cantidadDetalleEntrada(eleme, btn));
        };
    });

    /* mas y menos*/
    document.querySelectorAll('.btn-cantidad-menos2').forEach((btn) => {
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName('input')[3].value--;
            if (eleme.getElementsByTagName('input')[3].value < 0)
                return eleme.getElementsByTagName('input')[3].value++;
            if (!cantidadOtroDetalleEntrada(eleme, eleme.getElementsByTagName('input')[3]))
                eleme.getElementsByTagName('input')[3].value++;
        };
    });
    document.querySelectorAll('.btn-cantidad-mas2').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme = btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName('input')[3].value++;
            if (!cantidadOtroDetalleEntrada(eleme, eleme.getElementsByTagName('input')[3]))
                eleme.getElementsByTagName('input')[3].value--;
        };
    });
    /* inputs teclado*/
    document.querySelectorAll('.cantidad-entrada2').forEach((btn) => {
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
            if (cantidadOtroDetalleEntrada(eleme, btn));
        };
    });



    /* eliminar entrada*/
    document.querySelectorAll('.eliminar-detalle-entrada').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            detalle_entradaSelected = findByDetalleEntrada(
                btn.parentElement.parentElement.parentElement.parentElement.getAttribute(
                    'iddetalle_entrada'
                )
            );
            eliminarDetalleEntrada(detalle_entradaSelected.iddetalle_entrada);
            toListDetalleEntrada(listDetalleEntrada);
        };
    });

};

var totalByDetalleEntrada = () => {
    let total = 0;
    listDetalleEntrada.forEach(
        (detalle) => {
            total += detalle.cantidad;
        }

    );
    return total;
};

var totalOtroByDetalleEntrada = () => {
    let total = 0;
    listDetalleEntrada.forEach(
        (detalle) => {
            total += detalle.cantidad_otro;
        }

    );
    return total;
};

var totalPrecioByDetalleEntrada = () => {
    let total = 0;
    listDetalleEntrada.forEach(
        (detalle) => {
            total += (detalle.precio_servicio * detalle.cantidad * detalle.factor_conversion + detalle.precio_servicio * detalle.cantidad_otro);
        }

    );
    return total;
};


var findByDetalleEntrada = (iddetalle_entrada) => {

    return listDetalleEntrada.find(
        (detalle) => {
            if (parseInt(iddetalle_entrada) == detalle.iddetalle_entrada) {
                return detalle;
            }


        }
    );
};

var findByClienteDetalleEntrada = (idcliente) => {

    return listDetalleEntrada.find(
        (detalle) => {
            if (parseInt(idcliente) == detalle.presentacion.ubicacion_producto.cliente.idcliente) {
                return detalle;
            }


        }
    );
};

var findByPresentacionDetalleEntrada = (idpresentacion) => {

    return listDetalleEntrada.find(
        (detalle) => {
            if (parseInt(idpresentacion) == detalle.presentacion.idpresentacion) {
                return detalle;
            }


        }
    );
};

function findIndexDetalleEntrada(idbusqueda) {
    return listDetalleEntrada.findIndex(
        (cargo) => {
            if (cargo.iddetalle_entrada == parseInt(idbusqueda))
                return cargo;


        }
    );
}

var eliminarDetalleEntrada = (idbusqueda) => {
    listDetalleEntrada.splice(findIndexDetalleEntrada(parseInt(idbusqueda)), 1);

};

var toListDetalleEntrada = (beanPagination) => {
    document.getElementById('tbodyEntradaDetalle').innerHTML = "";
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
        document.getElementById('tbodyEntradaDetalle').innerHTML += row;
        return;
    }

    beanPagination.forEach((detalle_entrada) => {
        sumaTotal += detalle_entrada.cantidad;
        sumaTotal2 += detalle_entrada.cantidad_otro;
        sumaTotalPrecio += 10;
        row = `
			<!-- Widget Item -->
			<div class="dt-widget__item pt-1 pb-1 pr-4 border-bottom" iddetalle_entrada="${
            detalle_entrada.iddetalle_entrada
            }">

			<!-- Widget Extra -->
				<div class="dt-widget__extra align-self-center">
					<!-- Hide Content -->
					<div class="hide-content">
						<!-- Action Button Group -->
						<div class="action-btn-group mr-2" style="margin-left: -30px;">
							<button  class="btn btn-default text-danger dt-fab-btn eliminar-detalle-entrada"
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
					${
            detalle_entrada.presentacion.ubicacion_producto.producto.nombre

            }
					</div>
					<span class="dt-widget__subtitle">
					${ detalle_entrada.presentacion.ubicacion_producto.producto.codigo
            }</span>
				</div>
        <!-- /widget info -->
        <!-- Widget Info -->
				<div class="dt-widget__info ">
					<div class="dt-widget__title pl-2 pr-2">	${ detalle_entrada.presentacion.ubicacion_producto.codigo
            }
          </div>
          <span class="dt-widget__subtitle pl-2 pr-2">
					${detalle_entrada.presentacion.ubicacion_producto.almacen.nombre
            }</span>
				</div>
        <!-- Widget Info -->
        <div class="dt-widget__info  text-right pl-2 pr-2" style=" max-width: 180px;min-width: 180px;">
        
					<div class="input-group search-box right-side-icon mb-2">
						<div class="input-group-prepend" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-precio-menos molino-cursor-mano"> <i
              class="icon icon-minus icon-2x"></i></span>
              <span class="btn m-0 p-0 btn-light">s/. </span>
						</div>

						<input class="form-control form-control-sm precio-entrada p-1"
						value="${numeroConComas(
                detalle_entrada.precio_servicio
            )}" type="text" style="height: 27px;">

						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-precio-mas molino-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
            </div>
            <span class="dt-widget__title ml-2 align-self-center" >x ${detalle_entrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}</span>
          </div>

          <div class="input-group search-box right-side-icon">
						<div class="input-group-prepend" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-precio-menos2 molino-cursor-mano"> <i
              class="icon icon-minus icon-2x"></i></span>
              <span class="btn m-0 p-0 btn-light">s/. </span>
						</div>

						<input class="form-control form-control-sm precio-entrada2 p-1"
						value="${numeroConComas(
                detalle_entrada.precio_servicio * detalle_entrada.factor_conversion
            )}" type="text" style="height: 27px;">

						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-precio-mas2 molino-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
            </div>
            <span class="dt-widget__title ml-2 align-self-center" >x ${detalle_entrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}</span>
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
						<input class="form-control form-control-sm cantidad-entrada p-1"
						value="${numeroConComas(
                detalle_entrada.cantidad
            )}" type="text" style="height: 27px;">
						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-cantidad-mas tienda-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
            </div>
            <span class="dt-widget__title ml-1 align-self-center" >${detalle_entrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}</span>
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
						<input class="form-control form-control-sm cantidad-entrada2 p-1"
						value="${numeroConComas(
                detalle_entrada.cantidad_otro
            )}" type="text" style="height: 27px;">
						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-cantidad-mas2 tienda-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
            </div>
            <span class="dt-widget__title ml-1 align-self-center" >${detalle_entrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}</span>
					</div>
				</div>
				<!-- /widget info -->
        <!-- Widget Info -->
				<div class="dt-widget__info d-none" style=" max-width: 100px;min-width: 100px;">
          <div class="dt-widget__title border-left text-right">	
          <a href="javascript:void(0)">S/. ${numeroConComas(detalle_entrada.precio_servicio * detalle_entrada.cantidad * detalle_entrada.factor_conversion + detalle_entrada.precio_servicio * detalle_entrada.cantidad_otro)}</a>
					</div>
				</div>
        <!-- /widget info -->
			</div>
			<!-- /widgets item -->
			`;
        document.getElementById('tbodyEntradaDetalle').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });



    document.getElementById('txtTotal1').innerHTML = sumaTotal;
    document.getElementById('txtTotal2').innerHTML = sumaTotal2;
    document.getElementById('txtTotal3').innerHTML = "S/. " + numeroConComas(sumaTotalPrecio.toFixed(2));
    addEventsDetalleEntrada();
};

var eliminarAtributosDetalleEntrada = () => {
    listDetalleEntrada.forEach(function (obj) {
        delete obj.presentacion['existencia_inicial'];
        delete obj.presentacion['existencia_inicial_otro'];
    });
};


