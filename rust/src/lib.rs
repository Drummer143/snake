use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Grid {
    width: usize,
    height: usize,
}

#[wasm_bindgen]
impl Grid {
    pub fn new(width: usize, height: usize) -> Grid {
        Grid { width, height }
    }

    pub fn get_width(&self) -> usize {
        return self.width;
    }

    pub fn get_height(&self) -> usize {
        return self.height;
    }
}

#[wasm_bindgen]
pub struct SnakeCell {
    pub x: isize,
    pub y: isize,
}

#[wasm_bindgen]
pub struct Orientation {
    pub x: isize,
    pub y: isize,
}

#[wasm_bindgen]
pub struct Snake {
    max_size: usize,
    cells: Vec<SnakeCell>,
    grid: Grid,
    orientation: Orientation,
}

#[wasm_bindgen]
impl Snake {
    pub fn new(grid: Grid) -> Snake {
        let rows = grid.get_height();
        let columns = grid.get_width();

        Snake {
            grid,
            max_size: rows * columns,
            cells: vec![SnakeCell {
                x: (columns / 2) as isize,
                y: (rows / 2) as isize,
            }],
            orientation: Orientation { x: 0, y: 1 },
        }
    }

    pub fn check_size(&self) -> bool {
        return self.max_size > self.cells.len();
    }

    pub fn check_collision_with_walls(&self) -> bool {
        return self.cells[0].x < 0
            || self.cells[0].x > self.grid.get_width() as isize
            || self.cells[0].y < 0
            || self.cells[0].y > self.grid.get_height() as isize;
    }

    pub fn check_collision_with_self(&self) -> bool {
        let mut is_collision = false;

        for i in 1..self.cells.len() {
            if self.cells[i].x == self.cells[0].x && self.cells[i].y == self.cells[0].y {
                is_collision = true;
                break;
            }
        }

        return is_collision;
    }

    pub fn get_head_coordinates(&self) -> String {
        let head = &self.cells[0];

        return format!("{} {}", head.x, head.y);
    }

    pub fn get_orientation(&self) -> String {
        let orientation = &self.orientation;

        return format!("{} {}", orientation.x, orientation.y);
    }

    pub fn move_snake(&mut self) {
        let orientation = &self.orientation;

        for i in 0..self.cells.len() {
            self.cells[i].x += orientation.x;
            self.cells[i].y -= orientation.y;
        }
    }

    // pub fn lol() -> String {
    //     return format!("test");
    // }
}
