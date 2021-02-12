document.addEventListener('DOMContentLoaded', function() {
	$('#FrmLogin').submit(function(event) {
		try {
			if (document.querySelector('#txtUsername').value != '') {
				if (document.querySelector('#txtPass').value != '') {
					$('#modalCargandoLogin').modal('show');
				} else {
					showAlertTopEnd('warning', 'Por favor ingrese una contraseña');
				}
			} else {
				showAlertTopEnd('warning', 'Por favor ingrese un nombre de usuario');
			}
		} catch (e) {
			console.log(e);
		}
		event.preventDefault();
		event.stopPropagation();
	});
	document.querySelector('#txtUsername').onclick = () => {
		document
			.getElementById('txtUsername')
			.labels[0].classList.remove('sr-only');
	};
	document.querySelector('#txtPass').onclick = () => {
		document.getElementById('txtPass').labels[0].classList.remove('sr-only');
	};
	$('#modalCargandoLogin').on('shown.bs.modal', function() {
		processAjaxAuth();
	});
});

function processAjaxAuth() {
	let datosSerializados = $('#FrmLogin').serialize();
	// console.log(datosSerializados);
	$.ajax({
		url: getHostAndContextAPI() + 'authentication/login',
		type: 'POST',
		data: datosSerializados,
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		dataType: 'json'
	})
		.done(function(jsonResponse) {
			$('#modalCargandoLogin').modal('hide');
			if (jsonResponse.message_server != undefined) {
				if (jsonResponse.message_server.toLowerCase() === 'ok') {
					if (jsonResponse.token !== undefined) {
						//SET COOKIE TOKEN
						setCookieSession(jsonResponse.token, jsonResponse.usuario);
						sendIndex();
					} else {
						showAlertTopEnd(
							'warning',
							'No se pudo obtener el token para iniciar sesión'
						);
					}
				} else {
					switch (jsonResponse.type_message) {
						case '1':
							showAlertTopEnd('error', jsonResponse.message_server);
							document.querySelector('#txtUsername').value = '';
							document.querySelector('#txtPass').value = '';
							document.querySelector('#txtUsername').focus();
							break;
						case '2':
							showAlertTopEnd('error', jsonResponse.message_server);
							document.querySelector('#txtPass').value = '';
							document.querySelector('#txtPass').focus();
							break;
						default:
							// 3 Y 4
							showAlertTopEnd('warning', jsonResponse.message_server);
							break;
					}
				}
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			$('#modalCargandoLogin').modal('hide');
			showAlertErrorRequest();
		});
}
