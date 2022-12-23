import init, { Grid } from "rust-snake"

const CELL_SIZE = 50;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

init().then(() => {
    const grid = Grid.new(8, 9);

    canvas.width = CELL_SIZE * grid.getWidth();
    canvas.height = CELL_SIZE * grid.getHeight();

    drawGrid(grid);
})

const drawGrid = (grid: Grid) => {
    if (!ctx) {
        console.error('Can\'t find canvas');
        return
    }

    const canvasWidth = canvas.width,
        canvasHeight = canvas.height,
        countOfColumns = grid.getWidth(),
        countOfRows = grid.getHeight();


    ctx.beginPath();

    for (let x = 0; x < countOfColumns; x++) {
        ctx.moveTo(CELL_SIZE * x, 0);
        ctx.lineTo(CELL_SIZE * x, canvasWidth);
    }

    for (let y = 0; y < countOfRows; y++) {
        ctx.moveTo(0, CELL_SIZE * y);
        ctx.lineTo(canvasHeight, CELL_SIZE * y);
    }

    ctx.stroke();
}