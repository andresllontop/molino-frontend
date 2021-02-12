
class BeanURL {
    constructor() {
        this.url = "";
        //this.type_perfil = "";
    }
}

document.addEventListener("DOMContentLoaded", function () {

    let user_session = Cookies.getJSON('molino_user');
    if (user_session != undefined) {
        var current_path = window.location.href;
        current_path = current_path.substring(getHostAPP().length - 1, current_path.length);
        switch (user_session.tipo_usuario) {
            case 2:
                if (current_path.includes('ate')) {
                    sendIndex();
                } else {
                    //VALIDAMOS SI TIENE HABILITADO ESTA URL
                    if (current_path.includes('molino/servicios/enfermeria')) {
                        if (user_session.tipo_perfil == 0 || user_session.tipo_perfil == 1 || user_session.tipo_perfil == 10) {
                            console.log("Url correcta");
                        } else {
                            sendIndex();
                        }
                    }
                    if (current_path.includes('ogbu/servicios/medicina')) {
                        if (user_session.tipo_perfil == 0 || user_session.tipo_perfil == 1 || user_session.tipo_perfil == 10 || user_session.tipo_perfil == 11) {
                            console.log("Url correcta");
                        } else {
                            sendIndex();
                        }
                    }
                    if (current_path.includes('ogbu/servicios/farmacia')) {
                        if (user_session.tipo_perfil == 0 || user_session.tipo_perfil == 1 || user_session.tipo_perfil == 10) {
                            console.log("Url correcta");
                        } else {
                            console.log("Url Incorrecta");
                            sendIndex();
                        }
                    }
                    if (current_path.includes('ogbu/servicios/odontologia')) {
                        if (user_session.tipo_perfil == 0 || user_session.tipo_perfil == 1 || user_session.tipo_perfil == 3) {
                            console.log("Url correcta");
                        } else {
                            sendIndex();
                        }
                    }
                    if (current_path.includes('ogbu/servicios/obstetricia')) {
                        if (user_session.tipo_perfil == 0 || user_session.tipo_perfil == 1 || user_session.tipo_perfil == 4) {
                            console.log("Url correcta");
                        } else {
                            sendIndex();
                        }
                    }
                    if (current_path.includes('ogbu/servicios/psicopedagogia')) {
                        if (user_session.tipo_perfil == 0 || user_session.tipo_perfil == 1 || user_session.tipo_perfil == 11) {
                            console.log("Url correcta");
                        } else {
                            sendIndex();
                        }
                    }
                    if (current_path.includes('ogbu/servicios/social')) {
                        if (user_session.tipo_perfil == 0 || user_session.tipo_perfil == 1 || user_session.tipo_perfil == 11 || user_session.tipo_perfil == 5) {
                            console.log("Url correcta");
                        } else {
                            sendIndex();
                        }
                    }
                    if (current_path.includes('ogbu/servicios/comedor')) {
                        if (user_session.tipo_perfil == 0 || user_session.tipo_perfil == 1 || user_session.tipo_perfil == 5 || user_session.tipo_perfil == 6) {
                            console.log("Url correcta");
                        } else {
                            sendIndex();
                        }
                    }
                    if (current_path.includes('ogbu/servicios/recreacion-deportes')) {
                        if (user_session.tipo_perfil == 0 || user_session.tipo_perfil == 1 || user_session.tipo_perfil == 7) {
                            console.log("Url correcta");
                        } else {
                            sendIndex();
                        }
                    }
                    if (current_path.includes('ogbu/mantenimientos') || current_path.includes('ogbu/configuraciones') || current_path.includes('ogbu/procesos')) {
                        if (user_session.tipo_perfil == 0 || user_session.tipo_perfil == 1) {
                            console.log("Url correcta");
                        } else {
                            //ignoramos las citas para algunos servicios
                            let tipe_profiles_tmp = [3, 4, 10, 11];
                            if (tipe_profiles_tmp.indexOf(user_session.tipo_perfil) == -1) {
                                sendIndex();
                            }
                        }
                    }
                }
                break;
            default:
                if (current_path.includes('ogbu')) {
                    sendIndex();
                } else {
                    //Verificamos que la cuenta este activada
                    if (user_session.estado == 4) {
                        if (!current_path.includes('index')) {
                            sendIndex();
                        }
                    }
                    //VALIDAMOS LAS URL SOLO DE CACHIMBOS
                    /*
                     if (current_path.includes('evaluaciones') || current_path.includes('constancias')) {
                     if (user_session.tipo_perfil != 1000) {
                     sendIndex();
                     }
                     }
                     */
                }
                break;
        }
    } else {
        sendIndex();
    }
});

// NO UTILIZANDO
function loaderUrlAte() {
    let url;

    url = new BeanURL();
    url.url = "ate/index";
    list_url_ate.push(url);

    url = new BeanURL();
    url.url = "ate/perfil";
    list_url_ate.push(url);

    url = new BeanURL();
    url.url = "ate/datos";
    list_url_ate.push(url);

    url = new BeanURL();
    url.url = "ate/evaluaciones";
    list_url_ate.push(url);

    url = new BeanURL();
    url.url = "ate/reservas";
    list_url_ate.push(url);

    url = new BeanURL();
    url.url = "ate/menu-semanal";
    list_url_ate.push(url);

    url = new BeanURL();
    url.url = "ate/noticias-eventos";
    list_url_ate.push(url);

    url = new BeanURL();
    url.url = "ate/constancias";
    list_url_ate.push(url);

}