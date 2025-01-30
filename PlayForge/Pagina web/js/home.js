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

function getRandomImages(images, count) {
    const shuffled = images.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayGames(games) {
    const sections = document.querySelectorAll('.caja2');
    sections.forEach((section, sectionIndex) => {
        const tarjetas = section.querySelectorAll('.tarjeta .imagen');
        let filteredGames = games;

        if (sectionIndex === 2) {
            filteredGames = games.filter(game => game.imagen_url.includes('gamesp'));
        } else {
            filteredGames = games.filter(game => !game.imagen_url.includes('gamesp'));
        }

        const randomGames = getRandomImages(filteredGames, tarjetas.length);

        randomGames.forEach((game, gameIndex) => {
            if (gameIndex < tarjetas.length) {
                tarjetas[gameIndex].src = game.imagen_url;
                tarjetas[gameIndex].alt = game.titulo;
            }
        });
    });
}

function setInitialVideo() {
    const initialVideoUrl = 'https://youtu.be/pdD2vMgAdh4';
    const videoId = new URL(initialVideoUrl).searchParams.get('v') || initialVideoUrl.split('/').pop().split('?')[0];
    document.getElementById('background-video').src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&enablejsapi=1&controls=1&modestbranding=1&vq=hd1080`;
}

function setRandomVideo() {
    const videoUrls = [
        'https://youtu.be/OxqTqd1f_ao',
        'https://youtu.be/TC4rV_CFurw?list=PL36cn5BAUfBZwfYE716YIJpFjxwUWbBEV',
        'https://youtu.be/7LkQLIQcWiM?list=PL36cn5BAUfBYxDo9sgQXT425hZIxfX4I-',
        'https://youtu.be/pdD2vMgAdh4'
    ];

    const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
    const videoId = new URL(randomVideoUrl).searchParams.get('v') || randomVideoUrl.split('/').pop().split('?')[0];
    document.getElementById('background-video').src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&enablejsapi=1&controls=1&modestbranding=1&vq=hd1080`;
}

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

    const title = document.createElement('div');
    title.style.color = 'white';
    title.style.marginTop = '10px';
    title.textContent = img.alt;

    overlay.appendChild(clonedImg);
    overlay.appendChild(title);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

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