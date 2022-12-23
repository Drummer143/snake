import init, { Grid } from "rust-snake"

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

init().then(() => {
    const grid = Grid.new(8, 9);

    console.log(grid.getWidth(), grid.getHeight());
})