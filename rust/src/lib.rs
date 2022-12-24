use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct SnakeCell {
    pub x: isize,
    pub y: isize,
}

#[wasm_bindgen]
pub struct Rotation {
    pub x: isize,
    pub y: isize,
}

#[wasm_bindgen]
pub struct Snake {
    max_size: usize,
    cells: Vec<SnakeCell>,
    rotation: Rotation,
}

#[wasm_bindgen]
impl Snake {
    pub fn new(world_width: usize, world_height: usize) -> Snake {
        Snake {
            max_size: world_height * world_width,
            cells: vec![SnakeCell {
                x: (world_width / 2) as isize,
                y: (world_height / 2) as isize,
            }],
            rotation: Rotation { x: 0, y: 1 },
        }
    }

    pub fn check_size(&self) -> bool {
        self.max_size > self.cells.len()
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

    pub fn crawl(&mut self) {
        for i in (1..self.cells.len()).rev() {
            self.cells[i].x = self.cells[i - 1].x;
            self.cells[i].y = self.cells[i - 1].y;
        }

        self.cells[0].x += 1 * self.rotation.x;
        self.cells[0].y -= 1 * self.rotation.y;
    }

    pub fn rotate(&mut self, rotation: String) {
        match &rotation[..] {
            "left" => {
                if self.rotation.x == 0 {
                    self.rotation.x = -1;
                    self.rotation.y = 0;
                }
            }
            "right" => {
                if self.rotation.x == 0 {
                    self.rotation.x = 1;
                    self.rotation.y = 0;
                }
            }
            "up" => {
                if self.rotation.y == 0 {
                    self.rotation.x = 0;
                    self.rotation.y = 1;
                }
            }
            "down" => {
                if self.rotation.y == 0 {
                    self.rotation.x = 0;
                    self.rotation.y = -1;
                }
            }
            _ => {}
        }
    }

    pub fn eat_food(&mut self) {
        let last_cell = self.cells.last().unwrap();

        self.cells.push(SnakeCell {
            x: last_cell.x + &self.rotation.x,
            y: last_cell.y + &self.rotation.y,
        });
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
    pub fn rotation(&self) -> JsValue {
        let rotation = &self.rotation;

        JsValue::from(Rotation {
            x: rotation.x,
            y: rotation.y,
        })
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

    pub fn move_snake(&mut self) {
        self.snake.crawl();
    }

    pub fn rotate_snake(&mut self, rotation: String) {
        self.snake.rotate(rotation);
    }

    pub fn eat(&mut self) {
        self.snake.eat_food();
    }

    #[wasm_bindgen(getter)]
    pub fn width(&self) -> usize {
        self.width
    }

    #[wasm_bindgen(getter)]
    pub fn height(&self) -> usize {
        self.height
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

    #[wasm_bindgen(getter)]
    pub fn snake_rotation(&self) -> JsValue {
        self.snake.rotation()
    }

    #[wasm_bindgen(getter)]
    pub fn snake_rotation_text_type(&self) -> String {
        let mut rotation_text = "left";
        let rotation = &self.snake.rotation;

        if rotation.x == 0 {
            if rotation.y == 1 {
                rotation_text = "up";
            } else {
                rotation_text = "down";
            }
        } else if rotation.x == 1 {
            rotation_text = "right"
        }

        format!("{}", rotation_text)
    }
}
