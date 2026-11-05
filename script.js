/* AETHER Water Systems — interactive behaviors */

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initParallax();
  initDiagram();
  initDashboard();
  initExploreButton();
  initNavHighlight();
  initSceneReveal();
});

function initSceneReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".scene").forEach(s => s.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".scene").forEach(s => observer.observe(s));
}

/* ---------- Water droplet particle canvas ---------- */
function initParticles() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.getElementById("water-particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(70, Math.floor((w * h) / 20000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 3 + 1.2,
        vx: (Math.random() - 0.5) * 0.25,
        vy: Math.random() * 0.4 + 0.15,
        alpha: Math.random() * 0.45 + 0.2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y > h + 10) {
        p.y = -10;
        p.x = Math.random() * w;
      }
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r * 0.7, p.r, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(195, 100%, 70%, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
}

/* ---------- Parallax on scroll ---------- */
function initParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const earth = document.querySelector(".earth");
  const craft = document.querySelector(".spacecraft-orbit");
  if (!earth) return;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    earth.style.transform = `translateY(${y * 0.12}px)`;
    if (craft && y < window.innerHeight) {
      craft.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.6));
    }
  }, { passive: true });
}

/* ---------- Interactive system diagram ---------- */
const diagramData = {
  waste: {
    title: "Wastewater Collection",
    text: "Urine (pretreated), humidity condensate from breath and sweat, hygiene water, and occasional Sabatier product water are collected and routed to the processors."
  },
  upa: {
    title: "UPA & Brine Processor",
    text: "The Urine Processor Assembly distills pretreated urine in a rotating centrifuge under vacuum. The Brine Processor Assembly recovers additional water from the leftover brine, helping push total recovery above 98%."
  },
  wpa: {
    title: "Water Processor Assembly",
    text: "Multifiltration beds remove particulates and ions. A catalytic reactor oxidizes remaining organics. Sensors check conductivity and other quality markers before the water is released as potable."
  },
  storage: {
    title: "Clean-Water Storage",
    text: "Purified water is stored in tanks and Contingency Water Containers. Hundreds to thousands of liters are kept on board as operational and emergency reserves."
  },
  use: {
    title: "Crew & System Use",
    text: "Clean water goes to drinking dispensers, food preparation, hygiene, toilet flush, and the Oxygen Generation Assembly. Almost all of it is recovered again, closing the loop."
  }
};

function initDiagram() {
  const nodes = document.querySelectorAll(".node");
  const panel = document.getElementById("diagram-info");
  if (!nodes.length || !panel) return;

  nodes.forEach(node => {
    node.addEventListener("click", () => {
      nodes.forEach(n => n.classList.remove("active"));
      node.classList.add("active");
      const key = node.dataset.info;
      const data = diagramData[key];
      if (data) {
        panel.innerHTML = `<h3>${data.title}</h3><p>${data.text}</p>`;
      }
    });

    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        node.click();
      }
    });
    node.setAttribute("tabindex", "0");
    node.setAttribute("role", "button");
  });
}

/* ---------- Dashboard subtle live variation ---------- */
function initDashboard() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const gauges = document.querySelectorAll(".gauge");
  gauges.forEach(g => {
    const base = parseFloat(g.dataset.value);
    const valueEl = g.querySelector(".gauge-value");
    if (!valueEl) return;

    setInterval(() => {
      const variation = (Math.random() - 0.5) * (base * 0.02);
      let next = base + variation;
      if (g.classList.contains("recovery")) next = Math.max(96, Math.min(99.5, next));
      else if (g.classList.contains("quality")) next = Math.max(97, Math.min(100, next));
      else next = Math.max(base * 0.97, Math.min(base * 1.03, next));

      const display = next >= 100 ? next.toFixed(0) : next.toFixed(1);
      valueEl.childNodes[0].textContent = display;
    }, 3000 + Math.random() * 2000);
  });
}

/* ---------- Explore button ---------- */
function initExploreButton() {
  const btn = document.getElementById("explore-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.getElementById("sources").scrollIntoView({ behavior: "smooth" });
  });
}

/* ---------- Active nav link ---------- */
function initNavHighlight() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".main-nav a");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove("active"));
        const active = document.querySelector(`.main-nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active");
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}
