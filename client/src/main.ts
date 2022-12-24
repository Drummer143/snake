import init, { World, Snake } from "rust-snake"

type Coordinates = {
    x: number
    y: number
}

const CELL_SIZE = 50;
const SNAKE_PADDING = 0.05;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

init().then(() => {
    const world = World.new(9, 9);
    const snakeCoordinates: Coordinates[] = mapSnakeCoordinates(world);

        console.log(snakeCoordinates);

    canvas.width = CELL_SIZE * world.width;
    canvas.height = CELL_SIZE * world.height;

    drawGrid(world);
    drawSnake(snakeCoordinates);

    play(world, snakeCoordinates);
})

const drawGrid = (world: World) => {
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

    ctx.moveTo((x + SNAKE_PADDING) * CELL_SIZE, (y + 1) * CELL_SIZE);
    ctx.lineTo((x + SNAKE_PADDING) * CELL_SIZE, (y + 0.5 + SNAKE_PADDING) * CELL_SIZE)
    ctx.lineTo((x + 0.5) * CELL_SIZE, (y + SNAKE_PADDING * 2) * CELL_SIZE)
    ctx.lineTo((x + 1 - SNAKE_PADDING) * CELL_SIZE, (y + 0.5 + SNAKE_PADDING) * CELL_SIZE)
    ctx.lineTo((x + 1 - SNAKE_PADDING) * CELL_SIZE, (y + 1) * CELL_SIZE)

    ctx.stroke();
    ctx.fill();
}

const play = (world: World, snakeCoordinates: Coordinates[]) => {
    document.addEventListener('keydown', e => {
        if (e.shiftKey && e.code === 'KeyX') {
            world.move_snake();

            console.log(world.snake_x_coordinates[0], world.snake_y_coordinates[0])
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            drawSnake(mapSnakeCoordinates(world));
            drawGrid(world);
        } else if (e.code === 'KeyC') {
        }
    })
}

const mapSnakeCoordinates = (world: World): Coordinates[] => {
    return Array.from(world.snake_x_coordinates).map((x, i) => ({
        x,
        y: world.snake_y_coordinates[i]
    }));
}