const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const trackTitle = document.querySelector('.track-title');
const trackArtist = document.querySelector('.track-artist');
const trackCover = document.querySelector('.cover');
const trackItems = document.querySelectorAll('.track-item');

let currentTrackIndex = 0;
let isPlaying = false;

const tracks = Array.from(trackItems).map(item => ({
    src: item.dataset.track,
    title: item.dataset.title,
    artist: item.dataset.artist,
    cover: item.dataset.cover
}));

function loadTrack(index) {
    if (index < 0 || index >= tracks.length) {
        console.error('Invalid track index');
        return;
    }

    audio.src = tracks[index].src;
    trackTitle.textContent = tracks[index].title;
    trackArtist.textContent = tracks[index].artist;
    trackCover.src = tracks[index].cover;
    highlightActiveTrack(index);

    // Ждем, пока трек полностью загрузится
    audio.addEventListener('loadeddata', () => {
        if (isPlaying) playTrack();
    }, { once: true });
}

function highlightActiveTrack(index) {
    trackItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

function playTrack() {
    audio.play().then(() => {
        playBtn.textContent = '⏸️';
        isPlaying = true;
    }).catch(error => {
        console.error('Error playing track:', error);
    });
}

function pauseTrack() {
    audio.pause();
    playBtn.textContent = '▶️';
    isPlaying = false;
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
    }
});

progressBar.addEventListener('input', () => {
    if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
});

volumeBar.addEventListener('input', () => {
    audio.volume = volumeBar.value;
});

prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
});

nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
});

trackItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
    });
});

// Инициализируем первый трек
loadTrack(currentTrackIndex);
