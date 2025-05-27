function recibirPokemon() {

        var rhttp = new XMLHttpRequest();
        rhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const idPokemon = JSON.parse(rhttp.responseText);
                console.log(idPokemon);
                
                
                
            idPokemon.forEach(id => {
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Pokémon no encontrado");
                    }
                    return response.json();
                }).then(data=> {
                    const idRandom = Math.floor(Math.random() * 1000);
                    const id = data.id;
                    const nomPokemon = data.name
                    const imgPokemon = `<img class="img-pokemon-perfil" src="${data.sprites.front_default}">`;
                    const tipoUno = data.types[0].type.name;
                    const tipoDos = data.types[1] ? data.types[1].type.name : "";
                    console.log(nomPokemon);
                    document.getElementById("sectionPokemonPerfil").innerHTML += `<div id="pokemonDetalles${idRandom}" class="pokemon-detalles">
                    ${imgPokemon}
                    <p>${nomPokemon}</p>
                    <p> ${tipoUno}</p>
                    <p> ${tipoDos}</p>
                    <button onclick="eliminarPokemon(${id},${idRandom})">Eliminar Pokémon</button>
                    </div>`;
                    
                        const section = document.getElementById("pokemonDetalles" + idRandom);
                        section.className = ""; // Limpiar clases anteriores
                        section.classList.add(`tipo-${tipoUno}`);

                })

            });
            }
        };
    
        rhttp.open("GET", `http://localhost:8080/Metricmon/MostrarPokemonPerfil`, true);
        rhttp.send();
        }
setTimeout(() => {
    recibirPokemon();
}, 500);



function eliminarPokemon(id, idRandom) {
    var ehttp = new XMLHttpRequest();
    console.log("hola");
    ehttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        if (confirm("¿Estás seguro de que quieres eliminar este Pokémon?")) {
            document.getElementById("pokemonDetalles" + idRandom).remove();
            alert("Pokémon eliminado correctamente");
        }
        else {
            id = null;
        }
    }
}
    ehttp.open("POST", "http://localhost:8080/Metricmon/EliminarPokemon", true);
    ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ehttp.send("idPokemon=" + id);
}


function cambiarImagen() {
    window.location.href="2elegirImagen.html";
}




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


function establecerPerfil() {
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
establecerPerfil();