function rebre() {
    var rhttp = new XMLHttpRequest();

    rhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("listaEntrenadores").innerHTML = rhttp.responseText;
            
        }
    };

    rhttp.open("GET", "http://localhost:8080/Metricmon/NomEntrenador", true);
    rhttp.send();
}
setTimeout(() => {
    rebre();
}, 500);



function verDetallesEntrenador(idEntrenador,nomEntrenador, imgEntrenador) {
    document.getElementById("sectionDetallesEntrenador").innerHTML = `
    <div class="div-fondo-detalles-entrenador">
        <div id="divDetallesEntrenador" class="div-confirmacion-detalles-entrenador">
            <p>`+nomEntrenador+`</p>
            <img class="img-entrenador-detalles" src="`+imgEntrenador+`">
            <section id="sectionPokemonDetallesEntrenador" class="section-pokemon-detalles-entrenador"></section>
            <div id="divResultadoComparacion" class="div-resultado-comparacion"></div>
            <button onclick="recibirCompararEntrenador(`+idEntrenador+`)">Comparar</button>
            <button onclick="cerrarDetalles()">Cancelar</button>
        </div>
    </div>`;
    setTimeout(() => {
        document.querySelector('.div-confirmacion-detalles-entrenador').classList.add('visible');
        verPokemonEntrenador(idEntrenador);
    },100);

}

function verPokemonEntrenador(entrenador) {
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
                    document.getElementById("sectionPokemonDetallesEntrenador").innerHTML += `<div class="pokemon-detalles">
                    ${imgPokemon}
                    <p>${nomPokemon}</p>
                    </div>`;

                })

            });
            }
        };
        rhttp.open("GET", `http://localhost:8080/Metricmon/AddPokemon?idEntrenador=${encodeURIComponent(entrenador)}`, true);
        rhttp.send();
    }






function recibirCompararEntrenador(idRival) {
    var rhttp = new XMLHttpRequest();
    var pkEntrenador = [];
    var pkRival = [];
    var puntosTotales = 0;
    rhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (rhttp.responseText == "noSeis") {
                alert("El entrenador o tú no tenéis seis Pokémon, no se puede comparar.");
            } else {
                for (let i = 0; i < 6; i++) {
                    pkEntrenador[i] = JSON.parse(rhttp.responseText)[i];
                }
                for (let i = 6; i < 12; i++) {
                    pkRival[i-6] = JSON.parse(rhttp.responseText)[i];
                }
                console.log("entrenador", pkEntrenador);
                console.log("rival", pkRival);
                compararEquipos(pkEntrenador, pkRival);
            }
        
    };}
    rhttp.open("GET", "http://localhost:8080/Metricmon/CompararEquipos?idRival="+idRival, true);
    rhttp.send();
}

function compararEquipos(pkEntrenador, pkRival) {
    let puntosTotales = 0;
for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
        const idxI = i;
        const idxJ = j;
        const idEntrenador = pkEntrenador[idxI];
        const idRival = pkRival[idxJ];

        fetch(`https://pokeapi.co/api/v2/pokemon/${idEntrenador}`)
        .then(response => {
            if (!response.ok) throw new Error("Pokémon no encontrado");
            return response.json();
        })
        .then(dataEntrenador => {
            const entrenadorTipoUno = dataEntrenador.types[0].type.name;
            const entrenadorTipoDos = dataEntrenador.types[1] ? dataEntrenador.types[1].type.name : "Ninguno";
            const entrenadorPokemon = dataEntrenador.name;
            const entrenadorStats = dataEntrenador.stats.map(stat => stat.base_stat);
            const entrenadorStatsTotal = entrenadorStats.reduce((acc, stat) => acc + stat, 0);

            return fetch(`https://pokeapi.co/api/v2/pokemon/${idRival}`)
                .then(response => {
                    if (!response.ok) throw new Error("Pokémon no encontrado");
                    return response.json();
                })
                .then(dataRival => {
                    const rivalTipoUno = dataRival.types[0].type.name;
                    const rivalTipoDos = dataRival.types[1] ? dataRival.types[1].type.name : "Ninguno";
                    const rivalPokemon = dataRival.name;
                    const rivalStats = dataRival.stats.map(stat => stat.base_stat);
                    const rivalStatsTotal = rivalStats.reduce((acc, stat) => acc + stat, 0);

                    console.log("Pokemon entrenador", entrenadorPokemon, idxI);
                    console.log("Pokemon rival", rivalPokemon, idxJ);

                    console.log("Tipo entrenador 1:", entrenadorTipoUno,"Tipo entrenador 2:", entrenadorTipoDos,"Tipo rival 1:", rivalTipoUno);

                    puntosTotales += compararTipos(entrenadorTipoUno, rivalTipoUno);
                    puntosTotales += compararTipos(entrenadorTipoUno, rivalTipoDos);
                    puntosTotales += compararTipos(entrenadorTipoDos, rivalTipoUno);
                    puntosTotales += compararTipos(entrenadorTipoDos, rivalTipoDos);

                    puntosTotales += compararStats(entrenadorStatsTotal, rivalStatsTotal);

                });
            })
            .catch(error => {
                console.error(error);
            });
            setTimeout(() => {
                document.getElementById("divResultadoComparacion").innerHTML = `Comparando.`
            }, 10);
            setTimeout(() => {
                document.getElementById("divResultadoComparacion").innerHTML = `Comparando..`
            }, 300);
            setTimeout(() => {
                document.getElementById("divResultadoComparacion").innerHTML = `Comparando...`
            }, 700);
            setTimeout(() => {
                console.log("Puntos totales:", puntosTotales);
                concluirComparacion(puntosTotales);
            }, 1000);
    }}
}


function concluirComparacion(puntosTotales) {
    console.log("Puntos totales al finalizar:", puntosTotales);
    if (150 < puntosTotales && puntosTotales <= 324) {
        document.getElementById("divResultadoComparacion").innerHTML = `
        <p class="prob-100">¡¡¡Ganarías de forma aplastante!!!</p>
        <p>Probabilidad de victoria: 100%</p>
        <p class="puntos-totales">Puntos totales: `+puntosTotales+`</p>`;
    }
    else if (75 < puntosTotales && puntosTotales <= 150) {
        document.getElementById("divResultadoComparacion").innerHTML = `
        <p class="prob-90">¡Te puedes hacer con la victoria fácilmente!</p>
        <p>Probabilidad de victoria: 90%</p>
        <p class="puntos-totales">Puntos totales: `+puntosTotales+`</p>`;
    }
    else if (50 < puntosTotales && puntosTotales <= 75) {
        document.getElementById("divResultadoComparacion").innerHTML = `
        <p class="prob-80">¡Te puedes hacer con la victoria fácilmente!</p>
        <p>Probabilidad de victoria: 80%</p>
        <p class="puntos-totales">Puntos totales: `+puntosTotales+`</p>`;
    }
    else if (30 < puntosTotales && puntosTotales <= 50) {
        document.getElementById("divResultadoComparacion").innerHTML = `
        <p class="prob-70">Ten algo de cuidado, pero tienes las de ganar</p>
        <p>Probabilidad de victoria: 70%</p>
        <p class="puntos-totales">Puntos totales: `+puntosTotales+`</p>`;
    }
    else if (15 < puntosTotales && puntosTotales <= 30) {
        document.getElementById("divResultadoComparacion").innerHTML = `
        <p class="prob-60">Ten cuidado: tienes las de ganar, pero no te confíes</p>
        <p>Probabilidad de victoria: 60%</p>
        <p class="puntos-totales">Puntos totales: `+puntosTotales+`</p>`;
    }
    else if (-15 < puntosTotales && puntosTotales <= 15) {
        document.getElementById("divResultadoComparacion").innerHTML = `
        <p class="prob-50">La batalla no podría estar más reñida
        <br>
        ¡Que gane el mejor!</p>
        <p>Probabilidad de victoria: 50%</p>
        <p class="puntos-totales">Puntos totales: `+puntosTotales+`</p>`;
    }
    else if (-30 < puntosTotales && puntosTotales <= -15) {
        document.getElementById("divResultadoComparacion").innerHTML = `
        <p class="prob-40">Tienes una ligera desventaja, pero nada que no puedas superar</p>
        <p>Probabilidad de victoria: 40%</p>
        <p class="puntos-totales">Puntos totales: `+puntosTotales+`</p>`;
    }
    else if (-50 < puntosTotales && puntosTotales <= -30) {
        document.getElementById("divResultadoComparacion").innerHTML = `
        <p class="prob-30">Con buena estrategia, la victoria puede ser tuya</p>
        <p>Probabilidad de victoria: 30%</p>
        <p class="puntos-totales">Puntos totales: `+puntosTotales+`</p>`;
    }
    else if (-75 < puntosTotales && puntosTotales <= -50) {
        document.getElementById("divResultadoComparacion").innerHTML = `
        <p class="prob-20">Las probabilidades no están a tu favor</p>
        <p>Probabilidad de victoria: 20%</p>
        <p class="puntos-totales">Puntos totales: `+puntosTotales+`</p>`;
    }
    else if (-150 < puntosTotales && puntosTotales <= -75) {
        document.getElementById("divResultadoComparacion").innerHTML = `
        <p class="prob-10">Es casi imposible alzarse con la victoria</p>
        <p>Probabilidad de victoria: 10%</p>
        <p class="puntos-totales">Puntos totales: `+puntosTotales+`</p>`;
    }
    else if (-324 < puntosTotales && puntosTotales <= -150) {
        document.getElementById("divResultadoComparacion").innerHTML = `
        <p class="prob-0">Nada te puede salvar...</p>
        <p>Probabilidad de victoria: 0%</p>
        <p class="puntos-totales">Puntos totales: `+puntosTotales+`</p>`;
    }
    
}

function compararStats(statsEntrenador, statsRival) {
    let puntos = 0;
    let resultado = statsEntrenador - statsRival;
    console.log(resultado);
    if (resultado > 300) {
        puntos +=5;
    }
    else if (resultado < -300) {
        puntos -=5;
    }
    else if (resultado > 250) {
        puntos +=4;
    }
    else if (resultado < -250) {
        puntos -=4;
    }
    else if (resultado > 200) {
        puntos +=3;
    }
    else if (resultado < -200) {
        puntos -=3;
    }
    else if (resultado >150) {
        puntos += 2;
    }
    else if (resultado < -150) {
        puntos -= 2;
    }
    else if (resultado > 75) {
        puntos += 1;
    }
    else if (resultado < -75) {
        puntos -= 1;
    }

    console.log("puntos stats: ",puntos);
    return puntos;

}

function compararTipos(entrenadorTipo, rivalTipo) { 

    
    var puntos = 0;

    //Tabla de normal
    ////Pozo eficaz
    if (entrenadorTipo == "normal" && rivalTipo == "rock") {
        puntos -= 1;
    } 
    else if (entrenadorTipo == "normal" && rivalTipo == "ghost") {
        puntos -= 3;
    }
    else if (entrenadorTipo == "normal" && rivalTipo == "steel") {
        puntos -= 1;
    }

    //Tabla de fuego
    ////Supereficaz
    else if (entrenadorTipo == "fire" && rivalTipo == "grass") {
        puntos += 1;
    } 
    else if (entrenadorTipo == "fire" && rivalTipo == "bug") {
        puntos += 1;
    }
    else if (entrenadorTipo == "fire" && rivalTipo == "ice") {
        puntos += 1;
    }
    else if (entrenadorTipo == "fire" && rivalTipo == "steel") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "fire" && rivalTipo == "water") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "fire" && rivalTipo == "dragon") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "fire" && rivalTipo == "rock") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "fire" && rivalTipo == "ground") {
        puntos -= 1;
    }

    //Tabla de agua
    ////Supereficaz
    else if (entrenadorTipo == "water" && rivalTipo == "fire") {
        puntos += 1;
    }
    else if (entrenadorTipo == "water" && rivalTipo == "ground") {
        puntos += 1;
    }
    else if (entrenadorTipo == "water" && rivalTipo == "rock") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "water" && rivalTipo == "grass") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "water" && rivalTipo == "dragon") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "water" && rivalTipo == "electric") {
        puntos -= 1;
    }

    //Tabla de eléctrico
    ////Supereficaz
    else if (entrenadorTipo == "electric" && rivalTipo == "water") {
        puntos += 1;
    }
    else if (entrenadorTipo == "electric" && rivalTipo == "flying") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "electric" && rivalTipo == "ground") {
        puntos -= 3;
    }
    else if (entrenadorTipo == "electric" && rivalTipo == "dragon") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "electric" && rivalTipo == "grass") {
        puntos -= 1;
    }

    //Tipo planta
    ////Supereficaz
    else if (entrenadorTipo == "grass" && rivalTipo == "water") {
        puntos += 1;
    }
    else if (entrenadorTipo == "grass" && rivalTipo == "ground") {
        puntos += 1;
    }
    else if (entrenadorTipo == "grass" && rivalTipo == "rock") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "grass" && rivalTipo == "fire") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "grass" && rivalTipo == "flying") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "grass" && rivalTipo == "bug") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "grass" && rivalTipo == "poison") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "grass" && rivalTipo == "dragon") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "grass" && rivalTipo == "steel") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "grass" && rivalTipo == "ice") {
        puntos -= 1;
    }

    //Tipo hielo
    ////Supereficaz
    else if (entrenadorTipo == "ice" && rivalTipo == "grass") {
        puntos += 1;
    }
    else if (entrenadorTipo == "ice" && rivalTipo == "flying") {
        puntos += 1;
    }
    else if (entrenadorTipo == "ice" && rivalTipo == "dragon") {
        puntos += 1;
    }
    else if (entrenadorTipo == "ice" && rivalTipo == "ground") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "ice" && rivalTipo == "fire") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "ice" && rivalTipo == "steel") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "ice" && rivalTipo == "water") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "ice" && rivalTipo == "fighting") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "ice" && rivalTipo == "rock") {
        puntos -= 1;
    }

    //Tipo lucha
    ////Supereficaz
    else if (entrenadorTipo == "fighting" && rivalTipo == "normal") {
        puntos += 1;
    }
    else if (entrenadorTipo == "fighting" && rivalTipo == "rock") {
        puntos += 1;
    }
    else if (entrenadorTipo == "fighting" && rivalTipo == "steel") {
        puntos += 1;
    }
    else if (entrenadorTipo == "fighting" && rivalTipo == "ice") {
        puntos += 1;
    }
    else if (entrenadorTipo == "fighting" && rivalTipo == "dark") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "fighting" && rivalTipo == "flying") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "fighting" && rivalTipo == "psychic") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "fighting" && rivalTipo == "fairy") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "fighting" && rivalTipo == "poison") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "fighting" && rivalTipo == "bug") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "fighting" && rivalTipo == "ghost") {
        puntos -= 3;
    }

    //Tipo veneno
    ////Supereficaz
    else if (entrenadorTipo == "poison" && rivalTipo == "grass") {
        puntos += 1;
    }
    else if (entrenadorTipo == "poison" && rivalTipo == "fairy") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "poison" && rivalTipo == "ground") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "poison" && rivalTipo == "rock") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "poison" && rivalTipo == "ghost") {
        puntos -= 3;
    }
    else if (entrenadorTipo == "poison" && rivalTipo == "steel") {
        puntos -= 3;
    }
    else if (entrenadorTipo == "poison" && rivalTipo == "psychic") {
        puntos -= 1;
    }

    //Tipo tierra
    ////Supereficaz
    else if (entrenadorTipo == "ground" && rivalTipo == "electric") {
        puntos += 1;
    }
    else if (entrenadorTipo == "ground" && rivalTipo == "fire") {
        puntos += 1;
    }
    else if (entrenadorTipo == "ground" && rivalTipo == "poison") {
        puntos += 1;
    }
    else if (entrenadorTipo == "ground" && rivalTipo == "rock") {
        puntos += 1;
    }
    else if (entrenadorTipo == "ground" && rivalTipo == "steel") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "ground" && rivalTipo == "bug") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "ground" && rivalTipo == "grass") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "ground" && rivalTipo == "flying") {
        puntos -= 3;
    }
    else if (entrenadorTipo == "ground" && rivalTipo == "water") {
        puntos -= 1;
    }

    //Tipo volador
    ////Supereficaz
    else if (entrenadorTipo == "flying" && rivalTipo == "grass") {
        puntos += 1;
    }
    else if (entrenadorTipo == "flying" && rivalTipo == "fighting") {
        puntos += 1;
    }
    else if (entrenadorTipo == "flying" && rivalTipo == "bug") {
        puntos += 1;
    }
    /////Poco eficaz
    else if (entrenadorTipo == "flying" && rivalTipo == "electric") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "flying" && rivalTipo == "rock") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "flying" && rivalTipo == "steel") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "flying" && rivalTipo == "ice") {
        puntos -= 1;
    }

    //Tipo psíquico
    ////Supereficaz
    else if (entrenadorTipo == "psychic" && rivalTipo == "fighting") {
        puntos += 1;
    }
    else if (entrenadorTipo == "psychic" && rivalTipo == "poison") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "psychic" && rivalTipo == "dark") {
        puntos -= 3;
    }
    else if (entrenadorTipo == "psychic" && rivalTipo == "steel") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "psychic" && rivalTipo == "bug") {
        puntos -= 1;
    }

    //Tipo bicho
    ////Supereficaz
    else if (entrenadorTipo == "bug" && rivalTipo == "grass") {
        puntos += 1;
    }
    else if (entrenadorTipo == "bug" && rivalTipo == "psychic") {
        puntos += 1;
    }
    else if (entrenadorTipo == "bug" && rivalTipo == "dark") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "bug" && rivalTipo == "fire") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "bug" && rivalTipo == "flying") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "bug" && rivalTipo == "poison") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "bug" && rivalTipo == "ghost") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "bug" && rivalTipo == "steel") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "bug" && rivalTipo == "fairy") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "bug" && rivalTipo == "fighting") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "bug" && rivalTipo == "rock") {
        puntos -= 1;
    }

    //Tipo roca
    ////Supereficaz
    else if (entrenadorTipo == "rock" && rivalTipo == "fire") {
        puntos += 1;
    }
    else if (entrenadorTipo == "rock" && rivalTipo == "ice") {
        puntos += 1;
    }
    else if (entrenadorTipo == "rock" && rivalTipo == "flying") {
        puntos += 1;
    }
    else if (entrenadorTipo == "rock" && rivalTipo == "bug") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "rock" && rivalTipo == "fighting") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "rock" && rivalTipo == "ground") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "rock" && rivalTipo == "steel") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "rock" && rivalTipo == "water") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "rock" && rivalTipo == "grass") {
        puntos -= 1;
    }

    //Tipo fantasma
    ////Supereficaz
    else if (entrenadorTipo == "ghost" && rivalTipo == "psychic") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "ghost" && rivalTipo == "dark") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "ghost" && rivalTipo == "normal") {
        puntos -= 2;
    }

    //Tipo dragón
    ////Supereficaz
    ////Poco eficaz
    else if (entrenadorTipo == "dragon" && rivalTipo == "fairy") {
        puntos -= 3;
    }
    else if (entrenadorTipo == "dragon" && rivalTipo == "steel") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "dragon" && rivalTipo == "ice") {
        puntos -= 1;
    }


    //Tipo siniestro
    ////Supereficaz
    else if (entrenadorTipo == "dark" && rivalTipo == "psychic") {
        puntos += 1;
    }
    else if (entrenadorTipo == "dark" && rivalTipo == "ghost") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "dark" && rivalTipo == "fighting") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "dark" && rivalTipo == "fairy") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "dark" && rivalTipo == "bug") {
        puntos -= 1;
    }

    //Tipo acero
    ////Supereficaz
    else if (entrenadorTipo == "steel" && rivalTipo == "ice") {
        puntos += 1;
    }
    else if (entrenadorTipo == "steel" && rivalTipo == "rock") {
        puntos += 1;
    }
    else if (entrenadorTipo == "steel" && rivalTipo == "fairy") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "steel" && rivalTipo == "fire") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "steel" && rivalTipo == "water") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "steel" && rivalTipo == "electric") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "steel" && rivalTipo == "ground") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "steel" && rivalTipo == "fighting") {
        puntos -= 1;
    }

    //Tipo hada
    ////Supereficaz
    else if (entrenadorTipo == "fairy" && rivalTipo == "fighting") {
        puntos += 1;
    }
    else if (entrenadorTipo == "fairy" && rivalTipo == "dark") {
        puntos += 1;
    }
    else if (entrenadorTipo == "fairy" && rivalTipo == "dragon") {
        puntos += 1;
    }
    ////Poco eficaz
    else if (entrenadorTipo == "fairy" && rivalTipo == "poison") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "fairy" && rivalTipo == "steel") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "fairy" && rivalTipo == "fire") {
        puntos -= 1;
    }
    else if (entrenadorTipo == "fairy" && rivalTipo == "steel") {
        puntos -= 1;
    }
    
    console.log("Puntos:", puntos);
    return puntos;
}






function cerrarDetalles() {
    document.querySelector('.div-confirmacion-detalles-entrenador').classList.remove('visible');
    setTimeout(() => {

        document.getElementById("sectionDetallesEntrenador").innerHTML="";
    },350);
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