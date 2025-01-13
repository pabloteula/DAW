document.addEventListener("DOMContentLoaded", () => {

    // Obtener los elementos principales

    const tablero = document.getElementById("tablero");
    const numMinas = document.getElementById("numMinas");
    const empezar = document.getElementById("empezar");
    const error = document.getElementById("error");
    const protector = document.getElementById("protector");
    const mensajeFinal = document.getElementById("mensajeFinal");
    const mensajeTexto = document.getElementById("mensajeTexto");
    const reiniciar = document.getElementById("reiniciar");
    const puntos = document.getElementById("puntos");

    // Variables utilizadas en el juego

    let minas = [];
    let puntuacion = 0;
    let casillasRestantes = 100;

    // Generar el tablero

    const generarTablero = (bombas) => {
        tablero.innerHTML = "";
        error.textContent = "";
        puntuacion = 0;
        puntos.textContent = "0 puntos";

        minas = generarMinas(bombas);
        casillasRestantes = 100 - bombas;

        for (let i = 0; i < 100; i++) {
            const casilla = document.createElement("div");
            casilla.classList.add("casilla", "oculto");
            casilla.dataset.index = i;

            const valor = calcularValor(i);
            if (minas.includes(i)) {
                casilla.dataset.tipo = "mina";
            } else {
                casilla.dataset.valor = valor;
                if (valor > 0) {
                    casilla.textContent = valor;
                }
            }

            casilla.addEventListener("click", () => destaparCasilla(casilla, bombas));
            tablero.appendChild(casilla);
        }
    };

    // Generar posiciones aleatorias para las minas

    const generarMinas = (cantidad) => {
        const posiciones = new Set();
        while (posiciones.size < cantidad) {
            const posicionAleatoria = Math.floor(Math.random() * 100);
            posiciones.add(posicionAleatoria);
        }
        return Array.from(posiciones);
    };

    // Calcular el número de minas adyacentes a una casilla sin minas

    const calcularValor = (indice) => {
        const adyacentes = [-11, -10, -9, -1, 1, 9, 10, 11];
        let valor = 0;

        adyacentes.forEach((offset) => {
            const vecino = indice + offset;
            const filaActual = Math.floor(indice / 10);
            const filaVecina = Math.floor(vecino / 10);

            if (vecino >= 0 && vecino < 100 && Math.abs(filaActual - filaVecina) <= 1 && minas.includes(vecino)) {
                valor++;
            }
        });

        return valor;
    };

    // Destapar la casilla al clickar 

    const destaparCasilla = (casilla, bombas) => {
        if (!casilla.classList.contains("oculto")) return;

        casilla.classList.remove("oculto");
        if (casilla.dataset.tipo === "mina") {
            casilla.classList.add("mina");
            finalizarJuego(false, bombas);
        } else {
            const valor = parseInt(casilla.dataset.valor, 10);
            casilla.classList.add(valor === 1 ? "poco" : valor === 2 ? "medio" : "mucho");
            puntuacion += (valor + 1) * bombas;
            casillasRestantes--;
            puntos.textContent = `${puntuacion} puntos`;

            if (casillasRestantes === 0) {
                finalizarJuego(true, bombas);
            }
        }
    };

    // Finalizar el juego por derrota o victoria

    const finalizarJuego = (ganado) => {
        protector.classList.remove("ocultar");
        mensajeFinal.classList.remove("ocultar");
        mensajeTexto.textContent = ganado ? `¡Has ganado con ${puntuacion} puntos!` : `¡Has perdido con ${puntuacion} puntos!`;

        const casillas = document.querySelectorAll(".casilla");
        casillas.forEach((casilla) => casilla.removeEventListener("click", destaparCasilla));
    };

    // Comenzar un nuevo juego

    empezar.addEventListener("click", () => {
        const bombas = parseInt(numMinas.value, 10);
        if (isNaN(bombas) || bombas < 5 || bombas > 50) {
            error.textContent = "Tiene que ser un valor entre 5 y 50";
        } else {
            error.textContent = "";
            protector.classList.add("ocultar");
            mensajeFinal.classList.add("ocultar");
            generarTablero(bombas);
        }
    });

    // Reiniciar valores para volver a jugar

    reiniciar.addEventListener("click", () => {
        protector.classList.add("ocultar");
        mensajeFinal.classList.add("ocultar");
        error.textContent = "";
        puntos.textContent = "0 puntos";
        tablero.innerHTML = `
            <div>
                <input type="number" id="numMinas">
            </div>
            <div>
                <button id="empezar">Empezar</button>
            </div>
            <div id="error"></div>
        `;

        const nuevoNumMinasInput = document.getElementById("numMinas");
        const nuevoEmpezar = document.getElementById("empezar");
        nuevoEmpezar.addEventListener("click", () => {
            const bombas = parseInt(nuevoNumMinasInput.value, 10);
            if (isNaN(bombas) || bombas < 5 || bombas > 50) {
                error.textContent = "Tiene que ser un valor entre 5 y 50";
            } else {
                generarTablero(bombas);
            }
        });
    });
});