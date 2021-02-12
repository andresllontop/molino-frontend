var calIcons = {
  time: 'icon icon-time',
  date: 'icon icon-calendar',
  up: 'icon icon-chevrolet-up',
  down: 'icon icon-chevrolet-down',
  previous: 'icon icon-chevrolet-left',
  next: 'icon icon-chevrolet-right',
  clear: 'icon icon-trash'
};

function showAlertTopEnd(type, message, timer = 4000) {
  showAlertTop(type, message, timer, 'top-end');
}

var SwalProgress = () => {
  self.showProgress = (message) => {
    swal({ title: message });
    swal.showLoading();
    document.getElementsByClassName('swal2-popup')[0].style.width = 'auto';
    addClass(document.getElementsByClassName('swal2-popup')[0], 'p-2');
    addClass(document.getElementsByClassName('swal2-title')[0], 'm-0');
    addClass(document.getElementsByClassName('swal2-actions')[0], 'm-0');
  };

  self.hideProgress = function () {
    swal.close();
  };
};

function showAlertTop(type, message, timer_, position_) {
  const Toast = Swal.mixin({
    toast: true,
    position: position_,
    showConfirmButton: false,
    timer: timer_
  });

  //8 PALABRAS COMO MAXIMO POR FILA
  if (message.split(' ').length > 6) {
    Toast.fire({
      type: type,
      title: getTextHtmlFormat(message, 6)
    });
  } else {
    Toast.fire({
      type: type,
      title: message
    });
  }
}

function showAlertDelete(idmodal) {
  Swal.fire({
    title: '¿Desea eliminar este registro?',
    text: 'No podrás revertir una vez confirmado!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, continuar',
    cancelButtonText: 'No, cancelar'
  }).then((result) => {
    if (result.value) {
      $('#' + idmodal).modal('show');
    }
  });
  //$('.swal2-confirm').css("margin-right", "15px");
}

function getTextHtmlFormat(text, count_palabras_for_row) {
  let values_palabras = text.split(' ');
  let text_formatter = '';
  let multiplo = 1;

  values_palabras.forEach(function (value, index) {
    if (index == count_palabras_for_row * multiplo - 1) {
      text_formatter += ' ' + value + '<br>';
      multiplo++;
    } else {
      text_formatter += ' ' + value;
    }
  });
  return text_formatter;
}

function showAlertErrorRequest() {
  showAlertTopEnd('error', 'Error interno al procesar la solicitud');
}

function include_file(file, targetId) {
  var ajax = new XMLHttpRequest();
  ajax.open('GET', file, true);
  ajax.addEventListener(
    'load',
    function () {
      if (this.status == 200) {
        document.querySelector('#' + targetId).innerHTML = this.responseText;
        // console.log('hola 200');
      } else if (this.status == 404) {
				/*document.querySelector('#app_root').innerHTML = '';
				include_file('zinclude_error/app_404.html', 'app_root');*/
        // console.log('hola 404');
      }
    },
    false
  );
  ajax.send();
}

function include_script(file) {
  var script = document.createElement('script');
  document.body.appendChild(script);
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file);

}
