function enviarInicioSesion() {
    var ehttp = new XMLHttpRequest();

    ehttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("entrenador").value="";
            document.getElementById("contrasena").value="";
        }
    };
    ehttp.open("POST", "http://localhost:8080/Metricmon/InicioSesion", true);
    ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ehttp.send("entrenador="+document.getElementById("entrenador").value+"&contrasena="+document.getElementById("contrasena").value);
    recibirInicioSesion();
    
}

function recibirInicioSesion() {
    var rhttp = new XMLHttpRequest();
    const entrenador = document.getElementById("entrenador");

    rhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (rhttp.responseText=="correcto") {
                window.location.href="2elegirImagen.html"
            }else {
                alert("El usuario o la contraseña son incorrectos");
            }
            
        }
    };

    rhttp.open("GET", `http://localhost:8080/Metricmon/InicioSesion?nombreEntr=${encodeURIComponent(entrenador)}`, true);
    rhttp.send();
}