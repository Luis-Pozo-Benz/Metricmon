function elegirImagen(imagen) {
    // Aquí puedes agregar la lógica para manejar la imagen seleccionada
    console.log("Imagen seleccionada:", imagen);
    ehttp = new XMLHttpRequest();
    ehttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("imagen").value = "";
        }
    };
    ehttp.open("POST", "http://localhost:8080/Metricmon/ElegirImagen", true);
    ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ehttp.send("imagen=" + imagen);

    window.location.href = "2indexCuenta.html";
}