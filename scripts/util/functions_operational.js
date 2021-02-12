/*
 * PAGINATION
 */

function getDefaultOptionsPagination() {
  var defaultOpts = {
    totalPages: 10,
    visiblePages: 5,
    initiateStartPageClick: false,
    first:
      "<i class='icon icon-double-arrow-left icon-sisbu' aria-hidden='true'></i>",
    prev:
      "<i class='icon icon-chevrolet-left icon-sisbu' aria-hidden='true'></i>",
    next:
      "<i class='icon icon-chevrolet-right icon-sisbu' aria-hidden='true'></i>",
    last:
      "<i class='icon icon-double-arrow-right icon-sisbu' aria-hidden='true'></i>"

		/*
                 * first: "<i class='fa fa-angle-double-left' aria-hidden='true'></i>",
                 prev: "<i class='fa fa-angle-left' aria-hidden='true'></i>",
                 next: "<i class='fa fa-angle-right' aria-hidden='true'></i>",
                 last: "<i class='fa fa-angle-double-right' aria-hidden='true'></i>"
                 */
  };
  // icon icon-company icon-fw
  return defaultOpts;
}

function getOptionsPagination(
  count_filter,
  sizePage,
  $pageInput,
  $modalLoanding,
  $beanRequest
) {
  var totalPages; // = (count_filter / $sizePage.val()) + 1;
  if (count_filter >= sizePage) {
    if (count_filter % sizePage == 0) {
      totalPages = count_filter / sizePage;
    } else {
      totalPages = count_filter / sizePage + 1;
    }
  } else {
    totalPages = 1;
  }
  var options = {
    startPage: parseInt($pageInput.value),
    totalPages: totalPages,
    visiblePages: 5,
    initiateStartPageClick: false,
    first:
      "<i class='icon icon-double-arrow-left icon-sisbu' aria-hidden='true'></i>",
    prev:
      "<i class='icon icon-chevrolet-left icon-sisbu' aria-hidden='true'></i>",
    next:
      "<i class='icon icon-chevrolet-right icon-sisbu' aria-hidden='true'></i>",
    last:
      "<i class='icon icon-double-arrow-right icon-sisbu' aria-hidden='true'></i>",
    onPageClick: function (evt, page) {
      $pageInput.value = page;
      $modalLoanding();
    }
  };
  return options;
}

function buildPagination(
  count_filter,
  sizePage,
  $pageInput,
  $modalLoanding,
  $beanRequest,
  $pagination
) {
  let options = getOptionsPagination(
    count_filter,
    sizePage,
    $pageInput,
    $modalLoanding,
    $beanRequest
  );
  destroyPagination($pagination);
  $pagination.twbsPagination(
    $.extend({}, getDefaultOptionsPagination(), options)
  );
}

function destroyPagination($pagination) {
  $pagination.twbsPagination('destroy');
}

/*
 * SELECT PAGINATION
 */
function addEventsSelectPaginar(_class) {
  document.querySelectorAll('.' + _class).forEach((select) => {
    select.onchange = function () {
      console.log(this.value);
      $('#' + select.getAttribute('idbtnbuscar')).trigger('click');
      //document.querySelector("#" + select.getAttribute('idbtnbuscar')).dispatchEvent(new Event('click'));
    };
  });
}

function getFullNameShortUser(usuario) {
  let full_name = '';
  if (usuario.nombre != undefined && usuario.apellido_pat != undefined) {
    if (usuario.nombre.includes(' ')) {
      full_name += getStringCapitalize(
        usuario.nombre.split(' ')[0].toLowerCase()
      );
    } else {
      full_name += getStringCapitalize(usuario.nombre.toLowerCase());
    }
    full_name += ' ' + getStringCapitalize(usuario.apellido_pat.toLowerCase());
  }
  if (full_name == '' || full_name == ' ') {
    full_name = getStringCapitalize(usuario.alias);
  }
  return full_name;
}

function getStringCapitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function getTimesTampJavaScriptCurrent() {
  let f = new Date();
  let f_ = '';
  if (f.getDate() < 10) {
    f_ += '0' + f.getDate();
  } else {
    f_ += f.getDate();
  }
  f_ += '/';
  if (f.getMonth() < 9) {
    f_ += '0' + (f.getMonth() + 1);
  } else {
    f_ += f.getMonth() + 1;
  }
  f_ += '/';
  f_ += f.getFullYear();
  f_ += ' ';

  if (f.getHours() <= 11) {
    ampm = ' AM';
    if (f.getHours() == 0) {
      f_ += 12;
    } else {
      f_ += f.getHours();
    }
  } else {
    ampm = ' PM';
    f_ += f.getHours() - 12;
  }
  f_ += ':';
  if (f.getMinutes() < 10) {
    f_ += '0' + f.getMinutes();
  } else {
    f_ += f.getMinutes();
  }
  f_ += ampm;
  return f_;
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
function removeDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}
function addMonths(date, months) {
  var result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}
function removeMonths(date, months) {
  var result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}
function getDateStringToObject(s) {
  if (typeof s !== 'string') return '';
  let array = s.split("/");
  return new Date(array[2], array[1] - 1, array[0]);
}
function getDateJava(date = new Date()) {
  //FORMAT dd/MM/yyyy HH:mm:ss
  return getDateStringJava(date);
}

function getFullDateJava(date = new Date()) {
  //FORMAT dd/MM/yyyy HH:mm:ss
  string_full_date = getDateStringJava(date);
  string_full_date += " ";
  string_full_date += getHourStringJava(date);
  return string_full_date;
}

function getDateStringJava(date = new Date()) {
  //let date = new Date();
  let string_date = "";
  if (date.getDate() < 10) {
    string_date += "0" + date.getDate();
  } else {
    string_date += date.getDate();
  }
  string_date += "/";
  if (date.getMonth() < 9) {
    string_date += "0" + (date.getMonth() + 1);
  } else {
    string_date += (date.getMonth() + 1);
  }
  string_date += "/";
  string_date += date.getFullYear();
  return string_date;
}
function getDateText(date = new Date()) {
  //let date = new Date();
  let array_date = date.toString().split(" ");
  return array_date[2] + " " +
    array_date[1] + ", " +
    array_date[3];
}

function getHourStringJava(date = new Date()) {
  string_date = "";
  //let date = new Date();
  if (date.getHours() < 10) {
    string_date += "0" + date.getHours();
  } else {
    string_date += date.getHours();
  }
  string_date += ":";
  if (date.getMinutes() < 10) {
    string_date += "0" + date.getMinutes();
  } else {
    string_date += date.getMinutes();
  }
  string_date += ":";
  if (date.getSeconds() < 10) {
    string_date += "0" + date.getSeconds();
  } else {
    string_date += date.getSeconds();
  }
  return string_date;
}
function addClass(element, class_) {
  class_.split(' ').forEach(function (class_iterator) {
    element.classList.add(class_iterator);
  });
}

function removeClass(element, class_) {
  class_.split(' ').forEach(function (class_iterator) {
    element.classList.remove(class_iterator);
  });
}
/*
 * VALIDADORES
 */
const limpiar_campo = (cadena) => {
  cadena = cadena.trim();
  cadena = cadena.replace('<script>', '');
  cadena = cadena.replace('</script>', '');
  cadena = cadena.replace('<script src', '');
  cadena = cadena.replace('<script type', '');
  cadena = cadena.replace('SELECT * FROM', '');
  cadena = cadena.replace('DELETE FROM', '');
  cadena = cadena.replace('INSERT FROM', '');
  cadena = cadena.replace('=', '');
  cadena = cadena.replace('^', '');
  cadena = cadena.replace('{', '');
  cadena = cadena.replace('}', '');
  cadena = cadena.replace('´', '');
  return cadena;
};
const numero_campo = (campo1, ...campoN) => {
  let numero = /^[0-9.]*$/;
  let dato1 = limpiar_campo(campo1.value),
    datoN = '',
    retorno;
  dato1 = eliminarCaracteres(dato1, " ");
  let valor = numero.test(dato1) && (dato1 == '' ? false : true);
  if (valor) {
    if (campo1.labels.length > 0)
      removeClass(campo1.labels[0], 'text-danger font-weight-400');

    campoN.every((campon) => {
      datoN = limpiar_campo(campon.value);
      datoN = eliminarCaracteres(datoN, " ");
      valor = numero.test(datoN) && valor && (datoN == '' ? false : true);
      if (valor == false) {
        retorno = campon;
        return;
      } else {
        if (campon.labels.length > 0)
          removeClass(campon.labels[0], 'text-danger font-weight-400');
      }
    });
  } else {
    retorno = campo1;
  }
  return retorno;
};
const letra_numero_campo = (campo1, ...campoN) => {
  let letra = /^[\u00F1A-Za-z0-9.-áéióúÁÉÍÓÚ\-\s]*$/;
  let dato1 = limpiar_campo(campo1.value),
    datoN = '',
    retorno;
  let valor = letra.test(dato1) && (dato1 == '' ? false : true);

  if (valor == true) {
    if (campo1.labels.length > 0)
      removeClass(campo1.labels[0], 'text-danger font-weight-400');
    campoN.every((campon) => {
      datoN = limpiar_campo(campon.value);
      valor = letra.test(datoN) && valor && (datoN == '' ? false : true);
      if (valor == false) {
        retorno = campon;

        return;
      } else {
        if (campon.labels.length > 0)
          removeClass(campon.labels[0], 'text-danger font-weight-400');
      }
    });
  } else {
    retorno = campo1;
  }

  return retorno;
};
const letra_campo = (campo1, ...campoN) => {
  let letra = /^[A-Za-záéíóúÁÉÍÓÚ\-.\s]*$/;
  let dato1 = limpiar_campo(campo1.value),
    datoN = '',
    retorno;
  let valor = letra.test(dato1) && (dato1 == '' ? false : true);
  if (valor == true) {
    if (campo1.labels.length > 0)
      removeClass(campo1.labels[0], 'text-danger font-weight-400');
    campoN.every((campon) => {
      datoN = limpiar_campo(campon.value);
      valor = letra.test(datoN) && valor && (datoN == '' ? false : true);
      if (valor == false) {
        retorno = campon;

        return;
      } else {
        if (campon.labels.length > 0)
          removeClass(campon.labels[0], 'text-danger font-weight-400');
      }
    });
  } else {
    retorno = campo1;
  }

  return retorno;
};
const email_campo = (campo1, ...campoN) => {
  let email = /^[_A-Za-z0-9-\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/;

  let dato1 = limpiar_campo(campo1.value),
    datoN = '',
    retorno;
  dato1 = eliminarCaracteres(dato1, " ");
  let valor = email.test(dato1) && (dato1 == '' ? false : true);
  if (valor) {
    if (campo1.labels.length > 0)
      removeClass(campo1.labels[0], 'text-danger font-weight-400');

    campoN.every((campon) => {
      datoN = limpiar_campo(campon.value);
      datoN = eliminarCaracteres(datoN, " ");
      valor = email.test(datoN) && valor && (datoN == '' ? false : true);
      if (valor == false) {
        retorno = campon;
        return;
      } else {
        if (campon.labels.length > 0)
          removeClass(campon.labels[0], 'text-danger font-weight-400');
      }
    });
  } else {
    retorno = campo1;
  }
  return retorno;
};
var eliminarCaracteres = (texto = '', patron = '') =>
  !texto ? null : !patron ? null : texto.replace(new RegExp(patron, 'ig'), '');

var numeroConComas = (valor) => {
  let numero = numeroSepararDecimal(valor);
  let decimal = '';
  if (numero.length > 1) {
    decimal = numero.pop();
  }
  numero.join('');
  let nums = new Array();
  nums = numero
    .toString()
    .replace(/\D/g, '')
    .split('');
  let long = nums.length - 1;
  let prox = 2;
  while (long > prox) {
    nums.splice(long - prox, 0, ',');
    prox += 3;
  }
  return nums.join('').concat(decimal);
};
var numeroSepararDecimal = (texto) => texto.toString().match(/[^\s][\d]*/g);
