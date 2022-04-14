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

const doWork = async(req, res) => {
    // throw new Error('Invalid')
    // return 'Shivam'

    const sum = await add(1, -2)
    const sum2 = await add(sum, 2)
    const sum3 = await add(sum2, 2)
    return sum3
}

doWork().then((result) => {
    console.log(result)
}).catch((error) => {
    console.error('Error', error)
})