
class BeanRequest {
    constructor() {
        this.entity_api = "";
        this.operation = "";
        this.type_request = "";
    }
}

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll('.a-index').forEach(a => {
        a.onclick = function () {
            sendIndex();
        };
    });

    document.querySelectorAll('.a-perfil').forEach(a => {
        a.onclick = function () {
            location.href = getContextAPP() + "app/molino/perfil";
        };
    });

    document.querySelectorAll('.a-ajustes').forEach(a => {
        a.onclick = function () {
            location.href = getContextAPP() + "app/ajustes";
        };
    });

    document.querySelectorAll('.a-close-session').forEach(a => {
        a.onclick = function () {
            closeSession();
        };
    });



});
