import { startGame } from "./main.js";

const introVideo = document.getElementById("introVideo");
const soundButton = document.getElementById("soundButton");
const skipButton = document.getElementById("skipButton");

// Evento para activar el sonido
soundButton.addEventListener("click", () => {
    introVideo.muted = false; // Quita el silencio
    introVideo.volume = 1.0; // Configura el volumen
    soundButton.style.display = "none"; // Oculta el botón de activar sonido
});

// Evento para omitir el video
skipButton.addEventListener("click", () => {
    introVideo.pause(); // Detén el video
    document.getElementById("intro").style.display = "none"; // Oculta la introducción
    document.getElementById("menu").style.display = "block"; // Muestra el menú principal
    startGame(); // Inicia el juego
});

// Evento al finalizar el video
introVideo.addEventListener("ended", () => {
    document.getElementById("intro").style.display = "none"; // Oculta la introducción
    document.getElementById("menu").style.display = "block"; // Muestra el menú principal
    startGame(); // Inicia el juego
});
