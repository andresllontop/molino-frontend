function eliminarlistUnidadMedida(idbusqueda) {

    beanPaginationUnidadMedida.list.splice(findIndexUnidadMedida(parseInt(idbusqueda)), 1);
}

function updatelistUnidadMedida(classBean) {
    beanPaginationUnidadMedida.list.splice(findIndexUnidadMedida(classBean.idunidad_medida), 1, classBean);
}

function findIndexUnidadMedida(idbusqueda) {
    return beanPaginationUnidadMedida.list.findIndex(
        (unidadMedida) => {
            if (unidadMedida.idunidad_medida == parseInt(idbusqueda))
                return unidadMedida;


        }
    );
}
function findByUnidadMedida(idunidad_medida) {
    return beanPaginationUnidadMedida.list.find(
        (unidadMedida) => {
            if (parseInt(idunidad_medida) == unidadMedida.idunidad_medida) {
                return unidadMedida;
            }


        }
    );
}


circleCargando.toggleLoader("hide");
beanCrudResponse = xhr.response;
if (beanCrudResponse.messageServer !== undefined) {
    if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
        if (beanRequestUnidadMedida.operation == "delete") {
            eliminarlistUnidadMedida(unidadMedidaSelected.idunidad_medida);
            toListUnidadMedida(beanPaginationUnidadMedida);
        }
        showAlertTopEnd('success', 'Acción realizada exitosamente');
        document.querySelector('#btnAbrirNewUnidadMedida').dispatchEvent(new Event('click'));

    } else {
        showAlertTopEnd('warning', beanCrudResponse.messageServer);
    }
}
if (beanCrudResponse.beanPagination !== undefined) {
    beanPaginationUnidadMedida = beanCrudResponse.beanPagination;
    toListUnidadMedida(beanPaginationUnidadMedida);
}
if (beanCrudResponse.classGeneric !== undefined) {
    if (beanRequestUnidadMedida.operation == 'update') {
        updatelistUnidadMedida(beanCrudResponse.classGeneric);
        toListUnidadMedida(beanPaginationUnidadMedida);
        return;
    }
    beanPaginationUnidadMedida.list.unshift(beanCrudResponse.classGeneric);
    beanPaginationUnidadMedida.count_filter++;
    toListUnidadMedida(beanPaginationUnidadMedida);
}

document.querySelector("#btnAbrirNewUnidadMedida").onclick = () => {
    metodo = false;
    document.querySelector('#btnAbrirNewUnidadMedida').parentElement.parentElement.classList.add("d-md-none");
    document.querySelector('#btnAbrirNewUnidadMedida').classList.add("d-lg-none");
    document.querySelector('#btnAbrirNewUnidadMedida').classList.add("d-sm-none");
    //SET TITLE MODAL
    document.querySelector('#TituloModalUnidadMedida').innerHTML =
        'REGISTRAR ESTABLECIMIENTO';
    addUnidadMedida();
};