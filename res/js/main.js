// main.js

import { playGame} from "./game.js";
import { loadData, loadDataFromLocalStorage } from "./helpers.js";

export async function startGame() {  // Export explícito de startGame
    loadDataFromLocalStorage();
    playGame();// Carga los datos necesarios antes de iniciar el juego
    await loadData();
}
