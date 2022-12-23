use wasm_bindgen::prelude::*;

#[global_allocator]
static  ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn greet(message: &str) {
    alert(message);
}

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}