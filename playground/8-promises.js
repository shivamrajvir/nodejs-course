const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                reject('Numbers must be greater than 0')
            }
            resolve(a + b)
                // reject('wrong')
        }, 2000)
    })
}

add.then((result) => {
    console.log(result)
}, (error) => {
    console.error(error);
});