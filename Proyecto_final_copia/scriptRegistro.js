function enviar() {
    var ehttp = new XMLHttpRequest();

    ehttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("entrenador").value = "";  
            document.getElementById("contrasena").value = "";
        }
    };

    ehttp.open("POST", "http://localhost:8080/Metricmon/NomEntrenador", true);
    ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ehttp.send("entrenador="+document.getElementById("entrenador").value+"&contrasena="+document.getElementById("contrasena").value);
    setTimeout(() => {
        rebre();
    }, 1000);


}


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
    setTimeout(() => {
        window.location.href="2elegirImagen.html";
    }, 1000);
}



function rebre() {
    var rhttp = new XMLHttpRequest();

    rhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (rhttp.responseText=="Nombre no disponible") {
                alert("Este nombre no está disponible");
            }else{
                window.location.href = "inicio_sesion_desde_registro.html";
            }
            
        }
    };

    rhttp.open("GET", "http://localhost:8080/Metricmon/NomEntrenador", true);
    rhttp.send();
}

/*function enviarPokemon() {
    const nombrePokemon = document.getElementById("pokemon").value.toLowerCase();

    fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`)
        .then(res => {
            if (!res.ok) throw new Error("Pokémon no encontrado");
            return res.json();
        })
        .then(data => {
            const idPokemon = data.id;

            // Aquí envías el ID del entrenador y del Pokémon al servidor
            const entrenador = document.getElementById("entrenador").value;

            const ehttp = new XMLHttpRequest();
            ehttp.open("POST", "http://localhost:8080/Metricmon/AddPokemon", true);
            ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            ehttp.send("entrenador=" + entrenador + "&pokemonId=" + idPokemon);
        })
        .catch(err => alert("Error: " + err.message));
}*/

function enviarPokemon() {
    var pokemon = document.getElementById("pokemon").value;
    var ehttp = new XMLHttpRequest();

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Pokémon no encontrado");
        }
        return response.json();
    })
    .then(data => {
        const idPokemon = data.id;
        ehttp.onreadystatechange = function () {
            if (this.readystate === 4 && this.status=== 200) {
                document.getElementById("entrenador").value = "";
                document.getElementById("pokemon").value = "";
            }
        }
        ehttp.open("POST", "http://localhost:8080/Metricmon/AddPokemon", true);
        ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ehttp.send("nomEntrenador=" + document.getElementById("entrenador").value + "&idPokemon=" + idPokemon);
    });
    
    }

function recibirPokemon() {
        var entrenador = document.getElementById("entrenador").value;
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
                    const nomPokemon = data.name
                    const imgPokemon = `<img src="${data.sprites.front_default}">`;
                    console.log(nomPokemon);
                    document.getElementById("listaPokemons").innerHTML +=nomPokemon+imgPokemon;

                    
                    
                })

            });
            }
        };
    
        rhttp.open("GET", `http://localhost:8080/Metricmon/AddPokemon?nomEntrenador=${encodeURIComponent(entrenador)}`, true); //Por la cara
        rhttp.send();
        }





    /*var ehttp = new XMLHttpRequest();

    ehttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            alert("Pokémon añadido al equipo correctamente");
            document.getElementById("pokemon").value = "";
        }
    };

    ehttp.open("POST", "http://localhost:8080/Metricmon/EquipoPokemon", true);
    ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // Aquí mandamos los datos como en un formulario
    ehttp.send("entrenador=" + encodeURIComponent(entrenador) + "&pokemonId=" + encodeURIComponent(pokemon));*/


function prueba() {
    var ehttp = new XMLHttpRequest();

    ehttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("entrenador").value = "";
        }
    };

    ehttp.open("POST", "http://localhost:8080/Metricmon/NomEntrenador", true);
    ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ehttp.send("entrenador="+document.getElementById("entrenador").value);

}