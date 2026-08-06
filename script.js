/**
 * Main Application Module
 * Architecture: Modular Vanilla JS
 * Optimizations: requestAnimationFrame, IntersectionObserver, Event Delegation
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Módulo 1: Utilidades e Inicialización Global ---
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // --- Módulo 2: Custom Cursor (Solo Desktop) ---
    const initCursor = () => {
        if (isTouchDevice) return;
        
        const cursor = document.getElementById('cursor');
        const follower = document.getElementById('cursor-follower');
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Immediate update for the dot
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        // Smooth follow animation
        const render = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.transform = `translate3d(${followerX - 20}px, ${followerY - 20}px, 0)`;
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        // Hover effects on interactable elements
        const hoverTargets = document.querySelectorAll('a, button, .masonry-item, .gift-box');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                follower.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                follower.classList.remove('hovering');
            });
        });
    };

    // --- Módulo 3: Scroll Progress y Botón Subir ---
    const initScrollFeatures = () => {
        const progressBar = document.getElementById('scroll-progress');
        const btnUp = document.getElementById('btn-up');
        
        window.addEventListener('scroll', () => {
            // Progreso
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";

            // Botón Subir
            if (winScroll > 500) {
                btnUp.classList.add('visible');
            } else {
                btnUp.classList.remove('visible');
            }
        });

        btnUp.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // --- Módulo 4: Intro & Typewriter ---
    const initIntro = async () => {
        const introSection = document.getElementById('intro');
        const introTextEl = document.getElementById('intro-text');
        const btnDiscover = document.getElementById('btn-discover');
        
        const lines = [
            "Hola...",
            "Quizá te preguntes qué es todo esto.",
            "Solo quería hacer algo diferente para ti.",
            "No una simple felicitación.",
            "Quería regalarte un pequeño momento.",
            "Porque las personas especiales merecen detalles especiales.",
            "Y tú eres una de ellas."
        ];

        const typeWriter = async (text, element, speed = 60) => {
            element.innerHTML = '';
            for (let i = 0; i < text.length; i++) {
                element.innerHTML += text.charAt(i);
                await new Promise(r => setTimeout(r, speed));
            }
        };

        // Secuencia de animación
        await new Promise(r => setTimeout(r, 500)); // Pausa inicial
        for (let line of lines) {
            await typeWriter(line, introTextEl);
            await new Promise(r => setTimeout(r, 800)); // Pausa entre líneas
        }
        
        btnDiscover.classList.remove('fade-hidden');
        btnDiscover.classList.add('fade-visible');

        btnDiscover.addEventListener('click', () => {
            introSection.classList.add('hidden');
            setTimeout(() => {
                introSection.style.display = 'none';
                document.body.style.overflow = 'auto'; // Habilitar scroll
                initCartaTypewriter(); // Iniciar carta tras descubrir
                playMusic(); // Intenta reproducir música
            }, 1000);
        });
    };

    // --- Módulo 5: Intersection Observer (Animaciones al hacer scroll) ---
    const initScrollReveal = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Solo animar una vez
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    };

    // --- Módulo 6: Máquina de Escribir de la Carta (Glassmorphism) ---
    let cartaInitiated = false;
    const initCartaTypewriter = () => {
        const cartaSection = document.getElementById('carta');
        const cartaTextEl = document.getElementById('carta-text');
        const mensaje = "Hoy 7 de agosto, el mundo es un lugar mejor porque tú estás en él. Quería crear algo único, algo que permaneciera en el tiempo, al igual que nuestra amistad. A través de estas fotos y palabras, quiero recordarte lo increíble que eres. Disfruta tu día al máximo. ¡Feliz Cumpleaños!";
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !cartaInitiated) {
                cartaInitiated = true;
                let i = 0;
                cartaTextEl.innerHTML = '';
                const type = () => {
                    if (i < mensaje.length) {
                        cartaTextEl.innerHTML += mensaje.charAt(i);
                        i++;
                        setTimeout(type, 40); // Velocidad natural
                    }
                };
                setTimeout(type, 500); // Retraso inicial
            }
        }, { threshold: 0.5 });
        
        observer.observe(cartaSection);
    };

    // --- Módulo 7: Lightbox Profesional ---
    const initLightbox = () => {
        const items = document.querySelectorAll('.masonry-item');
        const lightbox = document.getElementById('lightbox');
        const lbImg = document.getElementById('lightbox-img');
        const lbClose = document.getElementById('lightbox-close');
        const lbNext = document.getElementById('lightbox-next');
        const lbPrev = document.getElementById('lightbox-prev');
        const lbCounter = document.getElementById('lightbox-counter');
        
        let currentIndex = 0;
        const total = items.length;
        const images = Array.from(items).map(item => item.querySelector('img').src);

        const updateLightbox = () => {
            lbImg.src = images[currentIndex];
            lbCounter.textContent = `${currentIndex + 1} / ${total}`;
        };

        const openLightbox = (index) => {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        const nextImage = () => { currentIndex = (currentIndex + 1) % total; updateLightbox(); };
        const prevImage = () => { currentIndex = (currentIndex - 1 + total) % total; updateLightbox(); };

        items.forEach(item => {
            item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
        });

        lbClose.addEventListener('click', closeLightbox);
        lbNext.addEventListener('click', nextImage);
        lbPrev.addEventListener('click', prevImage);
        
        // Teclado
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    };

    // --- Módulo 8: Carrusel de Frases (Fade Automático) ---
    const initFrases = () => {
        const frases = document.querySelectorAll('.frase');
        let index = 0;
        
        setInterval(() => {
            frases[index].classList.remove('active');
            index = (index + 1) % frases.length;
            frases[index].classList.add('active');
        }, 5000); // Cambia cada 5 segundos
    };

    // --- Módulo 9: Sorpresa Caja de Regalo 3D ---
    const initRegalo = () => {
        const box = document.getElementById('gift-box');
        const message = document.getElementById('gift-message');
        const section = document.getElementById('regalo');
        let opened = false;

        const createConfetti = () => {
            const colors = ['#009dff', '#00d47e', '#ffcf00', '#ff0055'];
            for(let i=0; i<60; i++) {
                const conf = document.createElement('div');
                conf.classList.add('confetti-piece');
                conf.style.background = colors[Math.floor(Math.random() * colors.length)];
                conf.style.left = '50%';
                conf.style.top = '50%';
                section.appendChild(conf);

                // Animación JS
                const angle = Math.random() * Math.PI * 2;
                const velocity = 5 + Math.random() * 10;
                let x = 0, y = 0, opacity = 1;
                
                const animate = () => {
                    x += Math.cos(angle) * velocity;
                    y += Math.sin(angle) * velocity + 2; // Gravedad
                    opacity -= 0.02;
                    conf.style.transform = `translate(${x}px, ${y}px) rotate(${x}deg)`;
                    conf.style.opacity = opacity;
                    
                    if(opacity > 0) requestAnimationFrame(animate);
                    else conf.remove();
                };
                requestAnimationFrame(animate);
            }
        };

        box.addEventListener('click', () => {
            if (opened) return;
            opened = true;
            box.classList.add('opened');
            createConfetti();
            setTimeout(() => {
                message.classList.remove('fade-hidden');
                message.classList.add('fade-visible');
            }, 600);
        });
    };

    // --- Módulo 10: Control de Audio ---
    let musicPlaying = false;
    const playMusic = () => {
        const audio = document.getElementById('bg-music');
        const iconPath = document.querySelector('#music-icon path');
        
        audio.play().then(() => {
            musicPlaying = true;
            // Cambiar a icono de Pausa (Barras verticales)
            iconPath.setAttribute('d', 'M6 4h4v16H6zM14 4h4v16h-4z');
        }).catch(err => {
            console.log("Autoplay bloqueado por el navegador, se requiere interacción del usuario.");
        });
    };

    const initAudio = () => {
        const btn = document.getElementById('music-btn');
        const audio = document.getElementById('bg-music');
        const iconPath = document.querySelector('#music-icon path');

        btn.addEventListener('click', () => {
            if (musicPlaying) {
                audio.pause();
                musicPlaying = false;
                // Icono Play
                iconPath.setAttribute('d', 'M5 3l14 9-14 9V3z');
            } else {
                audio.play();
                musicPlaying = true;
                // Icono Pause
                iconPath.setAttribute('d', 'M6 4h4v16H6zM14 4h4v16h-4z');
            }
        });
    };

    // --- Ejecución Inicial (Bloqueo de scroll al principio) ---
    document.body.style.overflow = 'hidden'; 
    initCursor();
    initScrollFeatures();
    initIntro();
    initScrollReveal();
    initLightbox();
    initFrases();
    initRegalo();
    initAudio();

});