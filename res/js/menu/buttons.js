import { Sprite } from "../sprite.js";
import { canvas, ctx, setContinueAnimation, setEndGame, setMenuActive } from "../helpers.js";
import { drawMenu, resetProgress, unlockAllDiamonds } from "./menus.js";

//check collision for button in menu
function checkButtonCollision(pos, button) {
    return (
        pos.x > button.position.x &&
        pos.x < button.position.x + button.width &&
        pos.y < button.position.y + button.height &&
        pos.y > button.position.y
    );
}

const TEXT_GAP = {
    3: 70,
    4: 42,
    5: 40,
    6: 10,
    7: 30,
    8: 30,
    10: 20,
    11: 20,
    14: 20,
};

class MenuButton {
    constructor({
        position,
        width,
        height,
        yOffset,
        text,
        runCode,
        outerColor = "#929292",
        borderColor = "black",
        mainColor = "#848484",
        fontSize = 75,
    }) {
        this.position = position;

        this.width = width;
        this.height = height;
        this.yOffset = yOffset;
        this.text = text;
        this.fontSize = fontSize;
        this.runCode = runCode;
        this.originalValues = {
            position: {
                x: position.x,
                y: position.y,
            },
            width,
            height,
            text,
            fontSize,
        };

        this.outerColor = outerColor;
        this.borderColor = borderColor;
        this.mainColor = mainColor;

        this.pressed = false;

        this.textGap = TEXT_GAP[this.text.length];
    }
    draw() {
        ctx.fillStyle = this.borderColor;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillStyle = this.mainColor;
        ctx.fillRect(this.position.x + 2, this.position.y + 2, this.width - 4, this.height - 4);

        ctx.font = `${this.fontSize}px Cinzel`;
        ctx.lineWidth = 7;
        ctx.strokeStyle = "black";
        ctx.strokeText(this.text, this.position.x + this.textGap, this.position.y + this.fontSize);

        ctx.font = `${this.fontSize}px Cinzel`;
        ctx.fillStyle = "yellow";
        ctx.fillText(this.text, this.position.x + this.textGap, this.position.y + this.fontSize);
    }
    scaleDown() {
        ctx.fillStyle = this.outerColor;
        ctx.fillRect(this.position.x - 1, this.position.y - 1, this.width + 2, this.height + 2);
        this.position.x += 1;
        this.position.y += 1;
        this.width -= 2;
        this.height -= 2;
        this.fontSize -= 1;
    }
    resetSize() {
        this.position.x = this.originalValues.position.x;
        this.position.y = this.originalValues.position.y;
        this.width = this.originalValues.width;
        this.height = this.originalValues.height;
        this.fontSize = this.originalValues.fontSize;
    }
    run() {
        this.runCode();
    }
    updatePositionY(pos) {
        this.position.y = pos + this.yOffset;
    }
}

const pauseButton = new Sprite({
    position: {
        x: canvas.width - 3 * 36,
        y: 0,
    },
    imgSrc: "./res/img/pause_img.png",
});

const unlockAllDiamondsButton = new MenuButton({
    position: {
        x: canvas.width - 520,
        y: canvas.height * 0.88,
    },
    width: 500,
    height: canvas.height * 0.1,
    yOffset: canvas.height * 0.43,
    text: "LiberarTodo",
    mainColor: "#5c4614",
    borderColor: "#5c4614",
    outerColor: "#5c4614",
    runCode: () => {
        unlockAllDiamonds();
        delete menuButtons.mainMenu.unlock;
        drawMenu();
    },
});

function getSavedTimes() {
    const savedTimes = localStorage.getItem('completedLevelsTimes');
    return savedTimes ? savedTimes.split(',') : [];
}

function drawSavedTimesMenu() {
    ctx.fillStyle = "#5c4614";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let fullText = "Tiempos Guardados";
    ctx.font = "70px Cinzel";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "black";
    ctx.strokeText(fullText, canvas.width * 0.23, canvas.height * 0.1);

    ctx.fillStyle = "#9313fd";
    ctx.fillText(fullText, canvas.width * 0.23, canvas.height * 0.1);

    const savedTimes = getSavedTimes();
    
    if (savedTimes.length > 0) {
        let yPosition = canvas.height * 0.2; // Iniciar en una posición vertical

        savedTimes.forEach((time, index) => {
            ctx.font = "30px Cinzel";
            ctx.lineWidth = 7;
            ctx.strokeStyle = "black";
            ctx.strokeText(`${time}`, canvas.width * 0.25, yPosition);

            ctx.fillStyle = "yellow";
            ctx.fillText(`${time}`, canvas.width * 0.25, yPosition);

            yPosition += 40; // Ajustar espacio entre los tiempos
        });
    } else {
        ctx.font = "30px Cinzel";
        ctx.lineWidth = 7;
        ctx.strokeStyle = "black";
        ctx.strokeText("No hay tiempos guardados", canvas.width * 0.25, canvas.height * 0.3);

        ctx.fillStyle = "yellow";
        ctx.fillText("No hay tiempos guardados", canvas.width * 0.25, canvas.height * 0.3);
    }

    // Botón para regresar al menú principal
    // Definir un botón de menú con una propiedad para "eliminarse"
    const backButton = new MenuButton({
        position: {
            x: canvas.width * 0.1,
            y: canvas.height * 0.1,
        },
        width: 200,
        height: 50,
        text: "Volver",
        fontSize: 30,
        // Propiedad para indicar si el botón está activo o no
        isActive: true,  
        runCode: () => {
            drawMenu(); // Volver al menú principal
            backButton.isActive = false; // Desactivar el botón (eliminado)
            menuButtons.mainMenu.backButton.isActive = false;
        }
    });

    menuButtons.mainMenu.backButton = backButton;
    
    backButton.draw();
}

const newButtonPositionY = canvas.height * 0.93 - 100;

const newButton = new MenuButton({
    position: {
        x: canvas.width * 0.1, // Ajusta la posición X del botón
        y: canvas.height * 0.50, // Ajusta la posición Y del botón
    },
    width: 400, // Ancho del botón
    height: canvas.height * 0.08, // Altura del botón
    yOffset: canvas.height * 0.43,
    text: "MejoresTiempos", // Texto en el botón
    fontSize: 40, // Tamaño de la fuente
    runCode: () => {
        drawSavedTimesMenu();
        console.log("¡Nuevo botón presionado!"); // Acción del botón
    },
});

let menuButtons = {
    lost: {
        menu: new MenuButton({
            position: {
                x: canvas.width * 0.1 + (canvas.width * 0.8 - 2 * 300 - 125) / 2,
                y: canvas.height * 0.6,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.4,
            text: "menu",
            runCode: () => {
                setMenuActive("mainMenu");
                drawMenu();
            },
        }),

        retry: new MenuButton({
            position: {
                x: canvas.width * 0.1 + (canvas.width * 0.8 - 2 * 300 - 125) / 2 + 425,
                y: canvas.height * 0.6,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.4,
            text: "retry",
            runCode: () => {
                setEndGame(true);
            },
        }),
    },

    paused: {
        end: new MenuButton({
            position: {
                x: canvas.width * 0.1 + (canvas.width * 0.8 - 2 * 300 - 125) / 2,
                y: canvas.height * 0.5,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.3,
            text: "Inicio",
            runCode: () => {
                setMenuActive("mainMenu");
                drawMenu();
            },
        }),

        retry: new MenuButton({
            position: {
                x: canvas.width * 0.1 + (canvas.width * 0.8 - 2 * 300 - 125) / 2 + 425,
                y: canvas.height * 0.5,
            },
            width: 500,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.3,
            text: "reintentar",
            runCode: () => {
                setEndGame(true);
            },
        }),

        resume: new MenuButton({
            position: {
                x: canvas.width * 0.4,
                y: canvas.height * 0.65,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.45,
            text: "Cont",
            runCode: () => {
                setContinueAnimation(true);
            },
        }),
    },

    won: {
        continue: new MenuButton({
            position: {
                x: canvas.width * 0.2 + 450 / 2,
                y: canvas.height * 0.63,
            },
            width: 450,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.43,
            text: "continue",
            runCode: () => {
                setMenuActive("mainMenu");
                drawMenu();
            },
        }),
    },
    mainMenu: {
        unlock: unlockAllDiamondsButton,
        reset: new MenuButton({
            position: {
                x: canvas.width - 430,
                y: canvas.height * 0.78,
            },
            width: 430,
            height: canvas.height * 0.065,
            yOffset: canvas.height * 0.43,
            text: "Restablecer",
            mainColor: "#5c4614",
            borderColor: "#5c4614",
            outerColor: "#5c4614",
            fontSize: 50,
            runCode: () => {
                resetProgress();
            },
        }),
        author: new MenuButton({
            position: {
                x: canvas.width * 0.06,
                y: canvas.height * 0.93,
            },
            width: 340,
            height: canvas.height * 0.06,
            yOffset: canvas.height * 0.43,
            text: "Equipo YAPP",
            mainColor: "#5c4614",
            borderColor: "#5c4614",
            outerColor: "#5c4614",
            fontSize: 50,
            runCode: () => {
                window.open("https://media.tenor.com/U4_w6MDTq_0AAAAd/yapp-rickroll.gif", "_blank");
            },
        }),
        newButton: newButton, // Nuevo botón agregado al menú
    },
};

export { pauseButton, menuButtons, checkButtonCollision, unlockAllDiamondsButton };
