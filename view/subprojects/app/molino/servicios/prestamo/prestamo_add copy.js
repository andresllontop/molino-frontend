var beanPaginationPrestamo;
var prestamoSelected;
var presentacionSelected;
var detalle_prestamoSelected;
var clienteSelected
var metodo = false;
var beanRequestPrestamo = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
  //invocar funcion agregar
  //addPrestamo();

  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestPrestamo.entity_api = 'api/prestamos';
  beanRequestPrestamo.operation = 'paginate';
  beanRequestPrestamo.type_request = 'GET';

  $('#FrmPrestamoModal').submit(function (event) {
    if (metodo) {
      beanRequestPrestamo.operation = 'update';
      beanRequestPrestamo.type_request = 'PUT';
      metodo = false;
    } else {
      //CONFIGURAMOS LA SOLICITUD
      beanRequestPrestamo.operation = 'add';
      beanRequestPrestamo.type_request = 'POST';
    }
    event.preventDefault();
    event.stopPropagation();
    // if (validateFormPrestamo()) {
    processAjaxPrestamo();
    // }
  });
  document.querySelector('#btnAbrirNewPrestamo').onclick = function () {
    $('[data-toggle="tooltip"]').tooltip("hide");
    displayPrestamo("show");
    processAjaxSeguroC();
  };
  document.querySelector(".cerrar-prestamo").onclick = () => {
    displayPrestamo("hide");

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
      e.target.nextElementSibling.nextElementSibling.classList.toggle("d-none");
      if (e.target.checked) {
        document.querySelector("#txtMontoPrestamo").value = Number(document.querySelector("#txtMontoSolicitadoPrestamo").value) + Number(document.querySelector("#txtMontoSeguroPrestamo").value) + Number(document.querySelector("#txt" + e.target.id + "Value").value);
        document.querySelector("#txtMontoSeguroPrestamo").value = Number(document.querySelector("#txtMontoSeguroPrestamo").value) + Number(document.querySelector("#txt" + e.target.id + "Value").value);

      } else {
        document.querySelector("#txtMontoPrestamo").value = Number(document.querySelector("#txtMontoSolicitadoPrestamo").value) + Number(document.querySelector("#txtMontoSeguroPrestamo").value) - Number(document.querySelector("#txt" + e.target.id + "Value").value);
        document.querySelector("#txtMontoSeguroPrestamo").value = Number(document.querySelector("#txtMontoSeguroPrestamo").value) - Number(document.querySelector("#txt" + e.target.id + "Value").value);

      }

    }


  });


  document.querySelector('#txtMontoSeguroPrestamo').addEventListener("keyup", (e) => {
    document.querySelector("#txtMontoPrestamo").value = Number(document.querySelector("#txtMontoSolicitadoPrestamo").value) + Number(e.target.value);

  });
  document.querySelector('#txtMontoSolicitadoPrestamo').addEventListener("keyup", (e) => {
    document.querySelector("#txtMontoPrestamo").value = Number(document.querySelector("#txtMontoSeguroPrestamo").value) + Number(e.target.value);

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
    eliminarAtributosDetallePrestamo();
    json = {
      prestamo: new Prestamo(
        parseInt(1),
        getFullDateJava()
      ),
      list: listDetallePrestamo
    };

  } else {
    circleCargando.container = $(document.querySelector("#tbodyPrestamo").parentElement);
    circleCargando.containerOcultar = $(document.querySelector("#tbodyPrestamo"));

  }
  circleCargando.createLoader();
  circleCargando.toggleLoader("show");
  switch (beanRequestPrestamo.operation) {
    case 'delete':
      parameters_pagination = '/' + prestamoSelected.idprestamo;
      break;
    case 'update':
      json.prestamo.idprestamo = prestamoSelected.idprestamo;
      break;
    case 'add':
      break;

    default:
      if (document.querySelector('#txtFilterPrestamo').value != '') {
        document.querySelector('#pagePrestamo').value = 1;
      }

      parameters_pagination +=
        '?fechai=' + document.querySelector('#txtFechaIFilterPrestamo').value;
      parameters_pagination +=
        '&fechaf=' + document.querySelector('#txtFechaFFilterPrestamo').value;
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
        listDetallePrestamo.length = 0;
        toListDetallePrestamo(listDetallePrestamo);
        document.querySelector('#FrmPresentacionC').dispatchEvent(new Event('submit'));
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
  /* VALIDAR PRODUCTO Y PRODUCTOCOLOR*/
  if (!validateFormPrestamo()) {
    return;
  }


  /* OPERACION AGREGAR*/
  let fechaf = getDateJava(diaPago(getDateStringToObject(document.querySelector('#txtFechaDesembolsoPrestamo').value), document.querySelector('#txtDiaPagoPrestamo').value));

  let capital_pendiente = document.querySelector("#txtMontoPrestamo").value;
  listCronograma.push(new Cronograma(
    "-",
    document.querySelector('#txtFechaDesembolsoPrestamo').value,
    redondearDecimal(capital_pendiente, 2),
    0,
    0,
    0,
    0

  ));

  let interes = redondearDecimal(capital_pendiente * (document.querySelector("#txtTasaEfectivaPrestamo").value / 100), 2);

  let valorCuota = redondearDecimal(metodoFrancesOperacionCuota(capital_pendiente, document.querySelector("#txtPlazoCuotaPrestamo").value, document.querySelector("#txtTasaEfectivaPrestamo").value / 100), 2);



  let amortizacion = redondearDecimal(valorCuota - interes, 2);

  let capital_amortizado = redondearDecimal(amortizacion, 2);

  capital_pendiente = redondearDecimal(capital_pendiente - amortizacion, 2);
  let fechai = document.querySelector('#txtFechaDesembolsoPrestamo').value;
  fechaf = getDateJava(
    diaPago(
      TipoCronogramaPrestamo(fechaf),
      parseInt(document.querySelector('#txtDiaPagoPrestamo').value)
    )
  );
  let dias = diferenciaFecha(getDateStringToObject(fechai), getDateStringToObject(fechaf));
  let factor = factorPorCuota(dias, calcularTED(calcularTEA(parseInt(document.querySelector('#txtPlazoCuotaPrestamo').value), parseInt(document.querySelector('#txtTasaEfectivaPrestamo').value) / 100)));
  for (let index = 1; index <= document.querySelector("#txtPlazoCuotaPrestamo").value; index++) {
    listCronograma.push(new Cronograma(
      fechai,
      fechaf,
      parseFloat(redondearDecimal(capital_pendiente, 2)),
      parseFloat(interes),
      parseFloat(amortizacion),
      parseFloat(valorCuota),
      parseFloat(capital_amortizado),
      dias,
      factor

    ));
    fechai = fechaf;
    fechaf = getDateJava(
      diaPago(
        TipoCronogramaPrestamo(fechaf),
        parseInt(document.querySelector('#txtDiaPagoPrestamo').value),
        index + 1
      )
    );
    dias += diferenciaFecha(getDateStringToObject(fechai), getDateStringToObject(fechaf));
    factor = factorPorCuota(dias, calcularTED(calcularTEA(parseInt(document.querySelector('#txtPlazoCuotaPrestamo').value), parseInt(document.querySelector('#txtTasaEfectivaPrestamo').value) / 100)));

    if (document.querySelector("#txtPlazoCuotaPrestamo").value - 1 == index) {

      interes = redondearDecimal(capital_pendiente * (document.querySelector("#txtTasaEfectivaPrestamo").value / 100), 2);

      amortizacion = redondearDecimal(valorCuota - interes, 2);

      capital_amortizado = redondearDecimal(capital_amortizado + amortizacion, 2);

      capital_pendiente = redondearDecimal(capital_pendiente - amortizacion, 2);
      amortizacion += capital_pendiente;
      capital_amortizado += capital_pendiente;
      valorCuota += capital_pendiente;
      capital_pendiente = 0;

    } else {
      interes = redondearDecimal(capital_pendiente * (document.querySelector("#txtTasaEfectivaPrestamo").value / 100), 2);
      amortizacion = redondearDecimal(valorCuota - interes, 2);
      capital_amortizado = redondearDecimal(capital_amortizado + amortizacion, 2);
      capital_pendiente = redondearDecimal(capital_pendiente - amortizacion, 2);
    }

  }
  toListDetallePrestamo(listCronograma);
};

var diaPago = (fecha, dia, tipo = 1) => {
  let fechaObject = fecha;

  //quincenal
  if (Number(document.querySelector("#txtTipoCronogramaPrestamo").value) == 2) {
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



  if (fechaObject.getDay() == 0) {
    return addDays(fechaObject, 1);
  }
  if (fechaObject.getDay() == 6) {
    return addDays(fechaObject, 2);
  }
  return fechaObject;

};

var TipoCronogramaPrestamo = (fechaTipo) => {
  switch (Number(document.querySelector("#txtTipoCronogramaPrestamo").value)) {
    case 1:
      return addMonths(getDateStringToObject(fechaTipo), 1);
    case 2:
      return addDays(getDateStringToObject(fechaTipo), 15);
    case 3:
      return addMonths(getDateStringToObject(fechaTipo), 3);
    default:
      return addDays(getDateStringToObject(fechaTipo), 30);
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
  listDetallePrestamo.push(
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
  listDetallePrestamo.forEach(
    (detalle) => {
      total += detalle.cantidad;
    }

  );
  return total;
};

var findByDetallePrestamo = (iddetalle_prestamo) => {

  return listDetallePrestamo.find(
    (detalle) => {
      if (parseInt(iddetalle_prestamo) == detalle.iddetalle_prestamo) {
        return detalle;
      }


    }
  );
};

var findByClienteDetallePrestamo = (idcliente) => {

  return listDetallePrestamo.find(
    (detalle) => {
      if (parseInt(idcliente) == detalle.presentacion.ubicacion_producto.cliente.idcliente) {
        return detalle;
      }


    }
  );
};

var findByPresentacionDetallePrestamo = (idpresentacion) => {

  return listDetallePrestamo.find(
    (detalle) => {
      if (parseInt(idpresentacion) == detalle.presentacion.idpresentacion) {
        return detalle;
      }


    }
  );
};

function findIndexDetallePrestamo(idbusqueda) {
  return listDetallePrestamo.findIndex(
    (cargo) => {
      if (cargo.iddetalle_prestamo == parseInt(idbusqueda))
        return cargo;


    }
  );
}

var eliminarDetallePrestamo = (idbusqueda) => {
  listDetallePrestamo.splice(findIndexDetallePrestamo(parseInt(idbusqueda)), 1);

};

var toListDetallePrestamo = (beanPagination) => {
  document.getElementById('tbodyPrestamoDetalle').innerHTML = "";
  let row = "";
  let sumaTotal1 = 0, sumaTotal2 = 0, sumaTotal3 = 0, contador = 0;
  if (beanPagination.length == 0) {
    row += `
    <tr>
    <td class="p-2">NO HAY OPERACIÓN</td>
    <tr>
  `;
    document.getElementById('tbodyPrestamoDetalle').innerHTML = row;
    return;
  }

  beanPagination.forEach((detalle_prestamo) => {
    sumaTotal1 += parseFloat(detalle_prestamo.amortizacion);
    sumaTotal2 += parseFloat(detalle_prestamo.interes);
    sumaTotal3 += parseFloat(detalle_prestamo.cuota);
    contador += 1;
    row += `
    <tr>
    <th scope="col">${contador}</th>
    <td scope="col">${detalle_prestamo.fecha_inicial}</td>
    <td scope="col">${detalle_prestamo.fecha_final}</td>
    <td scope="col">${detalle_prestamo.dias}</td>
    <td scope="col">S/. ${ numeroConComas(detalle_prestamo.capital_pendiente)}</td>
    <td scope="col">S/. ${ numeroConComas(detalle_prestamo.amortizacion)}</td>
    <td scope="col">S/. ${ numeroConComas(detalle_prestamo.interes)}</td>
    <td scope="col">S/. ${ numeroConComas(detalle_prestamo.capital_amortizado)}</td>
    <td scope="col">S/. ${ numeroConComas(detalle_prestamo.cuota)}</td>
    <tr>
			`;

  });

  row += `
  <tr>
  <th scope="col" class="p-2 font-weight-bold f-1" colspan="5">TOTAL</th>
  <td scope="col" class="p-2 font-weight-bold f-1">S/. ${numeroConComas(redondearDecimal(sumaTotal1, 2))}</td>
  <td scope="col" class="p-2 font-weight-bold f-1">S/. ${numeroConComas(redondearDecimal(sumaTotal2, 2))}</td>
  <td scope="col" class="p-2"></td>
  <td scope="col" class="p-2 font-weight-bold f-1">S/. ${numeroConComas(redondearDecimal(sumaTotal3, 2))}</td>
  <tr>
    `;
  document.getElementById('tbodyPrestamoDetalle').innerHTML = row;


};

var metodoFrancesOperacionCuota = (p, n, i) => {
  if (p == 0 || i == 0) {
    return 0;
  }
  return p * (i / (1 - (Math.pow(1 + i, -n))));

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
  return 1 / Math.pow(1 + TED, d)
}

var eliminarAtributosDetallePrestamo = () => {
  listDetallePrestamo.forEach(function (obj) {
    delete obj.presentacion['existencia_inicial'];
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
    document.querySelector('#txtMontoSolicitadoPrestamo'),
    document.querySelector('#txtTasaEfectivaPrestamo'),
    document.querySelector('#txtPlazoCuotaPrestamo'),
    document.querySelector('#txtTceaPrestamo'),
    document.querySelector('#txtMontoPrestamo'),
    document.querySelector('#txtDiaPagoPrestamo'),
    document.querySelector('#txtTceaPrestamo'),
    document.querySelector('#txtTipoCronogramaPrestamo'),
    document.querySelector('#txtTipoGraciaPrestamo'),
    document.querySelector('#txtTipoFechaPrestamo')
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
  if (document.querySelector('#txtMontoSolicitadoPrestamo').value == '') {
    document.querySelector('#txtMontoSolicitadoPrestamo').value = 0;
  }
  if (Number(document.querySelector('#txtDiaPagoPrestamo').value) > 30 || Number(document.querySelector('#txtDiaPagoPrestamo').value) < 0) {
    showAlertTopEnd('warning', 'Por favor ingrese tiene que ingresar un dia de pago valido');
    document.querySelector('#txtDiaPagoPrestamo').focus();
    return false;
  }
  return true;
};
var diferenciaFecha = (fechai, fechaf) => {
  return ((((fechaf.getTime() - fechai.getTime()) / 1000) / 60) / 60) / 24
}
