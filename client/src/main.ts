import init, { World } from "rust-snake"

type Coordinates = {
    x: number
    y: number
}

const CELL_SIZE = 50;
const SNAKE_PADDING = 0.05;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

let world: World;

init().then(() => {
    world = World.new(9, 9);
    const snakeCoordinates: Coordinates[] = mapSnakeCoordinates();

    canvas.width = CELL_SIZE * world.width;
    canvas.height = CELL_SIZE * world.height;

    drawGrid();
    drawSnake(snakeCoordinates);

    play();
})

const drawGrid = () => {
    if (!ctx) {
        console.error('Can\'t find canvas');
        return
    }

    const canvasWidth = canvas.width,
        canvasHeight = canvas.height,
        countOfColumns = world.width,
        countOfRows = world.height;

    ctx.strokeStyle = '#444'
    ctx.beginPath();

    for (let x = 0; x < countOfColumns + 1; x++) {
        ctx.moveTo(CELL_SIZE * x, 0);
        ctx.lineTo(CELL_SIZE * x, canvasHeight);
    }

    for (let y = 0; y < countOfRows + 1; y++) {
        ctx.moveTo(0, CELL_SIZE * y);
        ctx.lineTo(canvasWidth, CELL_SIZE * y);
    }

    ctx.stroke();
}

const drawSnake = (coordinates: Coordinates[]) => {
    if (coordinates.length === 0) { return };

    drawHead(coordinates[0]);
}

const drawHead = ({ x, y }: Coordinates) => {
    if (!ctx) { return; }

    ctx.fillStyle = 'green';
    ctx.beginPath();

    const { x: rotX, y: rotY } = world.snake_rotation;
    console.log(rotX, rotY, world.snake_rotation_text_type);

    switch (world.snake_rotation_text_type) {
        case 'right': {
            ctx.moveTo(x * CELL_SIZE, (y + 1 - SNAKE_PADDING) * CELL_SIZE); // нижняя левая
            ctx.lineTo((x + 0.5 - SNAKE_PADDING) * CELL_SIZE, (y + 1 - SNAKE_PADDING) * CELL_SIZE); // средняя левая
            ctx.lineTo((x + 1 - SNAKE_PADDING * 2) * CELL_SIZE, (y + 0.5) * CELL_SIZE); // верхняя
            ctx.lineTo((x + 0.5 - SNAKE_PADDING) * CELL_SIZE, (y + SNAKE_PADDING) * CELL_SIZE); // средняя правая
            ctx.lineTo(x * CELL_SIZE, (y + SNAKE_PADDING) * CELL_SIZE); // нижняя правая
            break;
        }
        case 'left': {
            ctx.moveTo((x + 1) * CELL_SIZE, (y + 1 - SNAKE_PADDING) * CELL_SIZE); // нижняя левая
            ctx.lineTo((x + 0.5 + SNAKE_PADDING) * CELL_SIZE, (y + 1 - SNAKE_PADDING) * CELL_SIZE); // средняя левая
            ctx.lineTo((x + SNAKE_PADDING * 2) * CELL_SIZE, (y + 0.5) * CELL_SIZE); // верхняя
            ctx.lineTo((x + 0.5 + SNAKE_PADDING) * CELL_SIZE, (y + SNAKE_PADDING) * CELL_SIZE); // средняя правая
            ctx.lineTo((x + 1) * CELL_SIZE, (y + SNAKE_PADDING) * CELL_SIZE); // нижняя правая
            break;
        }
        case 'up': {
            ctx.moveTo((x + SNAKE_PADDING) * CELL_SIZE, (y + 1) * CELL_SIZE); // нижняя левая
            ctx.lineTo((x + SNAKE_PADDING) * CELL_SIZE, (y + 0.5 + SNAKE_PADDING) * CELL_SIZE); // средняя левая
            ctx.lineTo((x + 0.5) * CELL_SIZE, (y + SNAKE_PADDING * 2) * CELL_SIZE); // верхняя
            ctx.lineTo((x + 1 - SNAKE_PADDING) * CELL_SIZE, (y + 0.5 + SNAKE_PADDING) * CELL_SIZE); // средняя правая
            ctx.lineTo((x + 1 - SNAKE_PADDING) * CELL_SIZE, (y + 1) * CELL_SIZE); // нижняя правая
            break;
        }
        case 'down': {
            ctx.moveTo((x + SNAKE_PADDING) * CELL_SIZE, y * CELL_SIZE); // нижняя левая
            ctx.lineTo((x + SNAKE_PADDING) * CELL_SIZE, (y + 0.5 - SNAKE_PADDING) * CELL_SIZE); // средняя левая
            ctx.lineTo((x + 0.5) * CELL_SIZE, (y + 1 - SNAKE_PADDING * 2) * CELL_SIZE); // верхняя
            ctx.lineTo((x + 1 - SNAKE_PADDING) * CELL_SIZE, (y + 0.5 - SNAKE_PADDING) * CELL_SIZE); // средняя правая
            ctx.lineTo((x + 1 - SNAKE_PADDING) * CELL_SIZE, y * CELL_SIZE); // нижняя правая
            break;
        }
    }

    ctx.fill();
    ctx.stroke();
}

const play = () => {
    document.addEventListener('keydown', handleKeyDown);
}

const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
        case 'KeyX': {
            if (e.shiftKey) {
                world.move_snake();
            }
            break;
        }
        case 'ArrowLeft': {
            world.rotate_snake('left');
            break;
        }
        case 'ArrowRight': {
            world.rotate_snake('right');
            break;
        }
        case 'ArrowUp': {
            world.rotate_snake('up');
            break;
        }
        case 'ArrowDown': {
            world.rotate_snake('down');
            break;
        }
        default: console.log(e.code);
    };

    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake(mapSnakeCoordinates());
    drawGrid();
}

const mapSnakeCoordinates = (): Coordinates[] => {
    return Array.from(world.snake_x_coordinates).map((x, i) => ({
        x,
        y: world.snake_y_coordinates[i]
    }));
}