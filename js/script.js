// 0. Twinkling Stars
const starsContainer = document.createElement('div');
starsContainer.classList.add('stars');
document.body.appendChild(starsContainer);
for(let i = 0; i < 70; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.width = Math.random() * 5 + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.animationDuration = (1.5 + Math.random() * 3) + 's';
    star.style.animationDelay = Math.random() * 2 + 's';
    starsContainer.appendChild(star);
}

// 1. Music Player & Autoplay Logic
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

// Function to handle playing music and updating UI
const playMusic = () => {
    if (!isPlaying) {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.innerText = '⏸️';
            musicBtn.style.background = 'rgba(212, 175, 55, 0.3)';
            musicBtn.style.borderColor = 'var(--gold)';
            musicBtn.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.5)';
        }).catch(err => {
            console.log("Browser blocked autoplay. Waiting for user interaction.");
        });
    }
};

// Toggle button manually
musicBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering document listener
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.innerText = '🎵';
        musicBtn.style.background = 'rgba(212, 175, 55, 0.1)';
        musicBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
    } else {
        playMusic();
    }
    isPlaying = !isPlaying;
});

// Autoplay workaround: Start music on first interaction (click, touch, or scroll)
const startAudioOnInteract = () => {
    if (!isPlaying) {
        playMusic();
    }
    // Remove listeners once activated
    ['click', 'touchstart', 'scroll'].forEach(evt => {
        document.removeEventListener(evt, startAudioOnInteract);
    });
};

['click', 'touchstart', 'scroll'].forEach(evt => {
    document.addEventListener(evt, startAudioOnInteract, { once: true });
});

// Try to play immediately on load (some browsers allow it)
window.addEventListener('load', () => {
    setTimeout(playMusic, 500);
});

// 2. Confetti on load
window.addEventListener('load', () => {
    setTimeout(() => {
        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.5 },
            colors: ['#d4af37', '#b76e79', '#f7e7ce', '#ffffff'] // Gold, Rose Gold, Champagne, White
        });
    }, 500);
});

// 3. Balloons Animation
const balloonsContainer = document.getElementById('balloons-container');
const colors = ['#ff9a9e', '#fecfef', '#ffb6b9', '#fae3d9', 'rgba(255,255,255,0.6)'];

for (let i = 0; i < 20; i++) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.style.left = Math.random() * 100 + 'vw';
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.animationDuration = (7 + Math.random() * 6) + 's';
    balloon.style.animationDelay = (Math.random() * 5) + 's';
    balloonsContainer.appendChild(balloon);
}

// 4. Typewriter Effect
const messageText = "You are not just my best friend, you are my sister by heart. Having you in my life is the greatest gift. Wishing you the happiest of birthdays! 💕";
const typewriterEl = document.getElementById('typewriter');
let typeIndex = 0;
let isTyping = false;

function typeWriter() {
    if (typeIndex < messageText.length) {
        typewriterEl.innerHTML += messageText.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 40);
    }
}

const observer = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting && !isTyping) {
        isTyping = true;
        typeWriter();
    }
}, { threshold: 0.4 });

observer.observe(document.getElementById('message'));

// 5. Initialize Swiper 3D Carousel
const swiper = new Swiper('.mySwiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 40,
        stretch: 0,
        depth: 300,
        modifier: 1,
        slideShadows: true,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    loop: true,
});

// 6. Surprise Modal & Fireworks
const surpriseBtn = document.getElementById('surpriseBtn');
const modal = document.getElementById('surpriseModal');
const closeModal = document.getElementById('closeModal');

surpriseBtn.addEventListener('click', () => {
    modal.classList.add('active');
    
    const hbdSound = document.getElementById('hbdSound');
    if (hbdSound) {
        hbdSound.volume = 1.0;
        hbdSound.play().catch(e => console.log("HBD Audio play failed"));
        if (isPlaying && bgMusic) {
            bgMusic.pause();
            hbdSound.onended = () => {
                if (isPlaying) bgMusic.play();
            };
        }
    }

    // Initialize the 3D Cake if it hasn't been yet
    if(typeof initCake === 'function') {
        initCake();
    }
    
    // Fireworks effect
    const duration = 4000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#d4af37', '#f7e7ce']
        });
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#d4af37', '#f7e7ce']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    const hbdSound = document.getElementById('hbdSound');
    if (hbdSound) {
        hbdSound.pause();
        hbdSound.currentTime = 0;
        if (isPlaying && bgMusic && bgMusic.paused) {
            bgMusic.play();
        }
    }
});

// Videos Play/Pause on hover
const videos = document.querySelectorAll('video');
videos.forEach(v => {
    v.addEventListener('mouseover', () => {
        v.play();
        v.parentElement.querySelector('.play-icon').style.opacity = '0';
    });
    v.addEventListener('mouseleave', () => {
        v.parentElement.querySelector('.play-icon').style.opacity = '1';
    });
});
