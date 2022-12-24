import init, { World } from "rust-snake"

type Coordinates = {
    x: number
    y: number
}

const CELL_SIZE = 50;
const SNAKE_PADDING = 0.05;

const canvas = document.getElementById('canvas') as HTMLCanvasElement,
    ctx = canvas.getContext('2d');

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

    switch (world.snake_rotation_text_type) {
        case 'right':
        case 'left': {
            const bottomLineShift = world.snake_rotation_text_type === 'left' ? 1 : 0,
                topPointShift = world.snake_rotation_text_type === 'right' ? 1 : 0,
                snakePaddingSign = world.snake_rotation_text_type === 'right' ? 1 : -1,

                leftPointY = (y + 1 - SNAKE_PADDING) * CELL_SIZE,
                rightPointY = (y + SNAKE_PADDING) * CELL_SIZE,
                bottomPointX = (x + bottomLineShift) * CELL_SIZE,
                middlePointX = (x + 0.5 + snakePaddingSign * SNAKE_PADDING) * CELL_SIZE,
                topPointX = (x + topPointShift - snakePaddingSign * SNAKE_PADDING * 2) * CELL_SIZE,
                topPointY = (y + 0.5) * CELL_SIZE;

            ctx.moveTo(bottomPointX, leftPointY); // bottom left point
            ctx.lineTo(middlePointX, leftPointY); // middle left
            ctx.lineTo(topPointX, topPointY); // top
            ctx.lineTo(middlePointX, rightPointY); // middle right
            ctx.lineTo(bottomPointX, rightPointY); // bottom right
            break;
        }

        case 'up':
        case 'down': {
            const bottomLineShift = world.snake_rotation_text_type === 'up' ? 1 : 0,
                topPointShift = world.snake_rotation_text_type === 'down' ? 1 : 0,
                snakePaddingSign = world.snake_rotation_text_type === 'down' ? 1 : -1,

                leftPointX = (x + SNAKE_PADDING) * CELL_SIZE,
                rightPointX = (x + 1 - SNAKE_PADDING) * CELL_SIZE,
                bottomPointY = (y + bottomLineShift) * CELL_SIZE,
                middlePointY = (y + 0.5 + snakePaddingSign * SNAKE_PADDING) * CELL_SIZE,
                topPointX = (x + 0.5) * CELL_SIZE,
                topPointY = (y + topPointShift - snakePaddingSign * SNAKE_PADDING * 2) * CELL_SIZE;

            ctx.moveTo(leftPointX, bottomPointY); // bottom left point
            ctx.lineTo(leftPointX, middlePointY); // middle left
            ctx.lineTo(topPointX, topPointY); // top
            ctx.lineTo(rightPointX, middlePointY); // middle right
            ctx.lineTo(rightPointX, bottomPointY); // bottom right
            break;
        }
    }

    ctx.fill();
    ctx.stroke();
}

const play = () => document.addEventListener('keydown', handleKeyDown);

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
