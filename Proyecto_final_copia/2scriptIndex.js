








function cerrarSesion() {
    var ehttp = new XMLHttpRequest();
    ehttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "index.html";
        }
    };
    ehttp.open("POST", "http://localhost:8080/Metricmon/CerrarSesion", true);
    ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ehttp.send();
}

















function establecerCuenta() {
    rhttp = new XMLHttpRequest();
    rhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(rhttp.responseText);
            const nombre = response[0];
            const imagen = response[1];
            console.log(nombre);
            console.log(imagen);
            document.getElementById("usuario").innerHTML = "<img src="+imagen+"> "+nombre;
            
        }
    };
    rhttp.open("GET", "http://localhost:8080/Metricmon/IndexCuenta", true);
    rhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    rhttp.send();
}
establecerCuenta();