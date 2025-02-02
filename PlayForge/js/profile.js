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

    document.getElementById('change-image-button').addEventListener('click', async () => {
        const newImageUrl = prompt('Ingrese la nueva URL de la imagen de perfil:');
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
});