// Función para obtener los juegos desde el servidor
async function fetchGames() {
    try {
        const response = await fetch('php/fetch_games.php');
        const games = await response.json();
        return games;
    } catch (error) {
        console.error('Error fetching games:', error);
        return [];
    }
}

// Función para obtener imágenes aleatorias
function getRandomImages(images, count) {
    const shuffled = images.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Función para mostrar los juegos en las secciones correspondientes
function displayGames(games) {
    const sections = document.querySelectorAll('.caja2');
    sections.forEach((section, sectionIndex) => {
        const tarjetas = section.querySelectorAll('.tarjeta .imagen');
        let filteredGames = games;

        // Filtrar juegos según la sección
        if (sectionIndex === 2) {
            filteredGames = games.filter(game => game.imagen_url.includes('gamesp'));
        } else {
            filteredGames = games.filter(game => !game.imagen_url.includes('gamesp'));
        }

        const randomGames = getRandomImages(filteredGames, tarjetas.length);

        // Asignar imágenes y datos a las tarjetas
        randomGames.forEach((game, gameIndex) => {
            if (gameIndex < tarjetas.length) {
                const img = tarjetas[gameIndex];
                img.src = game.imagen_url;
                img.alt = game.titulo;
                // Asignar datos adicionales a los atributos de datos de la imagen
                img.dataset.platform = game.plataforma;
                img.dataset.year = game.año_lanzamiento;
                img.dataset.developer = game.desarrollador;
            }
        });
    });
}

// Función para establecer el video inicial
function setInitialVideo() {
    const initialVideoUrl = 'https://youtu.be/pdD2vMgAdh4';
    // Obtener el ID del video de la URL
    const videoId = new URL(initialVideoUrl).searchParams.get('v') || initialVideoUrl.split('/').pop().split('?')[0];
    document.getElementById('background-video').src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&enablejsapi=1&controls=1&modestbranding=1&vq=hd1080`;
}

// Función para establecer un video aleatorio
function setRandomVideo() {
    const videoUrls = [
        'https://youtu.be/OxqTqd1f_ao',
        'https://youtu.be/TC4rV_CFurw?list=PL36cn5BAUfBZwfYE716YIJpFjxwUWbBEV',
        'https://youtu.be/7LkQLIQcWiM?list=PL36cn5BAUfBYxDo9sgQXT425hZIxfX4I-',
        'https://youtu.be/pdD2vMgAdh4'
    ];

    // Seleccionar una URL de video aleatoria
    const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
    // Obtener el ID del video de la URL
    const videoId = new URL(randomVideoUrl).searchParams.get('v') || randomVideoUrl.split('/').pop().split('?')[0];
    document.getElementById('background-video').src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&enablejsapi=1&controls=1&modestbranding=1&vq=hd1080`;
}

// Función para agrandar la imagen al hacer clic
function enlargeImage(event) {
    const img = event.target;
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const clonedImg = img.cloneNode();
    clonedImg.style.maxWidth = '30%';
    clonedImg.style.maxHeight = '80%';
    clonedImg.style.borderRadius = '10px';
    clonedImg.style.marginBottom = '20px';

    const infoContainer = document.createElement('div');
    infoContainer.style.color = 'white';
    infoContainer.style.fontSize = 'large';
    infoContainer.style.textAlign = 'center';

    const title = document.createElement('div');
    title.textContent = img.alt;

    const platform = document.createElement('div');
    platform.textContent = img.dataset.platform || 'Desconocida';

    const year = document.createElement('div');
    year.textContent = img.dataset.year || 'Desconocido';

    const developer = document.createElement('div');
    developer.textContent = img.dataset.developer || 'Desconocido';

    infoContainer.appendChild(title);
    infoContainer.appendChild(platform);
    infoContainer.appendChild(year);
    infoContainer.appendChild(developer);

    overlay.appendChild(clonedImg);
    overlay.appendChild(infoContainer);
    document.body.appendChild(overlay);

    // Eliminar el overlay al hacer clic en él
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

// Función para obtener el nombre de usuario desde el servidor
async function fetchUsername() {
    try {
        const response = await fetch('php/fetch_username.php');
        const data = await response.json();
        return data.username;
    } catch (error) {
        console.error('Error fetching username:', error);
        return 'Usuario';
    }
}

// Evento que se ejecuta cuando el DOM ha sido cargado
document.addEventListener('DOMContentLoaded', async () => {
    const games = await fetchGames();
    displayGames(games);
    setInitialVideo();
    document.getElementById('change-video').addEventListener('click', setRandomVideo);
    document.querySelectorAll('.tarjeta .imagen').forEach(img => {
        img.addEventListener('click', enlargeImage);
    });
    const username = await fetchUsername();
    const usernameElement = document.createElement('div');
    usernameElement.className = 'username';
    usernameElement.textContent = username;
    document.querySelector('.cerrarsesion').insertAdjacentElement('beforebegin', usernameElement);
});