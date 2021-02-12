
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(getHostFrontEnd() + 'service_worker.js')
        .then(reg => console.log("Registrado service worker", reg))
        .catch(err => console.warn("erro al registar sw", err));
}
