import init, { greet } from 'rust-snake'

init().then(res => {
    greet('Миша привет из Rust');
})