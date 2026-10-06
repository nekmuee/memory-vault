/* ============================================================
   MEMORY VAULT — with SPARKLES, CONFETTI & DARK MODE
   ============================================================ */

let memories = JSON.parse(localStorage.getItem("memories")) || [];

const form = document.getElementById("memoryForm");
const memoryGrid = document.getElementById("memoryGrid");
const memoryCount = document.getElementById("memoryCount");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const confettiCanvas = document.getElementById("confettiCanvas");

/* ============================================================
   THEME TOGGLE (Dark Mode)
   ============================================================ */
function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
        document.body.classList.add("dark-mode");
        themeIcon.textContent = "☀️";
    } else {
        themeIcon.textContent = "🌙";
    }
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeIcon.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Little sparkle burst on toggle
    createSparkleBurst(window.innerWidth - 80, 60, 8);
});

/* ============================================================
   DISPLAY MEMORIES
   ============================================================ */
function displayMemories() {
    memoryGrid.innerHTML = "";

    if (memories.length === 0) {
        memoryGrid.innerHTML = `
            <p style="color:#9b6a7c; font-weight:500;">
                No memories yet. Add your first one ❤️
            </p>
        `;
        memoryCount.textContent = "0 memories";
        return;
    }

    memoryCount.textContent =
        memories.length +
        (memories.length === 1 ? " memory" : " memories");

    memories.forEach((memory, index) => {
        const card = document.createElement("div");
        card.className = "memory-card";
        card.innerHTML = `
            <img 
                src="${memory.image}"
                class="memory-image"
                alt="${memory.title}"
            >
            <div class="memory-info">
                <h3>${memory.title}</h3>
                <p>${memory.caption}</p>
                <span class="memory-date">
                    📅 ${memory.date}
                </span>
                ${
                    memory.people
                    ? `<div class="people">
                        👥 ${memory.people}
                    </div>`
                    : ""
                }
                <div class="card-buttons">
                    <button
                        class="favorite"
                        onclick="toggleFavorite(${index})"
                    >
                        ${memory.favorite ? "❤️" : "🤍"}
                    </button>
                    <button
                        class="delete"
                        onclick="deleteMemory(${index})"
                    >
                        Delete
                    </button>
                </div>
            </div>
        `;
        memoryGrid.appendChild(card);
    });
}

/* ============================================================
   ADD MEMORY (with Confetti 🎉)
   ============================================================ */
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const photo = document.getElementById("photo").files[0];
    const title = document.getElementById("title").value;
    const caption = document.getElementById("caption").value;
    const date = document.getElementById("date").value;
    const people = document.getElementById("people").value;

    if (!photo) {
        alert("Please choose a photo.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const newMemory = {
            image: e.target.result,
            title: title,
            caption: caption,
            date: date,
            people: people,
            favorite: false
        };

        memories.unshift(newMemory);

        localStorage.setItem(
            "memories",
            JSON.stringify(memories)
        );

        form.reset();
        displayMemories();

        // 🎉 PINK CONFETTI BURST!
        launchPinkConfetti();

        // Small delay before alert so user sees confetti
        setTimeout(() => {
            alert("Memory saved! ❤️");
            window.location.hash = "memories";
        }, 400);
    };

    reader.readAsDataURL(photo);
});

/* ============================================================
   DELETE MEMORY
   ============================================================ */
function deleteMemory(index) {
    const confirmDelete = confirm("Delete this memory?");
    if (!confirmDelete) return;

    memories.splice(index, 1);
    localStorage.setItem("memories", JSON.stringify(memories));
    displayMemories();
}

/* ============================================================
   FAVORITE (with Sparkle ✨)
   ============================================================ */
function toggleFavorite(index) {
    memories[index].favorite = !memories[index].favorite;
    localStorage.setItem("memories", JSON.stringify(memories));

    // Get card position for sparkle burst
    const cards = document.querySelectorAll(".memory-card");
    const card = cards[index];
    if (card) {
        const rect = card.getBoundingClientRect();
        createSparkleBurst(rect.left + 40, rect.top + rect.height - 40, 12);
    }

    displayMemories();
}

/* ============================================================
   RANDOM MEMORY
   ============================================================ */
function randomMemory() {
    if (memories.length === 0) {
        alert("You don't have any memories yet! Add one first ❤️");
        return;
    }

    const randomIndex = Math.floor(Math.random() * memories.length);
    const memory = memories[randomIndex];

    document.getElementById("randomImage").src = memory.image;
    document.getElementById("randomTitle").textContent = memory.title;
    document.getElementById("randomCaption").textContent = memory.caption;
    document.getElementById("randomDate").textContent = "📅 " + memory.date;

    document.getElementById("randomModal").style.display = "flex";

    // Sparkle burst on modal open
    setTimeout(() => {
        createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 15);
    }, 200);
}

/* ============================================================
   CLOSE RANDOM MEMORY
   ============================================================ */
function closeRandom() {
    document.getElementById("randomModal").style.display = "none";
}

window.addEventListener("click", function(e) {
    const modal = document.getElementById("randomModal");
    if (e.target === modal) {
        closeRandom();
    }
});

/* ============================================================
   ✨ SPARKLE BURST EFFECT ✨
   ============================================================ */
function createSparkleBurst(x, y, count = 10) {
    const sparkleChars = ["✨", "💖", "⭐", "💫", "🌸", "💕"];

    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement("div");
        sparkle.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
        sparkle.style.position = "fixed";
        sparkle.style.left = x + "px";
        sparkle.style.top = y + "px";
        sparkle.style.fontSize = (14 + Math.random() * 14) + "px";
        sparkle.style.pointerEvents = "none";
        sparkle.style.zIndex = "99999";
        sparkle.style.transition = "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        sparkle.style.opacity = "1";
        sparkle.style.filter = "drop-shadow(0 0 8px #f8bbd0)";
        document.body.appendChild(sparkle);

        // Random direction
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const distance = 60 + Math.random() * 80;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        requestAnimationFrame(() => {
            sparkle.style.transform = `translate(${dx}px, ${dy}px) scale(0) rotate(${Math.random() * 360}deg)`;
            sparkle.style.opacity = "0";
        });

        setTimeout(() => sparkle.remove(), 1100);
    }
}

/* ============================================================
   🎉 PINK CONFETTI 🎉
   ============================================================ */
let confettiParticles = [];
let confettiAnimationId = null;

function launchPinkConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext("2d");

    canvas.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pinkPalette = [
        "#f8bbd0", "#fce4ec", "#e6a3bb", "#d68ea6",
        "#b45373", "#ffd9e6", "#f0c0d0", "#e0a9b8",
        "#ffb6c1", "#ffc0cb"
    ];

    confettiParticles = [];

    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            size: 6 + Math.random() * 8,
            color: pinkPalette[Math.floor(Math.random() * pinkPalette.length)],
            speedY: 2 + Math.random() * 4,
            speedX: -2 + Math.random() * 4,
            rotation: Math.random() * 360,
            rotationSpeed: -6 + Math.random() * 12,
            shape: Math.random() > 0.5 ? "rect" : "circle",
            opacity: 0.85 + Math.random() * 0.15
        });
    }

    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
    }

    animateConfetti();
}

function animateConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;

    confettiParticles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        // Slight sway
        p.x += Math.sin(p.y * 0.02) * 0.5;

        if (p.y < canvas.height + 50) {
            activeParticles++;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;

            // Soft glow
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;

            if (p.shape === "rect") {
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    });

    if (activeParticles > 0) {
        confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
        canvas.style.display = "none";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiParticles = [];
    }
}

// Resize canvas on window resize
window.addEventListener("resize", () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

/* ============================================================
   INITIAL LOAD
   ============================================================ */
initTheme();
displayMemories();