async function fetchImages(folder) {
    try {
        const response = await fetch(`img/${folder}/`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        return Array.from(doc.querySelectorAll('a'))
            .map(link => link.href)
            .filter(href => href.match(/\.(jpe?g|png|gif|webp)$/i));
    } catch (error) {
        console.error(`Error fetching images from ${folder}:`, error);
        return [];
    }
}

function getRandomImages(images) {
    return images.sort(() => 0.5 - Math.random()).slice(0, 4);
}

async function updateImages() {
    const gamesImages = await fetchImages('games');
    const gamespImages = await fetchImages('gamesp');
    if (!gamesImages.length || !gamespImages.length) return;

    document.querySelectorAll('.caja2').forEach((caja, index) => {
        const randomImages = getRandomImages(index === 2 ? gamespImages : gamesImages);
        caja.querySelectorAll('.tarjeta .imagen').forEach((img, imgIndex) => {
            img.src = randomImages[imgIndex];
        });
    });
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

function onYouTubeIframeAPIReady() {
    new YT.Player('background-video');
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
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    overlay.appendChild(img.cloneNode());
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setRandomVideo();
    updateImages();
    document.getElementById('change-video').addEventListener('click', setRandomVideo);
    document.querySelectorAll('.tarjeta .imagen').forEach(img => {
        img.addEventListener('click', enlargeImage);
    });
});
