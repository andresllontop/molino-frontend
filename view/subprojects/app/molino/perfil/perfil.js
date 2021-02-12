/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mostrar_pass = false;

document.addEventListener("DOMContentLoaded", function () {

    document.querySelector('#fileImageFotoUser').value = null;

    if (user_session != undefined) {
        $('#idusuario').val(user_session.idusuario);
    } else {
        closeSession();
    }

    addEventsBtnsSelectedImages('btn-selected-image');

    var fileExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];

    var src_default = getHostAPI() + "resources/img/150x150.png";

    addEventsChangeInputsImagesGeneric('input-image', 'btn-upload', 'btn-delete-image', fileExtensions, src_default);

    addEventsUploadFilesGeneric('btn-upload', 'usuarios/upload-foto-user', $('#idusuario'));

    addEventsRemoveFileGeneric('btn-delete-image', 'usuarios/delete-foto-user', $('#idusuario'), src_default, '150x150.png');

    document.querySelector('#btnMostrarPass').onclick = function () {
        if (mostrar_pass) {
            mostrar_pass = false;
            removeClass(document.querySelector('#icono_mostrar_pass'), "icon-eye");
            addClass(document.querySelector('#icono_mostrar_pass'), "icon-findwhat");
            document.querySelector('#txtPassPerfil').setAttribute('type', 'password');
        } else {
            mostrar_pass = true;
            removeClass(document.querySelector('#icono_mostrar_pass'), "icon-findwhat");
            addClass(document.querySelector('#icono_mostrar_pass'), "icon-eye");
            document.querySelector('#txtPassPerfil').setAttribute('type', 'text');
        }
    };

    document.querySelector("#txtUsuarioPerfil").onkeyup = function (e) {
        if (e.keyCode == 13) {
            document.querySelector("#txtPassPerfil").focus();
        }
    };

    document.querySelector("#txtPassPerfil").onkeyup = function (e) {
        if (e.keyCode == 13) {
            document.querySelector("#btnActualizarDatos").dispatchEvent(new Event('click'));
        }
    };

    document.querySelector("#btnActualizarDatos").onclick = function () {
        if (document.querySelector("#txtUsuarioPerfil").value == "") {
            showAlertTopEnd('warning', 'Por favor ingresa tu nombre completo');
            document.querySelector("#txtUsuarioPerfil").focus();
            return;
        }
        if (document.querySelector("#txtPassPerfil").value == "") {
            showAlertTopEnd('warning', 'Por favor ingresa una contraseña');
            document.querySelector("#txtPassPerfil").focus();
            return;
        }
        let pass = document.querySelector("#txtPassPerfil").value;
        if (pass.length < 6) {
            showAlertTopEnd('warning', 'La contraseña debe tener al menos 6 caracteres');
            document.querySelector("#txtPassPerfil").focus();
            return;
        }
        if (pass.length > 20) {
            showAlertTopEnd('warning', 'La contraseña no debe exceder los 20 caracteres');
            document.querySelector("#txtPassPerfil").focus();
            return;
        }
        if (isPassFacil(pass)) {
            showAlertTopEnd('warning', 'Ha ingresado una contraseña fácil, ingrese otra por favor');
            document.querySelector("#txtPassPerfil").focus();
            return;
        }
        if (user_session.login == pass) {
            showAlertTopEnd('warning', 'La contraseña ya no debe ser igual al Username. Por seguridad debes cambiarla');
            document.querySelector("#txtPassPerfil").focus();
            return;
        }
        proccessAjaxUpdatePerfil();
    };

    loaderDataUser();

});

function isPassFacil(pass) {
    let pass_facil = false;
    let pass_faciles = [
        "123456",
        "123123",
        "111111",
        "222222",
        "333333",
        "444444",
        "555555",
        "666666",
        "121212"
    ];
    for (var i = 0; i < pass_faciles.length; i++) {
        if (pass_faciles[i] == pass) {
            pass_facil = true;
            break;
        }
    }
    return pass_facil;
}

function loaderDataUser() {
    document.querySelector("#txtUsuarioPerfil").value = user_session.usuario;
    document.querySelector("#txtUserNamePerfil").value = user_session.login;
    document.querySelector("#txtUserNamePerfil").disabled = true;
    document.querySelector("#txtPassPerfil").value = "";
    document.querySelector("#txtPassPerfil").focus();
    if (user_session.foto == "") {
        document.querySelector("#div-row-pasos-subir-foto").style.display = "block";
        document.querySelector("#btnEliminarFotoUser").disabled = true;
        document.querySelector("#btnSubirFotoUser").disabled = true;
    } else {
        document.querySelector("#btnEliminarFotoUser").disabled = false;
        document.querySelector("#btnSubirFotoUser").disabled = false;
        document.querySelector("#div-row-pasos-subir-foto").style.display = "none";
    }
}

function proccessAjaxUpdatePerfil() {
    let json = "";
    let url_request = getHostAPI() + "api/usuarios/update-perfil";
    json = {
        "idusuario": user_session.idusuario,
        "usuario": document.querySelector("#txtUsuarioPerfil").value,
        "pass": document.querySelector("#txtPassPerfil").value
    };
    circleCargando.container = $(document.querySelector("#btnActualizarDatos").parentElement);
    circleCargando.containerOcultar = $(document.querySelector("#btnActualizarDatos"));
    circleCargando.createLoader();
    circleCargando.toggleLoader("show");

    $.ajax({
        url: url_request,
        type: "POST",
        headers: {
            'Authorization': 'Bearer ' + Cookies.get("molino_token")
        },
        data: JSON.stringify(json),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    }).done(function (beanCrudResponse) {
        circleCargando.toggleLoader("hide");
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == "ok") {
                showAlertTopEnd('success', 'Datos actualizados exitosamente!');
            } else {
                showAlertTopEnd('error', 'Ha ocurrido un error interno, vuelve a intentarlo mas tarde :)');
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        circleCargando.toggleLoader("hide");
        showAlertErrorRequest();
    });



}