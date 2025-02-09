// Función para obtener las imágenes desde el servidor
async function fetchImages() {
    try {
        const response = await fetch('php/fetch_games.php');
        const images = await response.json();
        // Filtrar imágenes que contienen 'img/games/' y no contienen 'gamesp'
        return images.filter(image => image.imagen_url.includes('img/games/') && !image.imagen_url.includes('gamesp'));
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
}

// Función para obtener imágenes aleatorias
function getRandomImages(images) {
    const shuffled = images.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 20);
}

// Función para crear tarjetas de imágenes
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
            img.dataset.platform = image.plataforma;
            img.dataset.year = image.año_lanzamiento;
            img.dataset.developer = image.desarrollador;

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

// Función para obtener las colecciones desde el servidor
async function fetchCollections() {
    try {
        const response = await fetch('php/fetch_collections.php');
        const collections = await response.json();
        return collections;
    } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
    }
}

// Función para añadir una imagen a una colección
async function addToCollection(imageUrl) {
    const collections = await fetchCollections();
    if (collections.length === 0) {
        alert('No collections available. Please create a collection first.');
        return;
    }

    const collectionOptions = collections.map((collection, index) => `${index + 1}. ${collection.nombre_coleccion}`).join('\n');
    const collectionIndex = prompt(`Select a collection to add the game to:\n${collectionOptions}`);
    const selectedCollection = collections[parseInt(collectionIndex) - 1];

    if (!selectedCollection) {
        alert('Invalid collection selected.');
        return;
    }

    try {
        const response = await fetch('php/add_game_to_collection.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ collectionId: selectedCollection.id_coleccion, imageUrl })
        });
        const result = await response.json();
        if (result.success) {
            alert('Game added to collection successfully.');
        } else {
            alert('Error adding game to collection: ' + result.message);
        }
    } catch (error) {
        console.error('Error adding game to collection:', error);
    }
}

// Función para actualizar las imágenes en la página
async function updateImages() {
    const images = await fetchImages();
    if (images.length === 0) return;

    const caja2 = document.querySelector('.caja2');
    const randomImages = getRandomImages(images);
    const imageCards = createImageCards(randomImages);

    caja2.appendChild(imageCards);
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

    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

// Evento que se ejecuta cuando el DOM ha sido cargado
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