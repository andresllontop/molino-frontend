/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var empresaSelected;
var beanRequestEmpresa = new BeanRequest();
document.addEventListener("DOMContentLoaded", function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestEmpresa.entity_api = 'api/empresas';
  beanRequestEmpresa.operation = 'get-empresa';
  beanRequestEmpresa.type_request = 'GET';

  $('#FrmEmpresaModal').submit(function (event) {
    beanRequestEmpresa.operation = 'update';
    beanRequestEmpresa.type_request = 'PUT';
    if (validateFormEmpresa()) {
      proccessAjaxUpdatePerfil();
    }
    event.preventDefault();
    event.stopPropagation();
  });

  proccessAjaxUpdatePerfil();

});
function addEmpresa(empresa = undefined) {
  //LIMPIAR LOS CAMPOS
  document.querySelector('#txtNombreEmpresa').value = (empresa == undefined) ? '' : empresa.nombre;
  document.querySelector('#txtDireccionEmpresa').value = (empresa == undefined) ? '' : empresa.direccion;
  document.querySelector('#txtDescripcionEmpresa').value = (empresa == undefined) ? '' : empresa.descripcion;
  document.querySelector('#txtEmailEmpresa').value = (empresa == undefined) ? '' : empresa.email;
  document.querySelector('#txtTelefonoEmpresa').value = (empresa == undefined) ? '' : empresa.telefono;
  document.querySelector('#txtDocumentoEmpresa').value = (empresa == undefined) ? '' : empresa.documento;


}


function proccessAjaxUpdatePerfil() {
  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
  let parameters_pagination = '';
  let json = '';
  circleCargando.container = $(document.querySelector("#FrmEmpresaModal").parentElement);
  circleCargando.containerOcultar = $(document.querySelector("#FrmEmpresaModal"));
  circleCargando.createLoader();
  circleCargando.toggleLoader("show");
  if (
    beanRequestEmpresa.operation == 'update' ||
    beanRequestEmpresa.operation == 'add'
  ) {

    json = {
      nombre: document.querySelector('#txtNombreEmpresa').value,
      descripcion: document.querySelector('#txtDescripcionEmpresa').value,
      documento: parseInt(document.querySelector('#txtDocumentoEmpresa').value),
      email: document.querySelector('#txtEmailEmpresa').value,
      direccion: document.querySelector('#txtDireccionEmpresa').value,
      telefono: parseInt(document.querySelector('#txtTelefonoEmpresa').value)

    };

  } else {
    beanRequestEmpresa.operation = 'get-empresa';
    beanRequestEmpresa.type_request = 'GET';


  }

  switch (beanRequestEmpresa.operation) {
    case 'update':
      json.idempresa = empresaSelected.idempresa;
      break;
    case 'add':
      break;

    default:

      break;
  }

  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestEmpresa,
    json,
    parameters_pagination,
    circleCargando.loader.firstElementChild
  );
  xhr.addEventListener('load', () => {
    if (xhr.status != 200) {
      if (xhr.status == 401) {
        circleCargando.toggleLoader("hide");
        showAlertTopEnd('warning', "Sin autorización de Acceso");
      }

      circleCargando.toggleLoader("hide");
      showAlertErrorRequest();
      return;
    }
    circleCargando.toggleLoader("hide");
    beanCrudResponse = xhr.response;
    if (beanCrudResponse.messageServer !== undefined) {
      if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
        showAlertTopEnd('success', 'Acción realizada exitosamente');

      } else {
        showAlertTopEnd('warning', beanCrudResponse.messageServer);
      }
    }
    if (beanCrudResponse.descripcion !== undefined) {
      empresaSelected = beanCrudResponse;
      addEmpresa(empresaSelected);
      return;
    }
    if (beanCrudResponse.classGeneric !== undefined) {
      addEmpresa(beanCrudResponse.classGeneric);
    }
  }, false);
}
function validateFormEmpresa() {

  let letra = letra_numero_campo(
    document.querySelector('#txtNombreEmpresa'),
    document.querySelector('#txtDireccionEmpresa'),
    document.querySelector('#txtDescripcionEmpresa')

  );

  if (letra != undefined) {
    letra.focus();
    letra.labels[0].style.fontWeight = '600';
    addClass(letra.labels[0], 'text-danger');
    if (letra.value == '') {
      showAlertTopEnd('info', 'Por favor ingrese ' + letra.labels[0].innerText);
    } else {
      showAlertTopEnd(
        'info',
        'Por favor ingrese sólo Letras y números al campo ' + letra.labels[0].innerText
      );
    }

    return false;
  }

  let email = email_campo(
    document.querySelector('#txtEmailEmpresa')

  );

  if (email != undefined) {
    email.focus();
    email.labels[0].style.fontWeight = '600';
    addClass(email.labels[0], 'text-danger');
    if (email.value == '') {
      showAlertTopEnd('info', 'Por favor ingrese ' + email.labels[0].innerText);
    } else {
      showAlertTopEnd(
        'info',
        'Por favor ingrese un correo válido ' + email.labels[0].innerText
      );
    }

    return false;
  }

  let numero = numero_campo(
    document.querySelector('#txtTelefonoEmpresa'),
    document.querySelector('#txtDocumentoEmpresa')

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
        'Por favor ingrese sólo números' + numero.labels[0].innerText
      );
    }

    return false;
  }


  return true;
}
