function sombra(input) {
    input.classList.remove("botonClick");
    input.classList.add("botonClick");
}

function sinSombra(input) {
    input.classList.remove("botonClick");
}

document.addEventListener("DOMContentLoaded", function () {
    
    const botones = document.querySelectorAll(".boton");
    const pantalla = document.querySelector(".pantalla input");
    
    document.addEventListener("keydown", (event) => {
        const tecla = event.key;
        const simbolos = "+-*x/%=()";

        if (!isNaN(tecla) || simbolos.includes(tecla) || tecla === "Backspace" || tecla === "Enter" || tecla === "." || tecla === "C") {
            manejarTecla(tecla, pantalla);
        }
    });

    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("mousedown", () => sombra(botones[i]));
        botones[i].addEventListener("mouseup", () => sinSombra(botones[i]));
        botones[i].addEventListener("click", () => escribir(botones[i], pantalla));
    }
});

function manejarTecla(tecla, pantalla) {

    if (tecla === "Enter") {
        tecla = "=";
    }
    else if (tecla === "Backspace") {
        tecla = "\u00AB";
    }
    escribir({ innerText: tecla }, pantalla);
}

function escribir(boton, pantalla) {
    const botones = boton.innerText;
    const simbolos = "+-*x/%=";
    const simbolo = "\u00AB";

    if (pantalla.value == 0) {
        pantalla.value = "";
    }
    if (botones == "=") {
        if (pantalla.value != '') {
            if (pantalla.value.includes('%')) {
                const partes = pantalla.value.split("%");
                const porcentaje = parseFloat(partes[0]);
                const cifra = parseFloat(partes[1]);
                let resultado = (porcentaje / 100) * cifra;
                pantalla.value = resultado;
            } else {
                let resultado = eval(pantalla.value.replace("x", "*"));
                pantalla.value = resultado;
            } 
        } else {
            pantalla.value = 0;
        }
    } else if (simbolos.includes(botones)) {
        if (!(pantalla.value == "" || simbolos.includes(pantalla.value.slice(-1)))) {
            pantalla.value += botones;
        }
    } else if (botones == simbolo) {
        pantalla.value = pantalla.value.slice(0, -1);
    } else if (botones === "C") {
        pantalla.value = "0";
    } else if (botones === ".") {
        const partes = pantalla.value.split(/[\+\-\*x\/%]/);
        const ultimaParte = partes[partes.length - 1];

        if (!ultimaParte.includes(".")) {
            pantalla.value += botones;
        }
    } else if (botones === "()") {
        let pantallaP = pantalla.value;
        let pantallaF = "(" + pantallaP + ")"
        pantalla.value = pantallaF;
    } else {
        pantalla.value += botones;
    }
    if (pantalla.value == "") {
        pantalla.value = "0";
    }
}


