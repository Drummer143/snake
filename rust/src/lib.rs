use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

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
    orientation: Orientation,
}

#[wasm_bindgen]
impl Snake {
    pub fn new(worldWidth: usize, worldHeight: usize) -> Snake {
        Snake {
            max_size: worldHeight * worldWidth,
            cells: vec![SnakeCell {
                x: (worldWidth / 2) as isize,
                y: (worldHeight / 2) as isize,
            }],
            orientation: Orientation { x: 0, y: 1 },
        }
    }

    pub fn check_size(&self) -> bool {
        return self.max_size > self.cells.len();
    }

    pub fn check_collision_with_self(&self) -> bool {
        let mut is_collision = false;

        for i in 1..self.cells.len() {
            if self.cells[i].x == self.cells[0].x && self.cells[i].y == self.cells[0].y {
                is_collision = true;
                break;
            }
        }

        is_collision
    }

    #[wasm_bindgen(getter)]
    pub fn head_coordinates(&self) -> JsValue {
        let head = &self.cells[0];

        JsValue::from(SnakeCell {
            x: head.x,
            y: head.y,
        })
    }

    #[wasm_bindgen(getter)]
    pub fn orientation(&self) -> JsValue {
        let orientation = &self.orientation;

        JsValue::from(Orientation {
            x: orientation.x,
            y: orientation.y,
        })
    }

    pub fn move_snake(&mut self) {
        let orientation = &self.orientation;

        for i in 0..self.cells.len() {
            self.cells[i].x += 1 * orientation.x;
            self.cells[i].y -= 1 * orientation.y;
        }
    }
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    height: usize,
    snake: Snake,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, height: usize) -> World {
        let snake = Snake::new(width, height);

        World {
            width,
            height,
            snake,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn width(&self) -> usize {
        return self.width;
    }

    #[wasm_bindgen(getter)]
    pub fn height(&self) -> usize {
        return self.height;
    }

    #[wasm_bindgen(getter)]
    pub fn snake_x_coordinates(&self) -> js_sys::Int32Array {
        let a = self
            .snake
            .cells
            .iter()
            .map(|cell| cell.x as i32)
            .collect::<Vec<i32>>();

        js_sys::Int32Array::from(&a[..])
    }

    #[wasm_bindgen(getter)]
    pub fn snake_y_coordinates(&self) -> js_sys::Int32Array {
        let a = self
            .snake
            .cells
            .iter()
            .map(|cell| cell.y as i32)
            .collect::<Vec<i32>>();

        js_sys::Int32Array::from(&a[..])
    }
}
