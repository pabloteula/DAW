async function fetchImages(folder) {
    try {
        const response = await fetch(`img/${folder}/`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const images = Array.from(doc.querySelectorAll('a'))
            .map(link => link.href)
            .filter(href => href.match(/\.(jpe?g|png|gif|webp)$/i));
        return images;
    } catch (error) {
        console.error(`Error fetching images from ${folder}:`, error);
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
            img.src = image;
            img.alt = 'Tarjeta';

            const addButton = document.createElement('button');
            addButton.classList.add('add-button');
            addButton.textContent = '+';
            addButton.onclick = () => addToCollection(image);

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
    const gamesImages = await fetchImages('games');
    const gamespImages = await fetchImages('gamesp');
    if (gamesImages.length === 0 || gamespImages.length === 0) return;

    const caja2 = document.querySelector('.caja2');
    const randomImages = getRandomImages([...gamesImages, ...gamespImages]);
    const imageCards = createImageCards(randomImages);

    caja2.appendChild(imageCards);
}

document.addEventListener('DOMContentLoaded', updateImages);