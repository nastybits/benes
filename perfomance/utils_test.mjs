import * as utils from "./utils.mjs"


const a = new Promise((resolve, reject) => {
        setTimeout(() => { reject("Error") }, 500)
    })

async function test() {
    const z = await a.then(response => response).catch(e => console.log(e))

    console.log(z)
    return z
}

test()