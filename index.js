const PENDING = 1
const FULLFILLED = 2
const REJECTED = 3

function isFunction (fn) {
  return typeof fn === "function"
}

function PromiseA (fn) {
  let self = this
  self.state = PENDING
  self.onFullFilled = []
  self.onRejected = []
  function resolve (res) {
    setTimeout(() => {
      if (self.state === PENDING) {
        self.state = FULLFILLED
        self.result = res
      }
      self.onFullFilled.forEach(function(cb) {
        cb(res)
      })
    })
  }

  function reject (err) {
    setTimeout(() => {
      if (self.state === PENDING) {
        self.state = REJECTED
        self.result = err
      }
      self.onRejected.forEach(function(cb) {
        cb(err)
      })
    })
  }
  fn(resolve, reject)

  return self
}

PromiseA.resolve = function (res) {
  return new PromiseA(function (resolve) {
    resolve(res)
  })
}

PromiseA.reject = function (err) {
  return new PromiseA(function (resolve, reject) {
    reject(err)
  })
}

PromiseA.prototype.then = function (onFullFilled, onRejected) {
  let self = this
  isFunction(onRejected) && (self.onRejected.push(onRejected))
  let next = new PromiseA(function (resolve, reject) {
    switch(self.state) {
      case PENDING:
        if (isFunction(onFullFilled)) {
          self.onFullFilled.push(function (res) {
            let result
            try {
              result = onFullFilled(res)
            } catch (err) {
              reject(err)
            }
            resolve(result)
          })
        } else {
          self.onFullFilled.push(function (res) {
            resolve(res)
          })
        }
        break
      case FULLFILLED:
        console.log("gg")
        resolve(self.result)
        break
      case REJECTED:
        console.log("gg")
        reject(self.result)
        break
    }
  })
  return next
}

PromiseA.prototype.catch = function (fn) {
  let self = this
  self.onRejected.push(fn)
}

PromiseA.defer = PromiseA.deferred = function () {
  let dfd = {};
  dfd.promise = new PromiseA((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = PromiseA