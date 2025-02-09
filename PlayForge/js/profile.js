// Función para obtener los datos del usuario desde el servidor
async function fetchUserData() {
    try {
        const response = await fetch('php/fetch_username.php');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return { username: 'Usuario', email: '', foto: '' };
    }
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

// Función para obtener los juegos en una colección específica
async function fetchGamesInCollection(collectionId) {
    try {
        const response = await fetch(`php/fetch_games_in_collection.php?collectionId=${collectionId}`);
        const games = await response.json();
        return games;
    } catch (error) {
        console.error('Error fetching games in collection:', error);
        return [];
    }
}

// Función para eliminar un juego de una colección
async function removeGameFromCollection(collectionId, gameId) {
    try {
        const response = await fetch('php/remove_game_from_collection.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ collectionId, gameId })
        });
        const result = await response.json();
        if (result.success) {
            return true;
        } else {
            alert('Error removing game from collection: ' + result.message);
            return false;
        }
    } catch (error) {
        console.error('Error removing game from collection:', error);
        return false;
    }
}

// Función para eliminar una colección
async function removeCollection(collectionId) {
    try {
        const response = await fetch('php/remove_collection.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ collectionId })
        });
        const result = await response.json();
        if (result.success) {
            return true;
        } else {
            alert('Error removing collection: ' + result.message);
            return false;
        }
    } catch (error) {
        console.error('Error removing collection:', error);
        return false;
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
    clonedImg.style.marginBottom = '20px';

    const infoContainer = document.createElement('div');
    infoContainer.style.color = 'white';
    infoContainer.style.fontSize = 'large';
    infoContainer.style.textAlign = 'center';

    const title = document.createElement('div');
    title.textContent = img.alt;

    infoContainer.appendChild(title);

    overlay.appendChild(clonedImg);
    overlay.appendChild(infoContainer);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

// Función para mostrar los juegos en una colección
function displayGames(games, collectionId) {
    const overlay = document.createElement('div');
    overlay.id = 'games-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    const gamesContainer = document.createElement('div');
    gamesContainer.className = 'games-container';
    gamesContainer.style.width = '60%';
    gamesContainer.style.backgroundColor = 'none';
    gamesContainer.style.borderRadius = '10px';
    gamesContainer.style.padding = '20px';
    gamesContainer.style.display = 'grid';
    gamesContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    gamesContainer.style.gap = '10px';
    gamesContainer.style.justifyContent = 'center';
    gamesContainer.style.overflowY = 'auto';
    gamesContainer.style.maxHeight = '80vh';

    games.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = 'tarjeta';
        gameElement.style.position = 'relative';
        gameElement.style.width = '200px';
        gameElement.style.height = '300px';

        const img = document.createElement('img');
        img.className = 'imagen';
        img.src = game.imagen_url;
        img.alt = game.titulo;
        img.dataset.platform = game.plataforma || 'Desconocida';
        img.dataset.year = game.año_lanzamiento || 'Desconocido';
        img.dataset.developer = game.desarrollador || 'Desconocido';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.addEventListener('click', enlargeImage);

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button';
        removeButton.textContent = '-';
        removeButton.style.position = 'absolute';
        removeButton.style.bottom = '10px';
        removeButton.style.right = '10px';
        removeButton.style.backgroundColor = '#9ba4d1';
        removeButton.style.color = 'white';
        removeButton.style.border = 'none';
        removeButton.style.borderRadius = '50%';
        removeButton.style.width = '30px';
        removeButton.style.height = '30px';
        removeButton.style.cursor = 'pointer';
        removeButton.addEventListener('click', async (event) => {
            event.stopPropagation();
            const success = await removeGameFromCollection(collectionId, game.id_videojuego);
            if (success) {
                gameElement.remove();
            }
        });

        gameElement.appendChild(img);
        gameElement.appendChild(removeButton);
        gamesContainer.appendChild(gameElement);
    });

    overlay.appendChild(gamesContainer);
    document.body.appendChild(overlay);
}

// Función para mostrar las colecciones
function displayCollections(collections) {
    const collectionsContainer = document.querySelector('.collections-container');
    if (collectionsContainer) {
        collectionsContainer.innerHTML = '';
    } else {
        const newCollectionsContainer = document.createElement('div');
        newCollectionsContainer.className = 'collections-container';
        document.querySelector('.caja2').appendChild(newCollectionsContainer);
    }

    collections.forEach(collection => {
        const collectionWrapper = document.createElement('div');
        collectionWrapper.className = 'collection-wrapper';
        collectionWrapper.style.display = 'flex';
        collectionWrapper.style.alignItems = 'center';

        const collectionElement = document.createElement('div');
        collectionElement.className = 'collection';
        collectionElement.textContent = collection.nombre_coleccion;
        collectionElement.style.cursor = 'pointer';
        collectionElement.addEventListener('click', async () => {
            const games = await fetchGamesInCollection(collection.id_coleccion);
            displayGames(games, collection.id_coleccion);
        });

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button';
        removeButton.textContent = '-';
        removeButton.style.marginLeft = '10px';
        removeButton.style.backgroundColor = 'purple';
        removeButton.style.color = 'white';
        removeButton.style.border = 'none';
        removeButton.style.borderRadius = '50%';
        removeButton.style.width = '30px';
        removeButton.style.height = '30px';
        removeButton.style.cursor = 'pointer';
        removeButton.addEventListener('click', async (event) => {
            event.stopPropagation();
            const success = await removeCollection(collection.id_coleccion);
            if (success) {
                collectionWrapper.remove();
            }
        });

        collectionWrapper.appendChild(collectionElement);
        collectionWrapper.appendChild(removeButton);
        document.querySelector('.collections-container').appendChild(collectionWrapper);
    });
}

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener('DOMContentLoaded', async () => {
    const userData = await fetchUserData();

    // Mostrar el nombre de usuario arriba de "Cerrar sesión"
    const usernameElement = document.createElement('div');
    usernameElement.className = 'username';
    usernameElement.textContent = userData.username;
    document.querySelector('.cerrarsesion').insertAdjacentElement('beforebegin', usernameElement);

    // Mostrar la foto, el nombre de usuario y el correo en la caja1
    document.getElementById('user-image').style.backgroundImage = `url(${userData.foto})`;
    document.getElementById('user-name').textContent = userData.username;
    document.getElementById('user-email').textContent = userData.email;

    // Evento para cambiar la imagen de perfil
    document.getElementById('change-image-button').addEventListener('click', async () => {
        const newImageUrl = prompt('Ingrese la nueva URL de la imagen de perfil:', 'img/');
        if (newImageUrl) {
            try {
                const response = await fetch('php/update_profile_image.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newImageUrl })
                });
                const result = await response.json();
                if (result.success) {
                    document.getElementById('user-image').style.backgroundImage = `url(${newImageUrl})`;
                } else {
                    alert('Error al actualizar la imagen de perfil: ' + result.message);
                }
            } catch (error) {
                console.error('Error updating profile image:', error);
            }
        }
    });

    // Evento para añadir una nueva colección
    document.getElementById('add-collection-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const collectionName = document.getElementById('collection-name').value;

        try {
            const response = await fetch('php/add_collection.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ collectionName })
            });
            const result = await response.json();
            if (result.success) {
                alert('Colección añadida exitosamente');
                const collections = await fetchCollections();
                displayCollections(collections);
            } else {
                alert('Error al añadir la colección: ' + result.message);
            }
        } catch (error) {
            console.error('Error adding collection:', error);
        }
    });

    // Obtener y mostrar las colecciones
    const collections = await fetchCollections();
    displayCollections(collections);
});