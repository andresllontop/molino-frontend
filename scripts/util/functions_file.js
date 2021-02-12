/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function addEventsBtnsSelectedImages(_class) {
  $('.' + _class).click(function () {
    $('#' + $(this).attr('idinput')).trigger('click');
  });
}

function addEventsChangeInputsImagesGeneric(
  _class,
  _classbtn_upload,
  _classbtn_remove,
  fileExtensions,
  src_default
) {
  $('.' + _class).on('change', function () {
    readImageSelectedGeneric(
      this,
      $(this).attr('idvisor'),
      _classbtn_upload,
      _classbtn_remove,
      fileExtensions,
      src_default
    );
  });
}
function readImageSelectedGeneric(
  input,
  idvisor,
  _classbtn_upload,
  _classbtn_remove,
  fileExtensions,
  src_default
) {
  if (input.files && input.files[0]) {
    //VALIDAMOS SI ES EL FORMATO CORRECTO
    if (validateFile(input, fileExtensions)) {
      var btnUploads_remove = document.getElementsByClassName(_classbtn_upload);
      for (let i = 0; i < btnUploads_remove.length; i++) {
        if ($(btnUploads_remove[i]).attr('input') == $(input).attr('id')) {
          $(btnUploads_remove[i]).removeAttr('disabled');
        }
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#' + idvisor).attr('src', e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
      //ACTIVAMOS EL REMOVE DE LA IMAGEN SELECCIONADA
      btnUploads_remove = document.getElementsByClassName(_classbtn_remove);
      for (let i = 0; i < btnUploads_remove.length; i++) {
        if ($(btnUploads_remove[i]).attr('input') == $(input).attr('id')) {
          $(btnUploads_remove[i]).removeAttr('disabled');
        }
      }
    } else {
      showAlertTopEnd(
        'warning',
        'El archivo no tiene la extensión adecuada o supera el tamaño máximo de 1 MB',
        10000
      );
    }
  } else {
    $('#' + idvisor).attr('src', src_default);
    $(input).val(null);
    var btnUploads = document.getElementsByClassName(_classbtn_upload);
    for (let i = 0; i < btnUploads.length; i++) {
      if ($(btnUploads[i]).attr('input') == $(input).attr('id')) {
        $(btnUploads[i]).attr('disabled', 'disabled');
      }
    }
  }
}

function addEventsUploadFilesGeneric(_class, API, $idbackend) {
  $('.' + _class).each(function (index, value) {
    $(this).click(function () {
      //VALIDAMOS SI EXISTE UN ARCHIVO
      if ($('#' + $(this).attr('input')).val() != '') {
        uploadFileGeneric($(this), API, $idbackend);
      } else {
        showAlertTopEnd(
          'warning',
          'Por favor seleccione una archivo correctamente'
        );
      }
    });
  });
}

function uploadFileGeneric($btnUpload, API, $idbackend) {
  let formData = new FormData();
  formData.append('id', $idbackend.val());
  formData.append('file', $('#' + $btnUpload.attr('input'))[0].files[0]);
  $('#modalCargandoUploadDelete').modal('show');
  $.ajax({
    url: getHostAndContextAPI() + API + '/' + $idbackend.val(),
    headers: {
      Authorization: 'Bearer ' + Cookies.get('molino_token')
    },
    type: 'POST',
    enctype: 'multipart/form-data',
    data: formData,
    processData: false,
    contentType: false,
    cache: false,
    timeout: 600000
  })
    .done(function (jsonResponse) {
      $('#modalCargandoUploadDelete').modal('hide');
      if (jsonResponse.MESSAGE_SERVER == 'ok') {
        showAlertTopEnd('success', 'Archivo subido exitosamente!');
        /*BLOQUEAMOS NUEVAMENTE EL BOTON PARA QUE NO CARGUE AL SERVIDOR NUEVAMENTE*/
        $btnUpload.attr('disabled', 'disabled');
      } else {
        showAlertTopEnd('warning', jsonResponse.MESSAGE_SERVER);
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      $('#modalCargandoUploadDelete').modal('hide');
      showAlertErrorRequest();
    });
}

function addEventsRemoveFileGeneric(
  _class,
  API,
  $idbackend,
  src_default,
  name_file_default
) {
  $('.' + _class).each(function (index, value) {
    $(this).click(function () {
      //VALIDAMOS SI QUIERE ELIMINAR ARCHIVO SELECCIONADO O DEL SERVIDOR
      let valuesSplitPath = $('#' + $(this).attr('idvisor'))
        .attr('src')
        .split('/');
      if (valuesSplitPath.length > 0) {
        let name_file = valuesSplitPath[valuesSplitPath.length - 1];
        if (name_file.toLowerCase() != name_file_default) {
          $('#' + $(this).attr('idvisor')).attr('src', src_default);
          //VALIDAMOS SI EL INPUT TIENE ALGO
          if (
            document.getElementById($(this).attr('idinput')).files.length == 0
          ) {
            removeFileGeneric($(this), API, $idbackend, name_file);
          }
        }
        //LIMPIAMOS EL INPUT
      } else {
        showAlertTopEnd('warning', 'Error al eliminar archivo');
      }
    });
  });
}

function removeFileGeneric($btn, API, $idbackend, name_file) {
  let pathParameters = '?id=' + $idbackend.val();
  pathParameters += '&name_file=' + name_file;
  let i = $btn.children()[0];
  $('#modalCargandoUploadDelete').modal('show');
  $.ajax({
    url: getHostAndContextAPI() + API + pathParameters,
    headers: {
      Authorization: 'Bearer ' + Cookies.get('molino_token')
    },
    type: 'GET',
    data: ''
  })
    .done(function (jsonResponse) {
      $('#modalCargandoUploadDelete').modal('hide');
      if (jsonResponse.MESSAGE_SERVER == 'ok') {
        showAlertTopEnd('success', 'Archivo eliminado exitosamente!');
        /*BLOQUEAMOS NUEVAMENTE EL BOTON PARA QUE NO CARGUE AL SERVIDOR NUEVAMENTE*/
        $btn.attr('disabled', 'disabled');
      } else {
        showAlertTopEnd('warning', jsonResponse.MESSAGE_SERVER);
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      $('#modalCargandoUploadDelete').modal('hide');
      showAlertErrorRequest(jqXHR, textStatus);
    });
}

function validateFile(input, fileExtensions) {
  var validate = false;
  var fileName = input.files[0].name;
  var fileSize = input.files[0].size;
  //var fileExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
  if (fileSize > 1000000) {
    showAlertTopEnd('warning', 'El archivo no debe superar los 1MB');
    input.value = '';
  } else {
    var ext = fileName.split('.').pop();
    for (let i = 0; i < fileExtensions.length; i++) {
      if (fileExtensions[i].toLowerCase() == ext) {
        validate = true;
        break;
      }
    }
  }
  return validate;
}
