fetch("https://pokeapi.co/api/v2/pokemon?limit=900&offset=0")
    .then(response => response.json())
    .then(data => {
        let pokemonPromises = data.results.map(pokemon =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
                .then(response => response.json())
        );

        Promise.all(pokemonPromises).then(pokemonData => {
            // Ordenar los Pokémon por ID
            pokemonData.sort((a, b) => a.id - b.id);

            let content = document.getElementById("divPokemon");
            
            pokemonData.forEach(data => {
                const stats = data.stats.map(stat => stat.base_stat);
                const statsTotal = stats.reduce((acc, stat) => acc + stat, 0);
                let card = document.createElement("section");

                card.className = "section-lista-pokemon";
                let template = `
                        <img class="pokemon-img" onclick="verDetalles(
                        '${data.id}',
                        '${data.name}',
                        '${data.sprites.front_default}',
                        '${data.types[0].type.name}',
                        '${data.types[1]? data.types[1].type.name : ""}',
                        '${statsTotal}')" 
                        src="${data.sprites.front_default}" alt="${data.name}">
                        <p>${data.name}</p>
                    
                `;

                card.innerHTML = template;
                content.appendChild(card);
            });
        });
    });

function verDetalles(pkId,pkNombre, pkImg, tipoUno, tipoDos, stats) {
    document.getElementById("detallesPokemon").innerHTML = `
    <div class="div-fondo-detalles">
        <div class="div-confirmacion-detalles">
            <p>`+pkNombre+`</p>
            <img class="img-pokemon-detalles" src="`+pkImg+`" alt="`+pkNombre+`">
            <p>`+tipoUno+`</p>
            <p>`+tipoDos+`</p>
            <p>stats:`+stats+`</p>
            <button onclick="anadirAlEquipo(`+pkId+`)">Añadir a tu equipo</button>
            <button onclick="cerrarDetalles()">Cancelar</button>
        </div>
    </div>`;
    setTimeout(() => {
        document.querySelector('.div-confirmacion-detalles').classList.add('visible').classList.add('visible');
    },100);

}

function cerrarDetalles() {
    document.querySelector('.div-confirmacion-detalles').classList.remove('visible');
    setTimeout(() => {

        document.getElementById("detallesPokemon").innerHTML="";
    },350
);
}

function anadirAlEquipo(pkId) {
    ehttp= new XMLHttpRequest();
    ehttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert("Pokémon añadido al equipo correctamente");
            document.getElementById("pokemon").value = "";
        }
    };
    ehttp.open("POST", "http://localhost:8080/Metricmon/ListaAddPokemon", true);
    ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ehttp.send("idPokemon=" + pkId);
}


document.getElementById("buscadorInput").addEventListener("input", function() {
    const filtro = this.value.toLowerCase();
    const pokemonCards = document.querySelectorAll(".section-lista-pokemon");
    pokemonCards.forEach(card => {
        const pokemonName = card.querySelector("p").textContent.toLowerCase();
        if (pokemonName.includes(filtro)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
});

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