document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.item');
    const seleccionado = document.getElementById('seleccionado');
    const enemigo = document.getElementById('enemigo');
    const proteccion = document.getElementById('proteccion');
    const deliveracion = document.getElementById('deliveracion');
    const mensaje = document.getElementById('mensaje');
    const continuar = document.getElementById('continuar');
    const yo = document.getElementById('yo');
    const el = document.getElementById('el');
    const opciones = ['piedra', 'papel', 'tijera', 'lagarto', 'spock'];
    let puntuacionJugador = 0;
    let puntuacionOponente = 0;

    // Mensajes de victoria

    const mensajes = {
        piedra: {
            tijera: 'Piedra aplasta tijeras',
            lagarto: 'Piedra aplasta lagarto'
        },
        papel: {
            piedra: 'Papel tapa piedra',
            spock: 'Papel desautoriza a Spock'
        },
        tijera: {
            papel: 'Tijeras cortan papel',
            lagarto: 'Tijeras decapitan lagarto'
        },
        lagarto: {
            spock: 'Lagarto envenena a Spock',
            papel: 'Lagarto devora papel'
        },
        spock: {
            tijera: 'Spock rompe tijeras',
            piedra: 'Spock vaporiza piedra'
        }
    };

    // Seleccionar item

    items.forEach(item => {
        item.addEventListener('dblclick', () => {
            seleccionar(item);
        });
    });

    continuar.addEventListener('click', () => {
        mensaje.classList.add('invisible');
        proteccion.classList.add('invisible');
        deliveracion.classList.add('invisible');
        enemigo.querySelector('img').src = 'img/interrogante.png';
        seleccionado.innerHTML = '';
    });

    // Seleccionar aleatoriamente el item del enemigo

    function seleccionar(item) {
        seleccionado.innerHTML = item.innerHTML;
        proteccion.classList.remove('invisible');
        deliveracion.classList.remove('invisible');
        setTimeout(() => {
            deliveracion.classList.add('invisible');
            const eleccionEnemigo = opciones[Math.floor(Math.random() * opciones.length)];
            enemigo.querySelector('img').src = `img/${eleccionEnemigo}.png`;
            determinarGanador(item.querySelector('img').src.split('/').pop().split('.')[0], eleccionEnemigo);
        }, 2500);
    }

    // Determinar el ganador, perdedor o empate

    function determinarGanador(miEleccion, eleccionEnemigo) {
        const reglas = {
            piedra: ['tijera', 'lagarto'],
            papel: ['piedra', 'spock'],
            tijera: ['papel', 'lagarto'],
            lagarto: ['spock', 'papel'],
            spock: ['tijera', 'piedra']
        };

        let resultado = '';
        if (miEleccion === eleccionEnemigo) {
            resultado = 'Empate';
        } else if (reglas[miEleccion].includes(eleccionEnemigo)) {
            resultado = mensajes[miEleccion][eleccionEnemigo];
            puntuacionJugador++;
            actualizarPuntos(yo, puntuacionJugador, 'mio');
        } else {
            resultado = mensajes[eleccionEnemigo][miEleccion];
            puntuacionOponente++;
            actualizarPuntos(el, puntuacionOponente, 'suyo');
        }

        mensaje.querySelector('p').textContent = resultado;
        mensaje.classList.remove('invisible');
        proteccion.classList.remove('invisible');

        // Verificar si se han llegado a la puntuación máxima

        if (puntuacionJugador >= 10 || puntuacionOponente >= 10) {
            mensaje.querySelector('p').textContent = puntuacionJugador >= 10 ? 'Has ganado la partida' : 'Has perdido la partida';
            puntuacionJugador = 0;
            puntuacionOponente = 0;
            yo.innerHTML = '';
            el.innerHTML = '';
        }
    }

    // Añadir puntos al marcador
    
    function actualizarPuntos(container, puntos, clase) {
        const punto = document.createElement('div');
        punto.classList.add('punto', clase);
        container.appendChild(punto);
    }
});