var beanPaginationVenta;
var beanPaginationDetalleVenta;
var ventaSelected;
var presentacionSelected;
var detalle_ventaSelected;
var clienteSelected
var metodo = false;
var beanRequestVenta = new BeanRequest();
var contador = 0;
document.addEventListener('DOMContentLoaded', function () {
  //invocar funcion agregar
  //addVenta();

  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestVenta.entity_api = 'api/ventas';
  beanRequestVenta.operation = 'paginate';
  beanRequestVenta.type_request = 'GET';

  $('#FrmVentaModal').submit(function (event) {
    if (metodo) {
      beanRequestVenta.operation = 'update';
      beanRequestVenta.type_request = 'PUT';
      metodo = false;
    } else {
      //CONFIGURAMOS LA SOLICITUD
      beanRequestVenta.operation = 'add';
      beanRequestVenta.type_request = 'POST';
    }
    event.preventDefault();
    event.stopPropagation();
    // if (validateFormVenta()) {
    processAjaxVenta();
    // }
  });

  document.querySelector("#btnCancelAddDetalleVentaHtml").onclick = () => {
    listDetalleVenta.length = 0;
    toListDetalleVenta(listDetalleVenta);


  };

  document.querySelector('#checkComprobanteVenta').onchange = function (e) {
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

  document.querySelector("#btnCambiarPagoVenta").onclick = (e) => {
    if (e.target.textContent == "Pagado") {
      removeClass(e.target, "btn-success");
      addClass(e.target, "btn-danger");
      e.target.textContent = "Deuda";
      document.querySelector("#txtTotalDeuda").value = totalPrecioByDetalleVenta().toFixed(
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
var processAjaxVenta = (detalle = undefined) => {

  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");

  let parameters_pagination = '';
  let json = '';
  if (
    beanRequestVenta.operation == 'add' ||
    beanRequestVenta.operation == 'update'
  ) {
    circleCargando.container = $(document.querySelector("#tbodyVentaDetalle").parentElement.parentElement);
    circleCargando.containerOcultar = $(document.querySelector("#tbodyVentaDetalle").parentElement);
    eliminarAtributosDetalleVenta();

    listPagoVenta.push(new PagoVenta(
      parseInt(document.querySelector("#txtMetodoPago").value),
      parseFloat(document.querySelector("#txtMontoPagado").value),
      (document.querySelector("#btnCambiarPagoVenta").textContent.toUpperCase().charAt(0) == 'P') ? 1 : 2,
      null
    ));
    json = {
      venta: new Venta(
        parseInt(1),
        getFullDateJava(),
        getFullDateJava(addDays(new Date(), 30)),
        (document.querySelector('#checkComprobanteVenta').checked == false || documentoCSelected == undefined) ? null : documentoCSelected,
        (document.querySelector('#checkComprobanteVenta').checked == false || documentoCSelected == undefined) ? null : parseInt(limpiar_campo(document.querySelector("#txtNumeroDocumento").value)),
        (document.querySelector('#txtObservacionVenta').value == "") ? null : limpiar_campo(document.querySelector("#txtObservacionVenta").value),
        clienteSelected,
        parseFloat(subTotalByDetalleVenta().toFixed(2)),
        parseFloat(totalPrecioByDetalleVenta().toFixed(2)),
        (document.querySelector("#btnCambiarPagoVenta").textContent.toUpperCase().charAt(0) == 'P') ? 1 : 2


      ),
      list: listDetalleVenta,
      list_pago: listPagoVenta
    };

  } else {

    if (detalle == undefined) {
      circleCargando.container = $(document.querySelector("#tbodyVenta").parentElement);
      circleCargando.containerOcultar = $(document.querySelector("#tbodyVenta"));

    } else {
      if (detalle == "detalle-ver") {
        circleCargando.container = $(document.querySelector("#tbodyVentaDetalle").parentElement.parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#tbodyVentaDetalle").parentElement);
      } else {
        circleCargando.container = $(document.querySelectorAll(".popover-body")[0].parentElement);
        circleCargando.containerOcultar = $(document.querySelectorAll(".popover-body")[0]);
      }

    }

  }
  circleCargando.createLoader();
  circleCargando.toggleLoader("show");
  switch (beanRequestVenta.operation) {
    case 'delete':
      parameters_pagination = '/' + ventaSelected.idventa;
      break;
    case 'update':
      json.venta.idventa = ventaSelected.idventa;
      break;
    case 'add':
      break;

    case 'detalle/paginate':
      parameters_pagination += '?idventa=' + ventaSelected.idventa;
      break;

    default:
      if (document.querySelector('#txtFilterVenta').value != '') {
        document.querySelector('#pageVenta').value = 1;
      }
      parameters_pagination += '?tipo_venta=4&nombre=' + limpiar_campo(document.querySelector('#txtFilterVenta').value
      ).toLowerCase();
      parameters_pagination += '&fechai=' + document.querySelector('#txtFechaIFilterVenta').value;
      parameters_pagination += '&fechaf=' + document.querySelector('#txtFechaFFilterVenta').value;
      parameters_pagination += '&page=' + document.querySelector('#pageVenta').value;
      parameters_pagination += '&size=' + document.querySelector('#sizePageVenta').value;
      break;
  }
  var xhr = new XMLHttpRequest();
  xhr = RequestServer(beanRequestVenta, json, parameters_pagination,
    circleCargando.loader.firstElementChild);
  xhr.onload = () => {
    circleCargando.toggleLoader("hide");
    beanCrudResponse = xhr.response;
    if (beanCrudResponse.messageServer !== undefined) {
      if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
        showAlertTopEnd('success', 'Acción realizada exitosamente');
        listDetalleVenta.length = 0;
        toListDetalleVenta(listDetalleVenta);
        document.querySelector('#FrmPresentacionC').dispatchEvent(new Event('submit'));
      } else {
        showAlertTopEnd('warning', beanCrudResponse.messageServer);
      }
    }
    if (beanCrudResponse.beanPagination !== undefined) {
      if (beanRequestVenta.operation == "detalle/paginate") {
        beanPaginationDetalleVenta = beanCrudResponse.beanPagination;
        if (detalle == "detalle-ver") {
          addClass(document.querySelector("#FrmVentaModal").parentElement, "d-none");
          addVenta();
          return;
        }
        //$('[data-toggle="popover"]').popover();
        let row = "";
        beanPaginationDetalleVenta.list.forEach((detalle) => {
          row += detalle.presentacion.ubicacion_producto.producto.nombre + " - " +
            detalle.cantidad + " " + detalle.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura + " || ";
        });
        row = row.substring(0, row.length - 3)
        detalle.setAttribute("data-content", row);
        $(detalle).popover("show");

      } else {
        beanPaginationVenta = beanCrudResponse.beanPagination;
        toListVenta(beanPaginationVenta);
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
  if (presentacionSelected.existencia <= 0) {
    return showAlertTopEnd('info', 'El Producto no cuenta con Stock en el Almacén');
  }
  if (listDetalleVenta.length > 0 && findByClienteDetalleVenta(presentacionSelected.ubicacion_producto.cliente.idcliente) == undefined) {
    return showAlertTopEnd('info', 'Guarda la Entra de Cliente para poder registrar otra venta del nuevo Ciente');
  }
  if (findByPresentacionDetalleVenta(presentacionSelected.idpresentacion) != undefined) {
    return showAlertTopEnd('info', 'Ya Seleccionaste este Producto');
  }

  presentacionSelected.existencia_otro = presentacionSelected.existencia_otro;
  presentacionSelected.existencia_inicial = presentacionSelected.existencia;
  presentacionSelected.existencia_inicial_otro = presentacionSelected.existencia_otro;
  presentacionSelected.existencia = (presentacionSelected.existencia - 1);
  /* OPERACION AGREGAR*/
  listDetalleVenta.push(
    new Detalle_Venta(
      contador++,
      presentacionSelected,
      1,
      presentacionSelected.existencia,
      presentacionSelected.ubicacion_producto.precio_venta * presentacionSelected.ubicacion_producto.producto.factor_conversion,
      0,
      0

    )
  );

  //presentacionSelected = undefined;
  toListDetalleVenta(listDetalleVenta);
};

var cantidadDetalleVenta = (eleme, btn) => {
  if (numeroSepararDecimal(btn.value).length > 0)
    btn.value = parseInt(btn.value);

  if (btn.value < 0) {
    btn.value = 0;
    return false;
  }
  ventaSelected = findByDetalleVenta(eleme.getAttribute('iddetalle_venta'));
  if (ventaSelected == undefined) return false;
  if (ventaSelected.presentacion.existencia_inicial < parseInt(btn.value)) {
    showAlertTopEnd('info', 'Cantidad excedida, no hay los suficientes Productos en el almacén.');
    btn.value = 1;
    return false;
  }
  eliminarDetalleVenta(ventaSelected.iddetalle_venta);
  ventaSelected.presentacion.existencia = (ventaSelected.presentacion.existencia_inicial - parseInt(btn.value));
  listDetalleVenta.push(
    new Object(
      new Detalle_Venta(
        ventaSelected.iddetalle_venta,
        ventaSelected.presentacion,
        parseInt(btn.value),
        ventaSelected.presentacion.existencia_inicial - parseInt(btn.value),
        ventaSelected.precio,
        ventaSelected.porcentaje_igv,
        ventaSelected.tipo_igv,
        ventaSelected.descuento
      )
    )
  );
  document.getElementById('txtImporteTotal').innerText = "S/. " + numeroConComas(totalPrecioByDetalleVenta().toFixed(2));
  document.getElementById('txtTotalGravada').innerText = "S/. " + numeroConComas(subTotalByDetalleVenta().toFixed(2));
  document.getElementById('txtIgvTotal').innerText = "S/. " + numeroConComas((totalPrecioByDetalleVenta() - subTotalByDetalleVenta()).toFixed(2));

  document.getElementById('txtMontoPagado').value = totalPrecioByDetalleVenta().toFixed(2);
  document.getElementById('txtTotalPagado').innerText = numeroConComas(totalPrecioByDetalleVenta().toFixed(2));
  eleme.getElementsByTagName("a")[0].text =
    "S/. " +
    numeroConComas((ventaSelected.precio * parseFloat(btn.value) * (1 - (ventaSelected.porcentaje_igv / 100))).toFixed(2));
  eleme.getElementsByTagName("a")[1].text =
    "S/. " +
    numeroConComas((ventaSelected.precio * parseFloat(btn.value)).toFixed(2));

  return true;
};

var precioVenta = (eleme, btn) => {
  if (btn.value < 0) {
    if (numeroSepararDecimal(btn.value).length > 1) {
      btn.value = 0;
    } else {
      btn.value = -1;
      return false;
    }
  }
  ventaSelected = findByDetalleVenta(eleme.getAttribute("iddetalle_venta"));
  if (ventaSelected == undefined) return false;

  if (
    ventaSelected.cantidad *
    ((ventaSelected.precio * ventaSelected.descuento_minimo) / 100) <
    btn.value
  ) {
    showAlertTopEnd(
      "info",
      "El monto del descuento es superior al descuento mínimo del producto"
    );

    btn.value = (
      ventaSelected.cantidad *
      ((ventaSelected.precio * ventaSelected.descuento_minimo) / 100)
    ).toFixed(2);
  }

  eliminarDetalleVenta(ventaSelected.iddetalle_venta);
  listDetalleVenta.push(
    new Object(
      new Detalle_Venta(
        ventaSelected.iddetalle_venta,
        ventaSelected.presentacion,
        ventaSelected.cantidad,
        ventaSelected.presentacion.existencia,
        parseFloat(btn.value),
        ventaSelected.porcentaje_igv,
        ventaSelected.tipo_igv,
        ventaSelected.descuento
      )
    )
  );

  eleme.getElementsByTagName("a")[0].text =
    "S/. " +
    numeroConComas((ventaSelected.cantidad * parseFloat(btn.value) * (1 - (ventaSelected.porcentaje_igv / 100))).toFixed(2));
  eleme.getElementsByTagName("a")[1].text =
    "S/. " +
    numeroConComas((ventaSelected.cantidad * parseFloat(btn.value)).toFixed(2));

  document.getElementById('txtImporteTotal').innerText = "S/. " + numeroConComas(totalPrecioByDetalleVenta().toFixed(2));
  document.getElementById('txtTotalGravada').innerText = "S/. " + numeroConComas(subTotalByDetalleVenta().toFixed(2));
  document.getElementById('txtIgvTotal').innerText = "S/. " + numeroConComas((totalPrecioByDetalleVenta() - subTotalByDetalleVenta()).toFixed(2));

  document.getElementById('txtMontoPagado').value = totalPrecioByDetalleVenta().toFixed(2);
  document.getElementById('txtTotalPagado').innerText = numeroConComas(totalPrecioByDetalleVenta().toFixed(2));
  return true;
};

var igvVenta = (eleme, btn) => {
  if (btn.value < 0) {
    if (numeroSepararDecimal(btn.value).length > 1) {
      btn.value = 0;
    } else {
      btn.value = -1;
      return false;
    }
  }

  ventaSelected = findByDetalleVenta(eleme.getAttribute('iddetalle_venta'));
  if (ventaSelected == undefined) return false;

  eliminarDetalleVenta(ventaSelected.iddetalle_venta);

  listDetalleVenta.push(
    new Object(
      new Detalle_Venta(
        ventaSelected.iddetalle_venta,
        ventaSelected.presentacion,
        ventaSelected.cantidad,
        ventaSelected.existencia,
        ventaSelected.precio,
        parseFloat(btn.value),
        eleme.getElementsByTagName("select")[0].value,
        ventaSelected.descuento
      )
    )
  );

  eleme.getElementsByTagName("a")[0].text = "S/. " +
    numeroConComas((ventaSelected.precio * ventaSelected.cantidad * (1 - (parseFloat(btn.value) / 100))).toFixed(2));

  document.getElementById('txtImporteTotal').innerText = "S/. " + numeroConComas(totalPrecioByDetalleVenta().toFixed(2));
  document.getElementById('txtTotalGravada').innerText = "S/. " + numeroConComas(subTotalByDetalleVenta().toFixed(2));
  document.getElementById('txtIgvTotal').innerText = "S/. " + numeroConComas((totalPrecioByDetalleVenta() - subTotalByDetalleVenta()).toFixed(2));

  return true;
};

var addEventsDetalleVenta = () => {

  document.querySelectorAll('.tipo-porcentaje').forEach((btn) => {
    btn.onchange = () => {
      if (parseInt(btn.value) == 1) {
        removeClass(btn.nextElementSibling, "d-none");
        removeClass(btn.nextElementSibling.nextElementSibling, "d-none");
        btn.nextElementSibling.value = 18;
        let eleme = btn.parentElement.parentElement.parentElement;
        if (igvVenta(eleme, btn.nextElementSibling));

      } else {
        addClass(btn.nextElementSibling, "d-none");
        addClass(btn.nextElementSibling.nextElementSibling, "d-none");
        btn.nextElementSibling.value = 0;
        let eleme = btn.parentElement.parentElement.parentElement;
        if (igvVenta(eleme, btn.nextElementSibling));
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
      if (igvVenta(eleme, btn));
    };
  });


  document.querySelectorAll(".btn-precio-menos").forEach(btn => {
    btn.onclick = () => {
      let eleme =
        btn.parentElement.parentElement.parentElement.parentElement;

      eleme.getElementsByTagName("input")[1].value--;

      if (!precioVenta(eleme, eleme.getElementsByTagName("input")[1]))
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
      if (!precioVenta(eleme, eleme.getElementsByTagName("input")[1]))
        eleme.getElementsByTagName("input")[1].value--;
      eleme.getElementsByTagName("input")[1].value = parseFloat(
        eleme.getElementsByTagName("input")[1].value
      ).toFixed(2);
    };
  });
  document.querySelectorAll(".precio-venta").forEach(btn => {
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
      if (precioVenta(eleme, btn));
    };
  });


  /* mas y menos*/
  document.querySelectorAll('.btn-cantidad-menos').forEach((btn) => {
    btn.onclick = () => {
      let eleme = btn.parentElement.parentElement.parentElement.parentElement;

      eleme.getElementsByTagName('input')[2].value--;
      if (eleme.getElementsByTagName('input')[2].value < 0)
        return eleme.getElementsByTagName('input')[2].value++;
      if (!cantidadDetalleVenta(eleme, eleme.getElementsByTagName('input')[2]))
        eleme.getElementsByTagName('input')[2].value++;
    };
  });
  document.querySelectorAll('.btn-cantidad-mas').forEach((btn) => {
    //AGREGANDO EVENTO CLICK
    btn.onclick = () => {
      let eleme = btn.parentElement.parentElement.parentElement.parentElement;
      eleme.getElementsByTagName('input')[2].value++;
      if (!cantidadDetalleVenta(eleme, eleme.getElementsByTagName('input')[2]))
        eleme.getElementsByTagName('input')[2].value--;
    };
  });
  /* inputs teclado*/
  document.querySelectorAll('.cantidad-venta').forEach((btn) => {
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
      if (cantidadDetalleVenta(eleme, btn));
    };
  });


  /* eliminar venta*/
  document.querySelectorAll('.eliminar-detalle-venta').forEach((btn) => {
    //AGREGANDO EVENTO CLICK
    btn.onclick = function () {
      $('[data-toggle="tooltip"]').tooltip("hide");
      detalle_ventaSelected = findByDetalleVenta(
        btn.parentElement.parentElement.parentElement.parentElement.getAttribute(
          'iddetalle_venta'
        )
      );
      eliminarDetalleVenta(detalle_ventaSelected.iddetalle_venta);
      toListDetalleVenta(listDetalleVenta);
    };
  });

};

var totalByDetalleVenta = () => {
  let total = 0;
  listDetalleVenta.forEach(
    (detalle) => {
      total += detalle.cantidad;
    }

  );
  return total;
};

var totalOtroByDetalleVenta = () => {
  let total = 0;
  listDetalleVenta.forEach(
    (detalle) => {
      total += detalle.cantidad_otro;
    }

  );
  return total;
};

var totalPrecioByDetalleVenta = () => {
  let total = 0;
  listDetalleVenta.forEach(
    (detalle) => {
      total += (detalle.cantidad * detalle.precio);
    }

  );
  return total;
};

var subTotalByDetalleVenta = () => {
  let total = 0;
  listDetalleVenta.forEach(
    (detalle) => {
      total += (detalle.precio * detalle.cantidad * (1 - (detalle.porcentaje_igv / 100)));
    }

  );
  return total;
};

var findByDetalleVenta = (iddetalle_venta) => {

  return listDetalleVenta.find(
    (detalle) => {
      if (parseInt(iddetalle_venta) == detalle.iddetalle_venta) {
        return detalle;
      }


    }
  );
};

var findByClienteDetalleVenta = (idcliente) => {

  return listDetalleVenta.find(
    (detalle) => {
      if (parseInt(idcliente) == detalle.presentacion.ubicacion_producto.cliente.idcliente) {
        return detalle;
      }


    }
  );
};

var findByPresentacionDetalleVenta = (idpresentacion) => {

  return listDetalleVenta.find(
    (detalle) => {
      if (parseInt(idpresentacion) == detalle.presentacion.idpresentacion) {
        return detalle;
      }


    }
  );
};

function findIndexDetalleVenta(idbusqueda) {
  return listDetalleVenta.findIndex(
    (cargo) => {
      if (cargo.iddetalle_venta == parseInt(idbusqueda))
        return cargo;


    }
  );
}

var eliminarDetalleVenta = (idbusqueda) => {
  listDetalleVenta.splice(findIndexDetalleVenta(parseInt(idbusqueda)), 1);

};

var toListDetalleVenta = (beanPagination) => {
  document.getElementById('tbodyVentaDetalle').innerHTML = "";
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
    document.getElementById('tbodyVentaDetalle').innerHTML += row;
    return;
  }

  beanPagination.forEach((detalle_venta) => {
    sumaTotal += detalle_venta.cantidad;
    sumaTotalOtro += (detalle_venta.cantidad * detalle_venta.precio * (1 - (detalle_venta.porcentaje_igv / 100)));

    sumaTotalPrecio += detalle_venta.cantidad * detalle_venta.precio;

    row = `
			<!-- Widget Item -->
			<div class="dt-widget__item pt-1 pb-1 pr-4 border-bottom" iddetalle_venta="${
      detalle_venta.iddetalle_venta
      }">

			<!-- Widget Extra -->
				<div class="dt-widget__extra">
					<!-- Hide Content -->
					<div class="hide-content">
						<!-- Action Button Group -->
						<div class="action-btn-group mr-2" style="margin-left: -30px;">
							<button  class="btn btn-default text-danger dt-fab-btn eliminar-detalle-venta"
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
      detalle_venta.presentacion.ubicacion_producto.producto.nombre

      }
					</div>
					<span class="dt-widget__subtitle">
					${ detalle_venta.presentacion.ubicacion_producto.producto.codigo
      }</span>
				</div>
        <!-- /widget info -->
        <!-- Widget Info -->
				<div class="dt-widget__info">
          <div class="dt-widget__title pl-2 pr-2">
          ${ detalle_venta.presentacion.ubicacion_producto.codigo
      }
          </div>
          <span class="dt-widget__subtitle pl-2 pr-2">
					${detalle_venta.presentacion.ubicacion_producto.almacen.nombre
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
        detalle_venta.porcentaje_igv
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

						<input class="form-control form-control-sm precio-venta p-1"
						value="${numeroConComas(detalle_venta.precio)}" type="text" style="height: 27px;">

						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-precio-mas molino-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
            </div>
            <span class="dt-widget__title ml-2 align-self-center" >x ${detalle_venta.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}</span>
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

						<input class="form-control form-control-sm cantidad-venta p-1"
						value="${numeroConComas(
        detalle_venta.cantidad
      )}" type="text" style="height: 27px;">

						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-cantidad-mas molino-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
            </div>
            <span class="dt-widget__title ml-2 align-self-center" >${detalle_venta.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}</span>
          </div>

				</div>
        <!-- /widget info -->
        
        <!-- Widget Info -->
				<div class="dt-widget__info" style="min-width: 100px;">
          <div class="dt-widget__title  text-right">	
          <a href="javascript:void(0)">S/. ${numeroConComas((detalle_venta.cantidad * detalle_venta.precio * (1 - (detalle_venta.porcentaje_igv / 100))).toFixed(2))
      }</a>
					</div>
				</div>
        <!-- /widget info -->
        <!-- Widget Info -->
				<div class="dt-widget__info" style="min-width: 100px;">
          <div class="dt-widget__title border-left text-right">	
          <a href="javascript:void(0)">S/. ${numeroConComas((detalle_venta.cantidad * detalle_venta.precio).toFixed(2))
      }</a>
					</div>
				</div>
        <!-- /widget info -->
			</div>
			<!-- /widgets item -->
			`;
    document.getElementById('tbodyVentaDetalle').innerHTML += row;
    $('[data-toggle="tooltip"]').tooltip();
  });

  document.getElementById('txtTotalGravada').innerHTML = sumaTotalOtro;
  document.getElementById('txtIgvTotal').innerHTML = sumaTotalPrecio - sumaTotalOtro;

  document.getElementById('txtImporteTotal').innerHTML = "S/. " + numeroConComas(sumaTotalPrecio.toFixed(2));
  document.getElementById('txtMontoPagado').value = parseFloat(sumaTotalPrecio).toFixed(2);
  document.getElementById('txtTotalPagado').innerText = numeroConComas(sumaTotalPrecio.toFixed(2));
  addEventsDetalleVenta();
};

var eliminarAtributosDetalleVenta = () => {
  listDetalleVenta.forEach(function (obj) {
    delete obj.presentacion['existencia_inicial'];
    delete obj.presentacion['existencia_inicial_otro'];
  });
};

//FACTURA


