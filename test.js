const PromiseA = require("./index")

let p = new PromiseA((resolve, reject) => {
  setTimeout(() => {
    resolve("hello")
  }, 500)
})

// p.then(res => {
//   console.log(res, "111")
//   return 1
// }, err => {
//   console.log('gg')
// }).then(res => {
//   console.log(res, "222")
// }).then(res => {
//   console.log("baga")
// })
// p.then(1).then(res => {console.log("gg", res)})

let pp = PromiseA.resolve(1)

pp.then(res => {
  pp.then(res => {
    console.log(2)
  })
  console.log(1)
})