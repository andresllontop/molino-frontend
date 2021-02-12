console.log("PathName: " + window.location.pathname);
if (window.location.pathname == getContextAPP() + "auth/login") {
    if (Cookies.get("sisbu_token") != undefined) {
        if (parseJwt(Cookies.get("sisbu_token"))) {
            sendIndex();
        }
    }
}