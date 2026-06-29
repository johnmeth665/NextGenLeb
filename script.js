/* ============================================================
   NextGenLeb — main.js
   ============================================================ */

/* ------------------------------------------------------------
   CUSTOM CURSOR
   ------------------------------------------------------------ */
const cur  = document.getElementById('cur');
const cur2 = document.getElementById('cur2');


if(cur && cur2){

document.addEventListener('mousemove', e => {

let mouseX=e.clientX;
let mouseY=e.clientY;

cur.style.transform =
`translate(${mouseX-5}px,${mouseY-5}px)`;

});

}

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cur.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
});

(function animateCursorTrail() {
  trailX += (mouseX - trailX) * 0.11;
  trailY += (mouseY - trailY) * 0.11;
  cur2.style.transform = `translate(${trailX - 16}px, ${trailY - 16}px)`;
  requestAnimationFrame(animateCursorTrail);
})();

// Cursor hover effect on interactive elements
document.querySelectorAll('button, a, .svc-card, .why-card, .port-card, .tech-card, .ind-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform += ' scale(2.5)';
    cur.style.background = '#A78BFA';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.background = '#2563EB';
  });
});

/* ------------------------------------------------------------
   SCROLL REVEAL
   ------------------------------------------------------------ */
const revealObserver = new IntersectionObserver(
(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("v");

}

});

},
{
threshold:0,
rootMargin:"0px 0px -100px 0px"
});


document.querySelectorAll(".reveal").forEach((el)=>{

revealObserver.observe(el);

});

/* ------------------------------------------------------------
   ANIMATED STAT COUNTERS
   ------------------------------------------------------------ */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el     = entry.target;
    const target = Number(el.dataset.t);
    let   count  = 0;
    const step   = target / 55;

    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = Math.floor(count) + '+';
      if (count >= target) {
        el.textContent = target + '+';
        clearInterval(timer);
      }
    }, 18);

    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-t]').forEach(el => counterObserver.observe(el));

/* ------------------------------------------------------------
   PORTFOLIO TAB SWITCHER
   ------------------------------------------------------------ */
function portTab(btn, cat) {
  document.querySelectorAll('.port-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Future: filter .port-card elements by data-cat attribute if needed
}

/* ------------------------------------------------------------
   NEURAL NETWORK CANVAS ANIMATION
   ------------------------------------------------------------ */
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W   = canvas.width;
  const H   = canvas.height;

  // Build nodes
  const nodes = [];
  for (let i = 0; i < 28; i++) {
    nodes.push({
      x:     40 + Math.random() * (W - 80),
      y:     20 + Math.random() * (H - 40),
      r:     2  + Math.random() * 2.5,
      phase: Math.random() * Math.PI * 2,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3,
    });
  }

  let t = 0;

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    t += 0.018;

    // Move nodes, bounce off walls
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 10 || n.x > W - 10) n.vx *= -1;
      if (n.y < 10 || n.y > H - 10) n.vy *= -1;
    });

    // Draw edges between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.strokeStyle = `rgba(37,99,235,${(1 - dist / 120) * 0.15})`;
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes with pulse
    nodes.forEach(n => {
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.4 + n.phase);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * (0.8 + 0.5 * pulse), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${37 + pulse * 80}, ${99 - pulse * 20}, 235, ${0.4 + 0.6 * pulse})`;
      ctx.fill();
    });

    requestAnimationFrame(drawFrame);
  }

  drawFrame();
})();
