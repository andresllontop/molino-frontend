var beanPaginationCategoria;
var categoriaSelected;
var metodo = false;
var beanRequestCategoria = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    $("#addCategoriaHtml").detach().appendTo("#drawer-agregarCategoria");
    addCategoria();
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestCategoria.entity_api = 'api/categorias';
    beanRequestCategoria.operation = 'paginate';
    beanRequestCategoria.type_request = 'GET';

    $('#FrmCategoria').submit(function (event) {
        beanRequestCategoria.operation = 'paginate';
        beanRequestCategoria.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterCategoria').value = limpiar_campo(
            document.querySelector('#txtFilterCategoria').value
        );
        processAjaxCategoria();
    });

    $('#FrmCategoriaModal').submit(function (event) {
        if (metodo) {
            beanRequestCategoria.operation = 'update';
            beanRequestCategoria.type_request = 'PUT';
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestCategoria.operation = 'add';
            beanRequestCategoria.type_request = 'POST';
        }
        if (validateFormCategoria()) {
            processAjaxCategoria();
        }
        event.preventDefault();
        event.stopPropagation();
    });

    processAjaxCategoria();

    $('#sizePageCategoria').change(function () {
        processAjaxCategoria();
    });
    document.querySelector("#btnAbrirCategoria").onclick = () => {
        metodo = false;
        //SET TITLE MODAL
        document.querySelector('#TituloModalCategoria').innerHTML =
            'REGISTRAR CATEGORIA';
        addCategoria();
    };
    document.querySelector("#btnAbrirNewCategoria").onclick = () => {
        metodo = false;
        document.querySelector('#btnAbrirNewCategoria').parentElement.parentElement.classList.add("d-md-none");
        document.querySelector('#btnAbrirNewCategoria').classList.add("d-lg-none");
        document.querySelector('#btnAbrirNewCategoria').classList.add("d-sm-none");
        //SET TITLE MODAL
        document.querySelector('#TituloModalCategoria').innerHTML =
            'REGISTRAR CATEGORIA';
        addCategoria();
    };
});
function addCategoria(categoria = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtNombreCategoria').value = (categoria == undefined) ? '' : categoria.descripcion;
    document.querySelector('#txtAbreviaturaCategoria').value = (categoria == undefined) ? '' : categoria.abreviatura;

}

function processAjaxCategoria() {

    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestCategoria.operation == 'update' ||
        beanRequestCategoria.operation == 'add'
    ) {
        json = {
            descripcion: document.querySelector('#txtNombreCategoria').value.trim(),
            abreviatura: document
                .querySelector('#txtAbreviaturaCategoria')
                .value.trim()
        };
        circleCargando.container = $(document.querySelector("#FrmCategoriaModal").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#FrmCategoriaModal"));
        circleCargando.createLoader();
    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyCategoria").parentNode);
        circleCargando.container = $(document.querySelector("#tbodyCategoria").parentElement.parentElement);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestCategoria.operation) {
        case 'delete':
            parameters_pagination = '/' + categoriaSelected.idcategoria;
            break;

        case 'update':
            json.idcategoria = categoriaSelected.idcategoria;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterCategoria').value != '') {
                document.querySelector('#pageCategoria').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterCategoria').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageCategoria').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageCategoria').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestCategoria,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestCategoria.operation == "delete") {
                    eliminarlistCategoria(categoriaSelected.idcategoria);
                    toListCategoria(beanPaginationCategoria);
                }
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                document.querySelector('#btnAbrirNewCategoria').dispatchEvent(new Event('click'));

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationCategoria = beanCrudResponse.beanPagination;
            toListCategoria(beanPaginationCategoria);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestCategoria.operation == 'update') {
                updatelistCategoria(beanCrudResponse.classGeneric);
                toListCategoria(beanPaginationCategoria);
                return;
            }
            beanPaginationCategoria.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationCategoria.count_filter++;
            toListCategoria(beanPaginationCategoria);
        }

    }, false);
}

function toListCategoria(beanPagination) {
    document.querySelector('#tbodyCategoria').innerHTML = '';
    document.querySelector('#titleManagerCategoria').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] CATEGORIAS';
    let row;
    row = `
        <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2">
        <!-- Widget Info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate " >
               NOMBRE
            </p>
        </div>
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate ">
               ABREVIATURA
            </p>
        </div>
        <!-- /widget info -->
        <!-- Widget Extra -->
        <div class="dt-widget__extra">
          <div class="dt-task" style="min-width: 45px;">
            <div class="dt-task__redirect">
              ACCIONES
            </div>
          </div>
        </div>
    </div>
            `;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationCategoria'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterCategoria').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2"">
    <!-- Widget Info -->
    <div class="dt-widget__info text-truncate text-center" >
        <p class="mb-0 text-truncate " >
           NO HAY CATEGORIA
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyCategoria').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyCategoria').innerHTML += row;
    beanPagination.list.forEach((categoria) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >

              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" >
                ${categoria.descripcion}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate">
                ${categoria.abreviatura}
                </p>
              </div>
              <!-- /widget info -->

              <!-- Widget Extra -->
              <div class="dt-widget__extra">
              <div class="dt-task" style="min-width: 75px;">
              <div class="dt-task__redirect">
                          <!-- Action Button Group -->
                          <div class="action-btn-group">
                          <button
                  idcategoria='${categoria.idcategoria}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-categoria"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-categoria" idcategoria='${categoria.idcategoria}'
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Eliminar</em>"
                  >
                    <i class="icon icon-trash icon-sm pulse-danger"></i>
                  </button>
                          </div>
                          <!-- /action button group -->
                        </div>
                        </div>
                        <!-- /hide content -->
                      </div>

            </div>
            <!-- /widgets item -->
            `;
        document.querySelector('#tbodyCategoria').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageCategoria').value),
        document.querySelector('#pageCategoria'),
        processAjaxCategoria, beanRequestCategoria,
        $('#paginationCategoria')
    );
    addEventsCategorias();
    if (beanRequestCategoria.operation == 'paginate') {
        document.querySelector('#txtFilterCategoria').focus();
    }

}

function addEventsCategorias() {
    document.querySelectorAll('.editar-categoria').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            categoriaSelected = findByCategoria(
                btn.getAttribute('idcategoria')
            );
            if (categoriaSelected != undefined) {
                document.querySelector('#btnAbrirNewCategoria').classList.remove("d-lg-none");
                document.querySelector('#btnAbrirNewCategoria').classList.remove("d-sm-none");

                document.querySelector('#btnAbrirNewCategoria').parentElement.parentElement.classList.remove("d-md-none");
                document.querySelector('#btnAbrirNewCategoria').parentElement.parentElement.style.minHeight = "35px";
                if (document.querySelector('#accionAbrirCategoria').style.display == "none") {
                    document.querySelector('#btnAbrirCategoria').dispatchEvent(new Event('click'));
                    document.querySelector('#btnAbrirNewCategoria').classList.add("d-sm-none");
                }

                metodo = true;
                addCategoria(categoriaSelected);
                document.querySelector('#TituloModalCategoria').innerHTML =
                    'EDITAR CATEGORIA';
                document.querySelector('#txtNombreCategoria').focus();
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Unidad de Medida para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-categoria').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            categoriaSelected = findByCategoria(
                btn.getAttribute('idcategoria')
            );
            if (categoriaSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Unidad de Medida para poder eliminar'
                );
            beanRequestCategoria.operation = 'delete';
            beanRequestCategoria.type_request = 'DELETE';
            processAjaxCategoria();
        };
    });
}


function validateFormCategoria() {
    let letra = letra_campo(
        document.querySelector('#txtNombreCategoria'),
        document.querySelector('#txtAbreviaturaCategoria')
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
                'Por favor ingrese solo Letras al campo ' + letra.labels[0].innerText
            );
        }

        return false;
    }
    return true;
}
function eliminarlistCategoria(idbusqueda) {
    beanPaginationCategoria.count_filter--;
    beanPaginationCategoria.list.splice(findIndexCategoria(parseInt(idbusqueda)), 1);
}

function updatelistCategoria(classBean) {
    beanPaginationCategoria.list.splice(findIndexCategoria(classBean.idcategoria), 1, classBean);
}

function findIndexCategoria(idbusqueda) {
    return beanPaginationCategoria.list.findIndex(
        (categoria) => {
            if (categoria.idcategoria == parseInt(idbusqueda))
                return categoria;


        }
    );
}
function findByCategoria(idcategoria) {
    return beanPaginationCategoria.list.find(
        (categoria) => {
            if (parseInt(idcategoria) == categoria.idcategoria) {
                return categoria;
            }


        }
    );
}
