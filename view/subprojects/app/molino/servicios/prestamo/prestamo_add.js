var beanPaginationPrestamo;
var prestamoSelected;
var presentacionSelected;
var detalle_prestamoSelected;
var clienteSelected
var sumaFactor = 0;
var beanRequestPrestamo = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {

  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestPrestamo.entity_api = 'api/prestamos';
  beanRequestPrestamo.operation = 'paginate';
  beanRequestPrestamo.type_request = 'GET';

  $('#FrmPrestamoModal').submit(function (event) {

    if (validateFormPrestamo()) {
      processAjaxPrestamo();
    }
    event.preventDefault();
    event.stopPropagation();

  });
  document.querySelector('#btnAbrirNewPrestamo').onclick = function () {
    clienteSelected = undefined;
    document.querySelector(
      '#txtClienteUbicacionProducto'
    ).value = "";
    listCronograma.length = 0;
    listFactor.length = 0;
    //CONFIGURAMOS LA SOLICITUD
    beanRequestPrestamo.operation = 'add';
    beanRequestPrestamo.type_request = 'POST';
    document.querySelector('#TituloModalPrestamo').innerHTML =
      'REGISTRAR PRESTAMO';
    $('[data-toggle="tooltip"]').tooltip("hide");
    displayPrestamo("show");
    addPrestamo();
    processAjaxSeguroC();
  };
  document.querySelector(".cerrar-prestamo").onclick = () => {
    displayPrestamo("hide");
    beanRequestPrestamo.operation = 'paginate';
    beanRequestPrestamo.type_request = 'GET';
    processAjaxPrestamo();
  };


  /* FECHAS*/
  $('#txtFechaDesembolsoPrestamo').datetimepicker({
    format: 'DD/MM/YYYY',
    defaultDate: new Date(),
    lang: 'es',
    icons: calIcons

  });


  document.querySelector('#btnEliminarFechaDesembolsoPrestamo').onclick = function () {
    $('[data-toggle="tooltip"]').tooltip("hide");
    document.querySelector('#txtFechaDesembolsoPrestamo').value = '';
  };


  document.querySelector('#btnCalcularCronograma').onclick = function () {
    newSelected();
  };

  document.addEventListener("change", (e) => {
    if (e.target.type == "checkbox") {
      if (e.target.nextElementSibling.nextElementSibling == undefined) {
        return;
      }
      e.target.nextElementSibling.nextElementSibling.classList.toggle("d-none");
      if (e.target.checked) {

        document.querySelector("#txtMontoSeguroPrestamo").value = Number(document.querySelector("#txtMontoSeguroPrestamo").value) + Number(document.querySelector("#txt" + e.target.id + "Value").value);

      } else {

        document.querySelector("#txtMontoSeguroPrestamo").value = Number(document.querySelector("#txtMontoSeguroPrestamo").value) - Number(document.querySelector("#txt" + e.target.id + "Value").value);

      }

    }


  });


  /*document.querySelector('#txtMontoSeguroPrestamo').addEventListener("keyup", (e) => {
    document.querySelector("#txtMontoSolicitadoPrestamo").value = Number(document.querySelector("#txtMontoSolicitadoPrestamo").value) + Number(e.target.value);

  });
*/
  document.querySelector('#txtTipoFechaPrestamo').addEventListener("change", (e) => {

    if (e.target.value == 1) {
      removeClass(document.querySelector("#txtDiaPagoPrestamo").parentElement, "d-none");
    } else {
      document.querySelector("#txtDiaPagoPrestamo").value = "";
      addClass(document.querySelector("#txtDiaPagoPrestamo").parentElement, "d-none");
    }
  });


});


/* AJAX */
var processAjaxPrestamo = () => {

  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");

  let parameters_pagination = '';
  let json = '';
  if (
    beanRequestPrestamo.operation == 'add' ||
    beanRequestPrestamo.operation == 'update'
  ) {
    circleCargando.container = $(document.querySelector("#tbodyPrestamoDetalle").parentElement.parentElement);
    circleCargando.containerOcultar = $(document.querySelector("#tbodyPrestamoDetalle").parentElement);
    if (listCronograma.length == 0) {
      return;
    }

    eliminarAtributosDetallePrestamo();
    json = {
      prestamo_cliente: {
        fecha: document.querySelector('#txtFechaDesembolsoPrestamo').value,
        monto: parseFloat(document.querySelector('#txtMontoSolicitadoPrestamo').value),
        tasa_porcentaje: parseFloat(document.querySelector('#txtTasaEfectivaPrestamo').value),
        tipo_cronograma: parseInt(document.querySelector('#txtTipoCronogramaPrestamo').value),
        tipo_fecha: parseInt(document.querySelector('#txtTipoFechaPrestamo').value),
        plazo: parseInt(document.querySelector('#txtPlazoCuotaPrestamo').value),
        dia_plazo: parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
        cliente: clienteSelected
      },
      list: listCronograma
    };

  } else {
    circleCargando.container = $(document.querySelector("#tbodyPrestamo").parentElement);
    circleCargando.containerOcultar = $(document.querySelector("#tbodyPrestamo"));

  }
  circleCargando.createLoader();
  circleCargando.toggleLoader("show");
  switch (beanRequestPrestamo.operation) {
    case 'delete':
      parameters_pagination = '/' + prestamoSelected.idprestamo_cliente;
      break;
    case 'update':
      json.prestamo_cliente.idprestamo_cliente = prestamoSelected.idprestamo_cliente;
      break;
    case 'add':
      break;

    default:
      clienteSelected
      parameters_pagination +=
        '?fechai=' + document.querySelector('#txtFechaIFilterPrestamo').value;
      parameters_pagination +=
        '&fechaf=' + document.querySelector('#txtFechaFFilterPrestamo').value;
      parameters_pagination +=
        '&id=' + (clienteSelected == undefined ? 0 : clienteSelected.idcliente);
      parameters_pagination +=
        '&page=' + document.querySelector('#pagePrestamo').value;
      parameters_pagination +=
        '&size=' + document.querySelector('#sizePagePrestamo').value;
      break;
  }
  var xhr = new XMLHttpRequest();
  xhr = RequestServer(beanRequestPrestamo, json, parameters_pagination,
    circleCargando.loader.firstElementChild);
  xhr.onload = () => {
    circleCargando.toggleLoader("hide");
    beanCrudResponse = xhr.response;
    if (beanCrudResponse.messageServer !== undefined) {
      if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
        showAlertTopEnd('success', 'Acción realizada exitosamente');
        listCronograma.length = 0;
        toListDetallePrestamo(listCronograma);
        if (beanRequestPrestamo.operation == "delete") {
          document.querySelector('#FrmPrestamo').dispatchEvent(new Event('submit'));
        }

      } else {
        showAlertTopEnd('warning', beanCrudResponse.messageServer);
      }
    }
    if (beanCrudResponse.beanPagination !== undefined) {
      beanPaginationPrestamo = beanCrudResponse.beanPagination;
      toListPrestamo(beanPaginationPrestamo);
    }
  };
};

/* DETALLE PRESTAMO*/
var newSelected = () => {
  listCronograma.length = 0;
  listFactor.length = 0;
  /* VALIDAR PRODUCTO Y PRODUCTOCOLOR*/
  if (!validateFormPrestamo()) {
    return;
  }
  if (listFactor.length == 0) {
    calcularCuota();
  }


  /* OPERACION AGREGAR*/
  let fechaf = getDateJava(diaPago(getDateStringToObject(document.querySelector('#txtFechaDesembolsoPrestamo').value), document.querySelector('#txtDiaPagoPrestamo').value));

  let capital = document.querySelector("#txtMontoSolicitadoPrestamo").value;
  listCronograma.push(new Cronograma(
    document.querySelector('#txtFechaDesembolsoPrestamo').value,
    document.querySelector('#txtFechaDesembolsoPrestamo').value,
    redondearDecimal(capital, 4),
    0,
    0,
    0,
    0,
    0,
    0

  ));
  let valorCuota = (parseFloat(document.querySelector("#txtMontoSolicitadoPrestamo").value) / sumaFactor);
  let conteo = 1;
  let fechai = document.querySelector('#txtFechaDesembolsoPrestamo').value;
  fechaf = getDateJava(
    diaPago(
      TipoCronogramaPrestamo(fechaf),
      parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
      conteo
    )
  );
  let dias = diferenciaFecha(getDateStringToObject(fechai), getDateStringToObject(fechaf));


  if (dias < 28) {

    fechaf = getDateJava(
      diaPago(
        TipoCronogramaPrestamo(fechaf),
        parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
        conteo
      )
    );


    dias = diferenciaFecha(getDateStringToObject(fechai), getDateStringToObject(fechaf));
  }
  if (Number(document.querySelector("#txtTipoCronogramaPrestamo").value) == 2) {
    if (dias < 0 && dias >= -15) {
      fechaf = getDateJava(
        diaPago(
          addMonths(getDateStringToObject(fechaf), 1),
          parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
          2
        )
      );

    } else if (dias < 0 && dias < -15) {
      fechaf = getDateJava(
        diaPago(
          addDays(addMonths(getDateStringToObject(fechaf), 1), 15),
          parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
          2
        )
      );
      conteo++;
    } else {
      fechaf = getDateJava(
        diaPago(
          TipoCronogramaPrestamo(fechaf),
          parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
          2
        )
      );
      conteo++;
    }
    dias = diferenciaFecha(getDateStringToObject(fechai), getDateStringToObject(fechaf));
  }


  let interes = interesPorCuota(document.querySelector("#txtMontoSolicitadoPrestamo").value, dias, calcularTED(calcularTEA(parseFloat(document.querySelector('#txtPlazoCuotaPrestamo').value), parseFloat(document.querySelector('#txtTasaEfectivaPrestamo').value) / 100)));

  let amortizacion = valorCuota - interes;

  capital = capital - amortizacion;
  conteo++;

  listFactor.forEach((fatores) => {

    listCronograma.push(new Cronograma(
      fechai,
      fechaf,
      redondearDecimal(parseFloat(capital), 4),
      redondearDecimal(parseFloat(interes), 4),
      redondearDecimal(parseFloat(amortizacion), 4),
      redondearDecimal(parseFloat(valorCuota) * parseFloat(document.querySelector('#txtMontoSeguroPrestamo').value == '' ? 0 : (document.querySelector('#txtMontoSeguroPrestamo').value / 100)), 4),
      dias,
      fatores.factor,
      redondearDecimal(parseFloat(document.querySelector('#txtMontoSeguroPrestamo').value == '' ? 0 : document.querySelector('#txtMontoSeguroPrestamo').value), 4),
      redondearDecimal(valorCuota * parseFloat(document.querySelector('#txtITFPrestamo').value == '' ? 0 : document.querySelector('#txtITFPrestamo').value / 100), 4)
    ));

    fechai = fechaf;
    fechaf = getDateJava(
      diaPago(
        TipoCronogramaPrestamo(fechaf),
        parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
        conteo
      )
    );
    dias = diferenciaFecha(getDateStringToObject(fechai), getDateStringToObject(fechaf));


    interes = interesPorCuota(capital, dias, calcularTED(calcularTEA(parseFloat(document.querySelector('#txtPlazoCuotaPrestamo').value), parseFloat(document.querySelector('#txtTasaEfectivaPrestamo').value) / 100)));
    amortizacion = valorCuota - interes;
    capital = capital - amortizacion;


    conteo++;


  });
  toListDetallePrestamo(listCronograma);
};

var diaPago = (fecha, dia, tipo = 1) => {
  let fechaObject = fecha;

  if (document.querySelector('#txtTipoFechaPrestamo').value == "1" && document.querySelector('#txtDiaPagoPrestamo').value != "") {
    //quincenal
    if (Number(document.querySelector("#txtTipoCronogramaPrestamo").value) == 2) {
      //si es par el tipo
      if (tipo % 2 == 1) {
        if (fechaObject.getDate() > dia) {
          fechaObject = removeDays(fechaObject, fechaObject.getDate() - dia);
        } else if (fechaObject.getDate() < dia) {
          fechaObject = addDays(fechaObject, dia - fechaObject.getDate());
        }
      }
    }//mensual y trimestral
    else {
      if (fechaObject.getDate() > dia) {

        fechaObject = removeDays(fechaObject, fechaObject.getDate() - dia);

      } else if (fechaObject.getDate() < dia) {
        fechaObject = addDays(fechaObject, dia - fechaObject.getDate());
      }
    }

  }



  if (fechaObject.getDay() == 0) {
    return addDays(fechaObject, 1);
  }
  if (fechaObject.getDay() == 6) {
    return addDays(fechaObject, 2);
  }
  return fechaObject;

};

var TipoCronogramaPrestamo = (fecha) => {
  switch (Number(document.querySelector("#txtTipoCronogramaPrestamo").value)) {
    case 1:
      return addMonths(getDateStringToObject(fecha), 1);
    case 2:

      return addDays(getDateStringToObject(fecha), 15);
    case 3:
      return addMonths(getDateStringToObject(fecha), 3);
    default:
      return addDays(getDateStringToObject(fecha), 30);
  }
}

var cantidadDetallePrestamo = (eleme, btn) => {
  if (numeroSepararDecimal(btn.value).length > 1)
    btn.value = parseInt(btn.value);

  if (btn.value < 1) {
    btn.value = 0;
    return false;
  }
  prestamoSelected = findByDetallePrestamo(eleme.getAttribute('iddetalle_prestamo'));
  if (prestamoSelected == undefined) return false;
  if (prestamoSelected.presentacion.existencia_inicial < parseInt(btn.value)) {
    showAlertTopEnd('info', 'Cantidad excedida, no hay los suficientes Productos en el almacén.');
    btn.value = 1;
    return false;
  }
  eliminarDetallePrestamo(prestamoSelected.iddetalle_prestamo);
  prestamoSelected.presentacion.existencia = (prestamoSelected.presentacion.existencia_inicial - parseInt(btn.value));
  listCronograma.push(
    new Object(
      new Detalle_Prestamo(
        prestamoSelected.iddetalle_prestamo,
        prestamoSelected.presentacion,
        parseInt(btn.value)
      )
    )
  );
  document.getElementById('txtTotal').innerText = totalByDetallePrestamo();
  return true;
};


var totalByDetallePrestamo = () => {
  let total = 0;
  listCronograma.forEach(
    (detalle) => {
      total += detalle.cantidad;
    }

  );
  return total;
};

var findByDetallePrestamo = (iddetalle_prestamo) => {

  return listCronograma.find(
    (detalle) => {
      if (parseInt(iddetalle_prestamo) == detalle.iddetalle_prestamo) {
        return detalle;
      }


    }
  );
};

var findByClienteDetallePrestamo = (idcliente) => {

  return listCronograma.find(
    (detalle) => {
      if (parseInt(idcliente) == detalle.presentacion.ubicacion_producto.cliente.idcliente) {
        return detalle;
      }


    }
  );
};

var findByPresentacionDetallePrestamo = (idpresentacion) => {

  return listCronograma.find(
    (detalle) => {
      if (parseInt(idpresentacion) == detalle.presentacion.idpresentacion) {
        return detalle;
      }


    }
  );
};

function findIndexDetallePrestamo(idbusqueda) {
  return listCronograma.findIndex(
    (cargo) => {
      if (cargo.iddetalle_prestamo == parseInt(idbusqueda))
        return cargo;


    }
  );
}

var eliminarDetallePrestamo = (idbusqueda) => {
  listCronograma.splice(findIndexDetallePrestamo(parseInt(idbusqueda)), 1);

};

var toListDetallePrestamo = (beanPagination) => {
  document.getElementById('tbodyPrestamoDetalle').innerHTML = "";
  let row = "";
  let sumaTotal1 = 0, sumaTotal2 = 0, sumaTotal3 = 0, contador = 0, sumaseguro = 0, sumaitf = 0;
  if (beanPagination.length == 0) {
    row += `
    <tr>
    <td class="p-2" colspan="10">NO HAY OPERACIÓN</td>
    <tr>
  `;
    document.getElementById('tbodyPrestamoDetalle').innerHTML = row;
    return;
  }

  beanPagination.forEach((detalle_prestamo) => {
    sumaTotal1 += parseFloat(detalle_prestamo.amortizacion);
    sumaTotal2 += parseFloat(detalle_prestamo.interes);
    sumaTotal3 += parseFloat(detalle_prestamo.cuota);
    sumaseguro += parseFloat(detalle_prestamo.seguro);
    sumaitf += parseFloat(detalle_prestamo.itf);
    contador += 1;
    row += `
    <tr>
    <th scope="col">${contador}</th>
    <td scope="col">${detalle_prestamo.fecha_inicial}</td>
    <td scope="col">${detalle_prestamo.fecha_final}</td>
    <td scope="col">${detalle_prestamo.dias}</td>
    <td scope="col">S/. ${ numeroConComas(redondearDecimal(detalle_prestamo.capital, 2))}</td>
    <td scope="col">S/. ${ numeroConComas(redondearDecimal(detalle_prestamo.amortizacion, 2))}</td>
    <td scope="col">S/. ${ numeroConComas(redondearDecimal(detalle_prestamo.interes, 2))}</td>
    <td scope="col">S/. ${ numeroConComas(redondearDecimal(detalle_prestamo.seguro, 2))}</td>
    <td scope="col">S/. ${ numeroConComas(redondearDecimal(detalle_prestamo.itf, 4))}</td>
    <td scope="col">S/. ${ numeroConComas(redondearDecimal(detalle_prestamo.cuota, 2))}</td>
    <tr>
			`;

  });

  row += `
  <tr>
  <th scope="col" class="p-2 font-weight-bold f-1 text-center" colspan="5">TOTAL</th>
  <td scope="col" class="p-2 font-weight-bold f-1">S/. ${numeroConComas(redondearDecimal(sumaTotal1, 2))}</td>
  <td scope="col" class="p-2 font-weight-bold f-1">S/. ${numeroConComas(redondearDecimal(sumaTotal2, 2))}</td>
  <td scope="col" class="p-2 font-weight-bold f-1">S/. ${numeroConComas(redondearDecimal(sumaseguro, 2))}</td>
  <td scope="col" class="p-2 font-weight-bold f-1">S/. ${numeroConComas(redondearDecimal(sumaitf, 4))}</td>
  <td scope="col" class="p-2 font-weight-bold f-1">S/. ${numeroConComas(redondearDecimal(sumaTotal3, 2))}</td>
  <tr>
    `;
  document.getElementById('tbodyPrestamoDetalle').innerHTML = row;


};


//TASA EFECTIVA ANUAL
var calcularTEA = (n, i) => {
  //n:numero de plazos
  //i:tasa efectiva mensual fija
  return Math.pow(1 + i, n) - 1
}
//TASA EFECTIVA DIARIA
var calcularTED = (TEA) => {

  return Math.pow(1 + TEA, 1 / 360) - 1
}
var factorPorCuota = (d, TED) => {
  return 1 / Math.pow(1 + TED, d);
}
var interesPorCuota = (m, d, TED) => {
  return m * (Math.pow(1 + TED, d) - 1)
}
var eliminarAtributosDetallePrestamo = () => {
  listCronograma.forEach(function (obj) {
    delete obj['dias'];
    delete obj['factor'];
  });
};

var redondearDecimal = (numero, decimales) => {
  let numeroRegex = new RegExp('\\d\\.(\\d){' + decimales + ',}');
  if (numeroRegex.test(parseFloat(numero)))
    return Number(parseFloat(numero).toFixed(decimales));
  else
    return Number(parseFloat(numero).toFixed(decimales)) === 0 ? 0 : Number(parseFloat(numero).toFixed(2));

};

var validateFormPrestamo = () => {
  if (clienteSelected == undefined) {
    showAlertTopEnd('info', 'Por favor ingrese Cliente');
    return false;
  }
  let numero = numero_campo(
    document.querySelector('#txtTasaEfectivaPrestamo'),
    document.querySelector('#txtPlazoCuotaPrestamo'),
    document.querySelector('#txtTceaPrestamo'),
    document.querySelector('#txtMontoSolicitadoPrestamo'),
    document.querySelector('#txtDiaPagoPrestamo'),
    document.querySelector('#txtTipoCronogramaPrestamo'),
    document.querySelector('#txtTipoGraciaPrestamo')

  );

  if (numero != undefined) {
    numero.focus();
    numero.labels[0].style.fontWeight = '600';
    addClass(numero.labels[0], 'text-danger');
    if (numero.value == '') {
      showAlertTopEnd('info', 'Por favor ingrese ' + numero.labels[0].innerText);
    } else {
      showAlertTopEnd(
        'info',
        'Por favor ingrese sólo números al campo ' + numero.labels[0].innerText
      );
    }

    return false;
  }

  if (document.querySelector('#txtTipoFechaPrestamo').value != "") {
    if (Number(document.querySelector('#txtDiaPagoPrestamo').value) > 30 || Number(document.querySelector('#txtDiaPagoPrestamo').value) < 0) {
      showAlertTopEnd('warning', 'Por favor ingrese tiene que ingresar un dia de pago valido');
      document.querySelector('#txtDiaPagoPrestamo').focus();
      return false;
    }
  }

  return true;
};

var diferenciaFecha = (fechai, fechaf) => {
  return ((((fechaf.getTime() - fechai.getTime()) / 1000) / 60) / 60) / 24
}

var calcularCuota = () => {
  sumaFactor = 0;
  let fechai, fechaf, dias, factor, conteo = 1;
  fechaf = getDateJava(diaPago(getDateStringToObject(document.querySelector('#txtFechaDesembolsoPrestamo').value), document.querySelector('#txtDiaPagoPrestamo').value));
  fechai = document.querySelector('#txtFechaDesembolsoPrestamo').value;
  fechaf = getDateJava(
    diaPago(
      TipoCronogramaPrestamo(fechaf),
      parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
      conteo
    )
  );
  dias = diferenciaFecha(getDateStringToObject(fechai), getDateStringToObject(fechaf));
  if (dias < 28) {

    fechaf = getDateJava(
      diaPago(
        TipoCronogramaPrestamo(fechaf),
        parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
        conteo
      )
    );


    dias = diferenciaFecha(getDateStringToObject(fechai), getDateStringToObject(fechaf));
  }
  if (Number(document.querySelector("#txtTipoCronogramaPrestamo").value) == 2) {
    if (dias < 0 && dias >= -15) {
      fechaf = getDateJava(
        diaPago(
          addMonths(getDateStringToObject(fechaf), 1),
          parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
          2
        )
      );

    } else if (dias < 0 && dias < -15) {
      fechaf = getDateJava(
        diaPago(
          addDays(addMonths(getDateStringToObject(fechaf), 1), 15),
          parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
          2
        )
      );
      conteo++;
    } else {
      fechaf = getDateJava(
        diaPago(
          TipoCronogramaPrestamo(fechaf),
          parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
          2
        )
      );
      conteo++;
    }
    dias = diferenciaFecha(getDateStringToObject(fechai), getDateStringToObject(fechaf));
  }
  factor = factorPorCuota(dias, calcularTED(calcularTEA(parseFloat(document.querySelector('#txtPlazoCuotaPrestamo').value), parseFloat(document.querySelector('#txtTasaEfectivaPrestamo').value) / 100)));
  sumaFactor += factor;

  listFactor.push(new Factor_Prestamo(
    fechai,
    fechaf,
    dias,
    factor

  ));
  conteo++;
  for (let index = 1; index < document.querySelector("#txtPlazoCuotaPrestamo").value; index++) {

    fechai = fechaf;
    fechaf = getDateJava(
      diaPago(
        TipoCronogramaPrestamo(fechaf),
        parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
        conteo
      )
    );
    dias += diferenciaFecha(getDateStringToObject(fechai), getDateStringToObject(fechaf));
    factor = factorPorCuota(dias, calcularTED(calcularTEA(parseFloat(document.querySelector('#txtPlazoCuotaPrestamo').value), parseFloat(document.querySelector('#txtTasaEfectivaPrestamo').value) / 100)));

    sumaFactor += factor;
    listFactor.push(new Factor_Prestamo(
      fechai,
      fechaf,
      dias,
      factor

    ));
    conteo++;
  }


}