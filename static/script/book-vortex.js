
const books = [
    {
        image: "https://covers.openlibrary.org/b/isbn/0441063012-M.jpg",
        title: "I Simulacri",
        author: "P.K. Dick",
        score: "Puzzo dunque sono / 10"
    },
    {
        image: "https://covers.openlibrary.org/b/isbn/8878247448-M.jpg",
        title: "Cose Preziose",
        author: "Stephen King",
        score: "Lettura in corso"
    },
];

const universe = document.getElementById('universe');
const infoCard = document.getElementById('info-card');
const dividerEl = document.querySelector('nav');

let W = window.innerWidth;
let H = window.innerHeight;
let topBound = dividerEl.getBoundingClientRect().bottom + 10; // rimbalzo sul divider sotto al titolo

const CENTER = () => ({ x: W / 2, y: (topBound + H) / 2 });
const RESTITUTION = 0.88;      // energia conservata nel rimbalzo
const SWIRL_ACCEL = 60;        // spinta tangenziale (effetto vortice)
const WANDER_ACCEL = 14;       // piccola casualita' per un moto organico
const MAX_SPEED = 140;         // velocita' massima px/s

const items = books.map((book) => {
    const wrap = document.createElement('div');
    wrap.className = 'book-wrap';

    const img = document.createElement('img');
    img.src = book.image;
    img.alt = book.title;
    wrap.appendChild(img);
    universe.appendChild(wrap);

    const halfW = 40, halfH = 55; // stima iniziale, aggiornata dopo il load dell'immagine

    const it = {
        book, wrap, img,
        px: halfW + Math.random() * (W - halfW * 2),
        py: topBound + halfH + Math.random() * (H - topBound - halfH * 2),
        vx: (Math.random() - 0.5) * 60,
        vy: (Math.random() - 0.5) * 60,
        halfW, halfH,
        swirlDir: Math.random() < 0.5 ? 1 : -1,
        wanderAngle: Math.random() * Math.PI * 2,
        paused: false
    };

    img.addEventListener('load', () => {
        const r = img.getBoundingClientRect();
        it.halfW = r.width / 2;
        it.halfH = r.height / 2;
    });

    return it;
});

let hovered = null;

function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    topBound = dividerEl.getBoundingClientRect().bottom + 10;
    items.forEach(it => {
        it.px = Math.min(Math.max(it.px, it.halfW), W - it.halfW);
        it.py = Math.min(Math.max(it.py, topBound + it.halfH), H - it.halfH);
    });
}
window.addEventListener('resize', resize);

let lastTime = performance.now();

function animate(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const c = CENTER();

    items.forEach(it => {
        if (!it.paused) {
            const dx = it.px - c.x, dy = it.py - c.y;
            const dist = Math.hypot(dx, dy) + 0.0001;
            const tx = (-dy / dist) * it.swirlDir;
            const ty = (dx / dist) * it.swirlDir;

            it.wanderAngle += (Math.random() - 0.5) * 1.2;
            const wx = Math.cos(it.wanderAngle);
            const wy = Math.sin(it.wanderAngle);

            it.vx += (tx * SWIRL_ACCEL + wx * WANDER_ACCEL) * dt;
            it.vy += (ty * SWIRL_ACCEL + wy * WANDER_ACCEL) * dt;

            const speed = Math.hypot(it.vx, it.vy);
            if (speed > MAX_SPEED) {
                it.vx = (it.vx / speed) * MAX_SPEED;
                it.vy = (it.vy / speed) * MAX_SPEED;
            }

            it.px += it.vx * dt;
            it.py += it.vy * dt;

            const left = it.halfW, right = W - it.halfW;
            const top = topBound + it.halfH, bottom = H - it.halfH;

            if (it.px < left) { it.px = left; it.vx = Math.abs(it.vx) * RESTITUTION; }
            if (it.px > right) { it.px = right; it.vx = -Math.abs(it.vx) * RESTITUTION; }
            if (it.py < top) { it.py = top; it.vy = Math.abs(it.vy) * RESTITUTION; }
            if (it.py > bottom) { it.py = bottom; it.vy = -Math.abs(it.vy) * RESTITUTION; }
        }

        it.wrap.style.transform = `translate(${it.px - it.halfW}px, ${it.py - it.halfH}px)`;
    });

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

items.forEach(it => {
    it.img.addEventListener('mouseenter', () => {
        hovered = it;
        it.paused = true;
        it.wrap.classList.add('active');
        items.forEach(other => {
            if (other !== it) other.wrap.classList.add('dimmed');
        });

        infoCard.innerHTML = `<h2>${it.book.title}</h2><p>${it.book.author}</p><p>${it.book.score}</p>`;
        infoCard.classList.add('visible');
    });

    it.img.addEventListener('mousemove', (e) => {
        const pad = 18;
        let left = e.clientX + pad;
        let top = e.clientY + pad;
        if (left + 260 > W) left = e.clientX - 260 - pad;
        if (top + 120 > H) top = e.clientY - 120 - pad;
        infoCard.style.left = left + 'px';
        infoCard.style.top = top + 'px';
    });

    it.img.addEventListener('mouseleave', () => {
        it.paused = false;
        it.wrap.classList.remove('active');
        items.forEach(other => other.wrap.classList.remove('dimmed'));
        infoCard.classList.remove('visible');
        hovered = null;
    });
});
