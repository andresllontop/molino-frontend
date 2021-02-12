function closeSession() {
  let keys = keysCOOKIES();
  for (let i = 0; i < keys.length; i++) {
    //console.log('remove' + keys[i]);
    Cookies.remove(keys[i]);
  }
  //REDIRECCIONAMOS EL LOGIN
  location.href = getContextAPP() + 'auth/login';
}

function keysCOOKIES() {
  var keys = ['molino_user', 'molino_token'];
  return keys;
}

function parseJwt(token) {
  try {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    JSON.parse(window.atob(base64));
    return true;
  } catch (error) {
    console.log('Error el token no es valido');
    return false;
  }
  //return JSON.parse(window.atob(base64));
}

function setCookieSession(token, user) {
  Cookies.set('molino_user', user);
  Cookies.set('molino_token', token);
}

function sendIndex() {
  let user = Cookies.getJSON('molino_user');
  console.log(user);
  if (user == undefined) {
    closeSession();
    return;
  }

  switch (user.tipo_usuario) {
    case 1:
      //TIENDA
      location.href = getContextAPP() + 'app/molino/index';
      break;
    case 2:
      location.href = getContextAPP() + 'app/molino/index';
      break;
  }
}

function getIdAreaUserSession() {
  let url = window.location.href;
  if (url.includes('obstetricia')) return 4;

  if (url.includes('psicopedagogia')) return 6;

  if (url.includes('social')) return 7;
}

function setUrlFotoUserSession(url_foto) {
  document.querySelectorAll('.dt-avatar').forEach((img) => {
    img.setAttribute('src', url_foto);
  });
}
