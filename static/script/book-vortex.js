
const books = [
    {
        id: 1,
        image: "https://covers.openlibrary.org/b/isbn/0441063012-M.jpg",
        title: "I Simulacri",
        author: "P.K. Dick",
        status: "Letto Luglio 2026",
        score: "3"
    },
    {
        id: 2,
        image: "https://covers.openlibrary.org/b/isbn/8878247448-M.jpg",
        title: "Cose Preziose",
        author: "Stephen King",
        status: "Lettura in corso",
        score: "0"
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

    it.img.addEventListener('click', () => {
        window.location.href = `libro.html?id=${it.book.id}&name=${it.book.title}`;
    });

    return it;
});

let hovered = null;

function showBookCard(it, clientX, clientY) {
    hovered = it;
    it.paused = true;
    it.wrap.classList.add('active');
    items.forEach(other => {
        if (other !== it) other.wrap.classList.add('dimmed');
    });

    infoCard.innerHTML = `
  <h2>${it.book.title}</a></h2>
  <p><strong>Autore:</strong> ${it.book.author}</p>
  <p><strong>Stato lettura:</strong> ${it.book.status}</p>
  <p><strong>Voto:</strong> ${renderTentacleScore(it.book.score, 5)}</p>
`;
    infoCard.classList.add('visible');
    positionInfoCard(clientX, clientY);
}

function hideBookCard() {
    if (!hovered) return;

    hovered.paused = false;
    hovered.wrap.classList.remove('active');
    items.forEach(other => other.wrap.classList.remove('dimmed'));
    infoCard.classList.remove('visible');
    hovered = null;
}

function renderTentacleScore(score, max = 5) {
    const filled = Math.max(0, Math.min(score, max));
    return Array.from({ length: max }, (_, i) =>
        `<img class="tentacle-score-icon" src="static/assets/icons/tentacle-icon-white.png" alt="tentacolo" ${i < filled ? '' : 'style="opacity:0.25;"'}>`
    ).join('');
}

function positionInfoCard(clientX, clientY) {
    const isMobile = W <= 480;
    const cardWidth = Math.min(infoCard.offsetWidth || (isMobile ? W - 20 : 340), W - 16);
    const cardHeight = Math.min(infoCard.offsetHeight || 160, H - 16);

    if (isMobile) {
        const left = Math.max(10, (W - cardWidth) / 2);
        const top = Math.max(topBound + 8, Math.min((H - cardHeight) / 2, H - cardHeight - 8));

        infoCard.style.left = left + 'px';
        infoCard.style.top = top + 'px';
        return;
    }

    let left = clientX + 18;
    let top = clientY + 18;

    if (left + cardWidth > W - 8) {
        left = clientX - cardWidth - 18;
    }

    if (top + cardHeight > H - 8) {
        top = clientY - cardHeight - 18;
    }

    left = Math.max(8, Math.min(left, W - cardWidth - 8));
    top = Math.max(topBound + 8, Math.min(top, H - cardHeight - 8));

    infoCard.style.left = left + 'px';
    infoCard.style.top = top + 'px';
}

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
    it.img.addEventListener('mouseenter', (e) => {
        showBookCard(it, e.clientX, e.clientY);
    });

    it.img.addEventListener('mousemove', (e) => {
        if (hovered === it) {
            positionInfoCard(e.clientX, e.clientY);
        }
    });

    it.img.addEventListener('mouseleave', () => {
        hideBookCard();
    });

    it.img.addEventListener('touchstart', (e) => {
        const touch = e.changedTouches[0] || e.touches[0];
        if (!touch) return;
        showBookCard(it, touch.clientX, touch.clientY);
    }, { passive: true });

    it.img.addEventListener('touchmove', (e) => {
        const touch = e.changedTouches[0] || e.touches[0];
        if (hovered === it && touch) {
            positionInfoCard(touch.clientX, touch.clientY);
        }
    }, { passive: true });
});

document.addEventListener('touchstart', (e) => {
    if (!hovered) return;
    const touchedBook = e.target.closest('.book-wrap');
    if (!touchedBook) {
        hideBookCard();
    }
}, { passive: true });
