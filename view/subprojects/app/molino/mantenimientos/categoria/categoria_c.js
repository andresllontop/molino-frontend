
var beanPaginationCategoriaC;
var categoriaCSelected;
var btnUnidadSelected = 0;
var beanRequestCategoriaC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
  //INICIALIZANDO VARIABLES DE SOLICITUD
  beanRequestCategoriaC.entity_api = 'api/categorias';
  beanRequestCategoriaC.operation = 'paginate';
  beanRequestCategoriaC.type_request = 'GET';
  /*CATEGORIA ADD*/

  removeClass(document.getElementById('addCategoriaHtml'), 'col-xl-4 col-sm-4 p-1 order-xl-1 order-sm-1');
  addClass(document.getElementById('addCategoriaHtml'), 'modal fade');
  document.getElementById('addCategoriaHtml').style.zIndex = '1070';
  document.getElementById('addCategoriaHtml').style.backgroundColor =
    '#1312129e';
  removeClass(
    document.getElementById('addCategoriaHtml').firstChild.nextElementSibling,
    'h-100'
  );
  addClass(
    document.getElementById('addCategoriaHtml').firstChild.nextElementSibling,
    'modal-dialog modal-sm modal-dialog-centered'
  );

  addClass(
    document.getElementById('addCategoriaHtml').firstChild.nextElementSibling
      .firstChild.nextElementSibling,
    'modal-content dt-social-card animate-slide border border-w-2 border-indigo p-4'
  );
  /* AGREGAR BOTON X PARA CERRAR */
  let parrafo = document.createElement('div');
  let row = `
		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		<span aria-hidden="true">×</span>
		</button>
		`;

  parrafo.innerHTML = row;
  document
    .getElementById('addCategoriaHtml')
    .firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
      parrafo
    );
  /* /AGREGAR BOTON X PARA CERRAR */
  document.querySelector('#btnSelecionarNewCategoriac').onclick = function () {
    $('#addCategoriaHtml').modal('show');
  };

  document.getElementById('FrmCategoriaModal').onsubmit = (event) => {
    //CONFIGURAMOS LA SOLICITUD
    beanRequestCategoriaC.operation = 'add';
    beanRequestCategoriaC.type_request = 'POST';

    if (validateFormCategoria()) {
      processAjaxCategoriaC();
    }
    event.preventDefault();
    event.stopPropagation();
  };

  /* */

  $('#FrmCategoriaC').submit(function (event) {
    beanRequestCategoriaC.operation = 'paginate';
    beanRequestCategoriaC.type_request = 'GET';
    processAjaxCategoriaC();
    event.preventDefault();
    event.stopPropagation();
  });

  $('#ventanaModalSelectedCategoriaC').on('hidden.bs.modal', function () {
    beanRequestCategoriaC.operation = 'paginate';
    beanRequestCategoriaC.type_request = 'GET';
  });
  if (document.querySelector('#btnSeleccionarCategoria') != undefined) {
    document.querySelector('#btnSeleccionarCategoria').onclick = function () {
      if (categoriaSelected != undefined) {
        $('#ventanaModalSelectedCategoriaC').modal('show');
      } else {
        processAjaxCategoriaC();
        $('#ventanaModalSelectedCategoriaC').modal('show');
      }
    };
  }


});

function processAjaxCategoriaC() {
  if (circleCargando.loader != null)
    if (circleCargando.loader.classList.contains("active"))
      return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
  let parameters_pagination = '';
  let json = '';

  switch (beanRequestCategoriaC.operation) {
    case 'add':
      json = {
        descripcion: document
          .querySelector('#txtNombreCategoria')
          .value.toUpperCase(),
        abreviatura: document
          .querySelector('#txtAbreviaturaCategoria')
          .value.trim()
      };
      circleCargando.container = $(document.querySelector("#FrmCategoriaModal").parentElement);
      circleCargando.containerOcultar = $(document.querySelector("#FrmCategoriaModal"));
      circleCargando.createLoader();
      break;

    default:
      parameters_pagination +=
        '?nombre=' +
        limpiar_campo(document.querySelector('#txtFilterCategoriaC').value)
          .toLowerCase();
      parameters_pagination += '&page=1&size=5';
      circleCargando.containerOcultar = $(document.querySelector("#tbodyCategoriaC"));
      circleCargando.container = $(document.querySelector("#tbodyCategoriaC").parentElement);
      circleCargando.createLoader();

      break;
  }
  circleCargando.toggleLoader("show");
  var xhr = new XMLHttpRequest();
  xhr = RequestServer(
    beanRequestCategoriaC,
    json,
    parameters_pagination,
    circleCargando.loader.firstElementChild
  );
  xhr.addEventListener('load', () => {
    circleCargando.toggleLoader("hide");

    beanCrudResponse = xhr.response;
    if (beanCrudResponse.messageServer !== undefined) {
      if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
        showAlertTopEnd('success', 'Acción realizada exitosamente');
      } else {
        showAlertTopEnd('warning', beanCrudResponse.messageServer);
      }
    }
    if (beanCrudResponse.beanPagination !== undefined) {
      beanPaginationCategoriaC = beanCrudResponse.beanPagination;
      toListCategoriaC(beanPaginationCategoriaC);
    }
    if (beanCrudResponse.classGeneric !== undefined) {
      beanPaginationCategoriaC.list.unshift(beanCrudResponse.classGeneric);
      beanPaginationCategoriaC.count_filter++;
      toListCategoriaC(beanPaginationCategoriaC);
    }
  }, false);
}

function toListCategoriaC(beanPagination) {
  document.querySelector('#tbodyCategoriaC').innerHTML = '';
  document.querySelector('#titleManagerCategoriaC').innerHTML =
    '[ ' + beanPagination.count_filter + ' ] CATEGORIAS';
  if (beanPagination.count_filter > 0) {
    let row;
    beanPagination.list.forEach((categoria) => {
      row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-categoria form-control form-control-sm " type="checkbox" idcategoria="${
        categoria.idcategoria
        }">
                                <label class="dt-checkbox-content" for="${
        categoria.idcategoria
        }"">${getStringCapitalize(categoria.descripcion)}</label>
                            </div>
                            <!-- /tasks -->
			`;
      document.querySelector('#tbodyCategoriaC').innerHTML += row;
    });

    addEventsCategoriaCes();
    if (beanRequestCategoriaC.operation == 'paginate') {
      document.querySelector('#txtFilterCategoriaC').focus();
    }

  } else {
    showAlertTopEnd('warning', 'No se encontraron resultados');
    document.querySelector('#txtFilterCategoriaC').focus();
  }
}

function addEventsCategoriaCes() {
  document
    .querySelectorAll('.click-selection-categoria')
    .forEach(function (element) {
      element.onclick = function () {
        if (this.checked) {
          for (
            let index = 0;
            index < this.parentElement.parentElement.children.length;
            index++
          ) {
            this.parentElement.parentElement.children[
              index
            ].children[0].checked = false;
          }
          this.checked = true;
          categoriaCSelected = findByCategoriaC(
            this.getAttribute('idcategoria')
          );
        } else {
          categoriaCSelected = undefined;
        }

        if (categoriaCSelected != undefined) {
          categoriaSelected = categoriaCSelected;
          document.querySelector(
            '#txtCategoriaGasto'
          ).value = categoriaCSelected.descripcion.toUpperCase();
          $('#ventanaModalSelectedCategoriaC').modal('hide');
        }
      };
    });
}

function findByCategoriaC(idcategoria) {
  return beanPaginationCategoriaC.list.find(
    (categoria) => {
      if (parseInt(idcategoria) == categoria.idcategoria) {
        return categoria;
      }


    }
  );
}
function validateFormCategoria() {
  if (
    limpiar_campo(document.querySelector('#txtNombreCategoria').value) == ''
  ) {
    showAlertTopEnd('warning', 'Por favor ingrese nombre');
    document.querySelector('#txtNombrenCategoria').focus();
    return false;
  }
  return true;
}
