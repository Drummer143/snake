async function init() {
    const res = await fetch('sum.wasm')
    const buffer = await res.arrayBuffer();
    const wasm = await WebAssembly.instantiate(buffer);

    const sum = wasm.instance.exports.sum;

    const result = sum(20, 12);

    console.log(result);
}

init();