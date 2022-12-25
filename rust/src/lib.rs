use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Rotation {
    pub x: isize,
    pub y: isize,
}

#[wasm_bindgen]
pub struct Coordinates {
    pub x: isize,
    pub y: isize,
}

#[wasm_bindgen]
pub struct SnakeCell {
    pub x: isize,
    pub y: isize,
    rotation: Rotation,
}

impl SnakeCell {
    fn get_rotation(&self) -> &Rotation {
        &self.rotation
    }

    fn set_rotation(&mut self, rot_x: isize, rot_y: isize) {
        self.rotation.x = rot_x;
        self.rotation.y = rot_y;
    }

    fn set_coordinates(&mut self, x: isize, y: isize) {
        self.x = x;
        self.y = y;
    }
}

#[wasm_bindgen]
pub struct Snake {
    max_size: usize,
    cells: Vec<SnakeCell>,
    // rotation: Rotation,
}


impl Snake {
    fn get_head_rotation(&self) -> &Rotation {
        &self.cells.first().unwrap().get_rotation()
    }
}

#[wasm_bindgen]
impl Snake {
    pub fn new(world_width: usize, world_height: usize) -> Snake {
        Snake {
            max_size: world_height * world_width,
            cells: vec![SnakeCell {
                x: (world_width / 2) as isize,
                y: (world_height / 2) as isize,
                rotation: Rotation { x: 0, y: 1 },
            }],
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

        let head_rotation = self.get_head_rotation();
        let x = self.cells.first().unwrap().x + 1 * head_rotation.x;
        let y = self.cells.first().unwrap().y - 1 * head_rotation.y;
        self.cells.first_mut().unwrap().set_coordinates(x, y);
    }

    pub fn rotate(&mut self, rotation: String) {
        let head = self.cells.first_mut().unwrap();
        let head_rotation = head.get_rotation();

        match &rotation[..] {
            "left" => {
                if head_rotation.x == 0 {
                    head.set_rotation(-1, 0);
                }
            }
            "right" => {
                if head_rotation.x == 0 {
                    head.set_rotation(1, 0);
                }
            }
            "up" => {
                if head_rotation.y == 0 {
                    head.set_rotation(0, 1);
                }
            }
            "down" => {
                if head_rotation.y == 0 {
                    head.set_rotation(0, -1);
                }
            }
            _ => {}
        }
    }

    pub fn eat_food(&mut self) {
        let last_cell = self.cells.last().unwrap();

        self.cells.push(SnakeCell {
            x: last_cell.x + last_cell.rotation.x,
            y: last_cell.y + last_cell.rotation.y,
            rotation: Rotation { x: last_cell.rotation.x, y: last_cell.rotation.y }
        });
    }

    #[wasm_bindgen(getter)]
    pub fn head_coordinates(&self) -> JsValue {
        let head = &self.cells[0];

        JsValue::from(Coordinates {
            x: head.x,
            y: head.y,
        })
    }

    #[wasm_bindgen(getter)]
    pub fn rotation(&self) -> JsValue {
        let rotation = &self.cells.first().unwrap().rotation;

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
        let rotation = &self.snake.cells.first().unwrap().rotation;

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
