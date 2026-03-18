document.addEventListener("DOMContentLoaded", () => {
    // 1. Boot Loader
    const bootScreen = document.getElementById("boot-screen");
    const progressBar = document.querySelector(".progress-bar");
    
    setTimeout(() => {
        progressBar.style.width = "100%";
        setTimeout(() => {
            gsap.to(bootScreen, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    bootScreen.style.display = "none";
                    initMainAnimations();
                }
            });
            // Enhance zoom-in effect on load
            gsap.fromTo("main", { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" });
        }, 1000);
    }, 2000); // Shorter boot for dev iteration

    // 2. Audio & Hover Interactions
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    const playHoverSound = () => {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    };

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot follows instantly
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        
        // Outline lags via animation
        cursorOutline.animate({
            left: `${mouseX}px`,
            top: `${mouseY}px`
        }, { duration: 300, fill: "forwards" });
    });

    const attachCursorEvents = () => {
        document.querySelectorAll(".interactive").forEach(el => {
            el.addEventListener("mouseenter", () => {
                cursorOutline.classList.add("hover");
                playHoverSound();
            });
            el.addEventListener("mouseleave", () => {
                cursorOutline.classList.remove("hover");
            });
        });
    };
    window.attachCursorEvents = attachCursorEvents;
    attachCursorEvents();

    // 3. 3D Tilt Cards Parallax
    document.querySelectorAll(".tilt-card").forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            card.style.transition = "transform 0.5s ease";
        });
        card.addEventListener("mouseenter", () => {
            card.style.transition = "none";
        });
    });

    // 4. Hero Parallax Elements
    const parallaxWrapper = document.querySelector(".parallax-wrapper");
    if(parallaxWrapper){
        parallaxWrapper.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            gsap.to(".floating-shapes", { x: x*2, y: y*2, duration: 1, ease: "power2.out" });
            gsap.to(".intro-content", { x: -x, y: -y, rotateY: x*0.5, rotateX: -y*0.5, duration: 1, ease: "power2.out" });
        });
    }

    // 5. Alternating Title
    const titles = document.querySelectorAll('.title-option');
    let titleIndex = 0;
    setInterval(() => {
        titles[titleIndex].classList.remove('active');
        titleIndex = (titleIndex + 1) % titles.length;
        titles[titleIndex].classList.add('active');
    }, 4000);

    // 6. Particles.js with Red/Blue Setup
    if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 1000 } },
                "color": { "value": ["#00ddff", "#ff2a5f"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.4, "random": true },
                "size": { "value": 2, "random": true },
                "line_linked": { "enable": true, "distance": 180, "color": "#00ddff", "opacity": 0.15, "width": 1 },
                "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "out_mode": "out" }
            },
            "interactivity": {
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } },
                "modes": { "grab": { "distance": 250, "line_linked": { "opacity": 0.5, "color": "#ff2a5f" } } }
            },
            "retina_detect": true
        });
    }

    // 7. Navbar Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const state = navLinks.style.display;
            if (state === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%'; navLinks.style.left = '0'; navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(5, 5, 8, 0.95)';
                navLinks.style.padding = '20px 0';
                navLinks.style.borderBottom = '1px solid var(--neon-blue)';
            }
            playHoverSound();
        });
    }

    // 8. GSAP Scroll & Section Revealer
    function initMainAnimations() {
        if (typeof gsap === "undefined") return;
        gsap.registerPlugin(ScrollTrigger);

        // Staggered reveals for block-revealer items
        gsap.utils.toArray('.scene').forEach(scene => {
            const items = scene.querySelectorAll('.block-revealer');
            if(items.length > 0) {
                gsap.from(items, {
                    scrollTrigger: {
                        trigger: scene,
                        start: "top 75%",
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out"
                });
            }
        });

        // Language Bars
        gsap.utils.toArray('.bar-fill').forEach(bar => {
            gsap.to(bar, {
                scrollTrigger: { trigger: bar, start: "top 90%" },
                width: bar.getAttribute('data-width'),
                duration: 1.5, ease: "power3.out"
            });
        });
    }

    // Orbit Counter-Rotation CSS injected dynamically to apply the angle var accurately
    document.querySelectorAll('.orbit-1 .skill-tag').forEach(t => t.style.animation = 'counter-spin-1 25s linear infinite');
    document.querySelectorAll('.orbit-2 .skill-tag').forEach(t => t.style.animation = 'counter-spin-2 40s linear infinite');

    // 9. Modal Logic (GSAP timeline)
    const missions = {
        'eiden': { title: 'EIDEN — Only the Blade Remains', tech: 'Unreal Engine 5 | Blueprint & C++ | AI Behaviortrees', desc: '<p>A cursed island with seven immortal demons. The player is an immortal ronin seeking death through battle in this third-person action game.</p><ul><li><strong>Core focus:</strong> AI-driven adaptive enemy system</li><li><strong>Real-time Impact:</strong> Combat fluidly dynamically adjusts difficulty.</li></ul>' },
        'cs2': { title: 'CS2 Match Predictor', tech: 'Python | Random Forest | Pandas', desc: '<p>Data-driven prediction system modeling player metadata to forecast match outcomes.</p><ul><li><strong>Precision:</strong> High F1-score optimization</li></ul>' },
        'smartchat': { title: 'SmartChat – AI Chatbot', tech: 'Java Swing | MySQL | Gemini API', desc: '<p>Premium desktop conversational UI bridging legacy frameworks with modern LLM responses.</p>' },
        'skyforce': { title: 'SkyForce', tech: 'Unity | C#', desc: '<p>Dynamic 2D shooter testing foundational game architecture, memory management, and OOP mechanics.</p>' }
    };

    const modal = document.getElementById('mission-modal');
    const modalContent = document.querySelector('.modal-content');
    const modalBg = document.querySelector('.modal-bg');
    
    window.openMission = (id) => {
        playHoverSound();
        const data = missions[id];
        document.getElementById('modal-dynamic-content').innerHTML = `
            <div class="modal-body">
                <h2>${data.title}</h2>
                <span class="tech-stack">${data.tech}</span>
                ${data.desc}
            </div>
        `;
        
        modal.classList.remove('hidden');
        gsap.fromTo(modalBg, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(modalContent, { y: 100, scale: 0.8, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" });
        // reattach events inside modal
        setTimeout(() => attachCursorEvents(), 100);
    };

    window.closeMission = () => {
        playHoverSound();
        gsap.to(modalContent, { y: 50, scale: 0.9, opacity: 0, duration: 0.3 });
        gsap.to(modalBg, { opacity: 0, duration: 0.3, onComplete: () => {
            modal.classList.add('hidden');
        }});
    };
});
