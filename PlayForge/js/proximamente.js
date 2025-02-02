async function fetchImages() {
    try {
        const response = await fetch('php/fetch_games.php');
        const images = await response.json();
        return images.filter(image => image.imagen_url.includes('img/gamesp/'));
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
}

function getRandomImages(images) {
    const shuffled = images.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 20);
}

function createImageCards(images) {
    const container = document.createDocumentFragment();

    for (let i = 0; i < images.length; i += 4) {
        const tarjetasContainer = document.createElement('div');
        tarjetasContainer.classList.add('tarjetas');

        const imageSubset = images.slice(i, i + 4);
        imageSubset.forEach(image => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta');

            const img = document.createElement('img');
            img.classList.add('imagen');
            img.src = image.imagen_url;
            img.alt = image.titulo;
            img.dataset.platform = image.plataforma; // Add platform data

            const addButton = document.createElement('button');
            addButton.classList.add('add-button');
            addButton.textContent = '+';
            addButton.onclick = () => addToCollection(image.imagen_url);

            tarjeta.appendChild(img);
            tarjeta.appendChild(addButton);
            tarjetasContainer.appendChild(tarjeta);
        });

        container.appendChild(tarjetasContainer);
    }

    return container;
}

function addToCollection(image) {
    console.log(`Image added to collection: ${image}`);
    // Aquí puedes añadir la lógica para añadir la imagen a una colección
}

async function updateImages() {
    const images = await fetchImages();
    if (images.length === 0) return;

    const caja2 = document.querySelector('.caja2');
    const randomImages = getRandomImages(images);
    const imageCards = createImageCards(randomImages);

    caja2.appendChild(imageCards);
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

    const infoContainer = document.createElement('div');
    infoContainer.style.color = 'white';
    infoContainer.style.fontSize = 'large';
    infoContainer.style.textAlign = 'center';

    const title = document.createElement('div');
    title.textContent = img.alt;

    const platform = document.createElement('div');
    platform.textContent = img.dataset.platform || 'Desconocida';

    infoContainer.appendChild(title);
    infoContainer.appendChild(platform);

    overlay.appendChild(clonedImg);
    overlay.appendChild(infoContainer);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await updateImages();
    const username = await fetchUsername();
    const usernameElement = document.createElement('div');
    usernameElement.className = 'username';
    usernameElement.textContent = username;
    document.querySelector('.cerrarsesion').insertAdjacentElement('beforebegin', usernameElement);
    document.querySelectorAll('.tarjeta .imagen').forEach(img => {
        img.addEventListener('click', enlargeImage);
    });
});