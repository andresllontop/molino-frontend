/*HOST BACKEND */
function getHostAPI() {
  return 'http://localhost:8080/molino-backend/';
}
function getHostAndContextAPI() {
  return getHostAPI() + 'api/';

}
/* HOST FRONTED*/
function getHostAPP() {
  return 'http://localhost/';
}
/* */
function getContextAPP() {
  return '/molino-frontend/';
}

function getHostFrontEnd() {
  return getHostAPP() + getContextAPP();
}


// ENVIO Y RESPUESTA DEL SERVIDOR
const RequestServer = (
  beanRequest,
  json,
  parameters_pagination,
  modal = document.querySelector("#spanLoader")
) => {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('loadstart', () => {
    // console.log("comenzó a subir archivo");
  }, false);
  xhr.addEventListener('progress', (evt) => {
    // let progressBar = document.querySelector(".progress-bar");
    // if (evt.lengthComputable) {
    //   progressBar.setAttribute("aria-valuenow", evt.total);
    //   progressBar.setAttribute("aria-valuemax", evt.loaded);
    //   progressBar.style.width = Math.round(evt.loaded / evt.total * 100) + "%";
    //   progressBar.innerHTML = Math.round(evt.loaded / evt.total * 100) + '%';
    // }
    // let progressBar = document.querySelector("#spanLoader");
    if (evt.lengthComputable) {
      modal.innerText = Math.round(evt.loaded / evt.total * 100) + '%';
    }
  }, false);
  xhr.addEventListener('error', () => {
    console.log("error");
    circleCargando.toggleLoader("hide");
    showAlertErrorRequest();
  }, false);
  xhr.addEventListener('abort', () => {
    circleCargando.toggleLoader("hide");
    showAlertErrorRequest();
  }, false);

  xhr.open(
    beanRequest.type_request,
    getHostAPI() +
    beanRequest.entity_api +
    '/' +
    beanRequest.operation +
    parameters_pagination,
    true
  );
  xhr.responseType = 'json';
  xhr.setRequestHeader(
    'Authorization',
    'Bearer ' + Cookies.get('molino_token')
  );

  if (beanRequest.type_request === 'GET') {
    xhr.send();
  } else {
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify(json));
  }
  return xhr;
};
