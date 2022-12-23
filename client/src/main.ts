import init, { Grid, Snake } from "rust-snake"

type Coordinates = {
    x: number
    y: number
}

const CELL_SIZE = 50;
const SNAKE_PADDING = 0.05;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

init().then(() => {
    const grid = Grid.new(9, 9);
    const snake = Snake.new(grid);

    canvas.width = CELL_SIZE * grid.get_width();
    canvas.height = CELL_SIZE * grid.get_height();

    drawGrid(grid);
    drawSnake(snake);

    play(snake, grid);
})

const drawGrid = (grid: Grid) => {
    if (!ctx) {
        console.error('Can\'t find canvas');
        return
    }

    debugger
    const canvasWidth = canvas.width,
        canvasHeight = canvas.height,
        countOfColumns = grid.get_width(),
        countOfRows = grid.get_height();

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

const play = (snake: Snake, grid: Grid) => {
    document.addEventListener('keydown', e => {
        if (e.shiftKey && e.code === 'KeyX') {
            snake.move_snake();

            ctx?.clearRect(0, 0, canvas.width, canvas.height)
            drawSnake(snake);
            drawGrid(grid);
        } else if (e.code === 'KeyC') {
            console.log(snake.get_head_coordinates());
        }
    })
}