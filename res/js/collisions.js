import { Sprite } from "./sprite.js";
import * as Blocks from "./collisionBlocks.js";
import { GAME_SIZE, ctx } from "./helpers.js";

class CollisionBlock {
    constructor({ position, shape, direction, element, imgSrc }) {
        this.position = position;
        this.shape = shape;
        this.direction = direction;
        this.element = element;
        this.width = 36;
        this.height = 36;
        this.imgSrc = imgSrc;

        // Carga la imagen una sola vez (Solo si se proporciona un imgSrc)
        if (imgSrc) {
            this.img = new Image();
            this.img.src = imgSrc;
        }

        this.hitbox = {
            position,
            width: this.width,
            height: this.height,
        };
    }

    draw() {
        if (this.shape === "square") {
            ctx.fillStyle = "rgba(255,0,0,0.5)";
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        } else if (this.shape === "triangle") {
            ctx.fillStyle = "rgba(255, 251, 0, 0.575)";
            if (this.direction.x === "right" && this.direction.y === "up") {
                ctx.beginPath();
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.position.x, this.position.y + this.height);
                ctx.lineTo(this.position.x + this.width, this.position.y + this.height);
                ctx.fill();
            } else if (this.direction.x === "left" && this.direction.y === "up") {
                ctx.beginPath();
                ctx.moveTo(this.position.x + this.width, this.position.y);
                ctx.lineTo(this.position.x, this.position.y + this.height);
                ctx.lineTo(this.position.x + this.width, this.position.y + this.height);
                ctx.fill();
            } else if (this.direction.x === "left" && this.direction.y === "down") {
                ctx.beginPath();
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.position.x + this.width, this.position.y);
                ctx.lineTo(this.position.x + this.width, this.position.y + this.height);
                ctx.fill();
            } else if (this.direction.x === "right" && this.direction.y === "down") {
                ctx.beginPath();
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.position.x + this.width, this.position.y);
                ctx.lineTo(this.position.x, this.position.y + this.height);
                ctx.fill();
            }
        } else if (this.shape === "pond") {
            ctx.fillStyle = "rgba(255, 0, 242, 0.575)";
            ctx.fillRect(this.position.x, this.position.y + 18, this.width, this.height - 18);
        } else if (this.shape === "pondTriangle") {
            ctx.fillStyle = "rgba(255, 0, 242, 0.575)";
            if (this.direction.x === "left") {
                ctx.beginPath();
                ctx.moveTo(this.position.x + this.width, this.position.y);
                ctx.lineTo(this.position.x + this.width, this.position.y + this.height);
                ctx.lineTo(this.position.x, this.position.y + this.height);
                ctx.lineTo(this.position.x, this.position.y + this.height / 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.position.x, this.position.y + this.height);
                ctx.lineTo(this.position.x + this.width, this.position.y + this.height);
                ctx.lineTo(this.position.x + this.width, this.position.y + this.height / 2);
                ctx.fill();
            }
        } else if (this.shape === "acidPond") {
            // Dibuja la imagen cargada previamente
            if (this.img) {
                ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
            } else {
                console.error('Error: Image not loaded for acidPond');
            }
        }
    }
}

export function createObjectsFromArray(array) {
    const objects = [];
    const ponds = [];

    for (let i = 0; i < array.length; i++) {
        let shape;
        let direction = {
            x: null,
            y: null,
        };
        let element = null;
        let flipImage = false;
        let currentRow;

        switch (array[i]) {
            case Blocks.BLOCK:
                shape = "square";
                break;
            case Blocks.TRIANGLE_LEFT_UP:
                shape = "triangle";
                direction = { x: "left", y: "up" };
                break;
            case Blocks.TRIANGLE_RIGHT_UP:
                shape = "triangle";
                direction = { x: "right", y: "up" };
                break;
            case Blocks.TRIANGLE_LEFT_DOWN:
                shape = "triangle";
                direction = { x: "left", y: "down" };
                break;
            case Blocks.TRIANGLE_RIGHT_DOWN:
                shape = "triangle";
                direction = { x: "right", y: "down" };
                break;
            case Blocks.WATER_POND:
            case Blocks.FIRE_POND:
            case Blocks.ACID_POND:
                shape = "pond";
                break;
            case Blocks.WATER_POND_TRIANGLE_RIGHT:
            case Blocks.FIRE_POND_TRIANGLE_RIGHT:
            case Blocks.ACID_POND_TRIANGLE_RIGHT:
                shape = "pondTriangle";
                direction = { x: "right", y: "up" };
                break;
            case Blocks.WATER_POND_TRIANGLE_LEFT:
            case Blocks.FIRE_POND_TRIANGLE_LEFT:
            case Blocks.ACID_POND_TRIANGLE_LEFT:
                shape = "pondTriangle";
                direction = { x: "left", y: "up" };
                flipImage = true;
                break;
        }

        switch (array[i]) {
            case Blocks.FIRE_POND:
                element = "fire";
                currentRow = 3;
                break;
            case Blocks.FIRE_POND_TRIANGLE_LEFT:
            case Blocks.FIRE_POND_TRIANGLE_RIGHT:
                element = "fire";
                currentRow = 4;
                break;
            case Blocks.WATER_POND:
                currentRow = 1;
                element = "water";
                break;
            case Blocks.WATER_POND_TRIANGLE_LEFT:
            case Blocks.WATER_POND_TRIANGLE_RIGHT:
                element = "water";
                currentRow = 2;
                break;
            case Blocks.ACID_POND:
                element = "acid";
                currentRow = 5;
                break;
            case Blocks.ACID_POND_TRIANGLE_LEFT:
            case Blocks.ACID_POND_TRIANGLE_RIGHT:
                element = "acid";
                currentRow = 6;
                break;
        }

        let newPosition = {
            x: (i % GAME_SIZE.width) * GAME_SIZE.block.width,
            y: Math.floor(i / GAME_SIZE.width) * GAME_SIZE.block.height,
        };

        // Si el bloque es un pond (incluido el ACID_POND), se coloca una imagen estática en lugar de animación
        if (array[i] === Blocks.ACID_POND || array[i] === Blocks.ACID_POND_TRIANGLE_LEFT || array[i] === Blocks.ACID_POND_TRIANGLE_RIGHT) {
            ponds.push(
                new CollisionBlock({
                    position: newPosition,
                    shape: "acidPond", // Identificador para los bloques ACID_POND
                    element: element,
                    imgSrc: './res/img/alcantarilla.png', // Usando la imagen estática para los pond
                })
            );
        } else if (array[i] >= Blocks.FIRE_POND_START_INDEX) {
            ponds.push(
                new Sprite({
                    position: newPosition,
                    imgSrc: './res/img/ponds.png', // Se usa la imagen para la animación de otros ponds
                    frameRate: 9,
                    imgRows: 6,
                    currentRow: currentRow,
                    flipImage: flipImage,
                })
            );
        }

        if (array[i] !== Blocks.EMPTY) {
            objects.push(
                new CollisionBlock({
                    position: newPosition,
                    shape: shape,
                    direction: direction,
                    element: element,
                    imgSrc: './res/img/alcantarilla.png', // Definimos una imagen por defecto
                })
            );
        }
    }

    return {
        objects,
        ponds,
    };
}
