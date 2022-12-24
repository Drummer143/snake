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
    const snakeCoordinates = world.get_snake_coordinates();
    console.log(snakeCoordinates);
    snakeCoordinates.forEach(d => console.log(d));

    canvas.width = CELL_SIZE * world.get_width;
    canvas.height = CELL_SIZE * world.get_height;

    drawGrid(world);

    play(world);
})

const drawGrid = (world: World) => {
    if (!ctx) {
        console.error('Can\'t find canvas');
        return
    }

    const canvasWidth = canvas.width,
        canvasHeight = canvas.height,
        countOfColumns = world.get_width,
        countOfRows = world.get_height;

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

const drawSnake = (snake: Snake) => {
    const head = convertStringCoordsToArray(snake.get_head_coordinates());

    drawHead(head);
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

const convertStringCoordsToArray = (stringCoords: string): Coordinates => {
    const [x, y] = stringCoords.split(' ').map(coord => +coord);

    return { x, y };
}

const play = (world: World) => {
    document.addEventListener('keydown', e => {
        if (e.shiftKey && e.code === 'KeyX') {

            ctx?.clearRect(0, 0, canvas.width, canvas.height)
            drawGrid(world);
        } else if (e.code === 'KeyC') {
        }
    })
}