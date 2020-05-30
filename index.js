const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class Promise {
  constructor(excutor) {
    this.data = undefined
    this.list = []
    this.status = PENDING
    try {
      excutor(this.resolve.bind(this), this.reject.bind(this))
    } catch (err) {
      this.reject(err)
    }
  }

  resolve(value) {
    if(this.status !== PENDING) return
    this.data = value
    this.status = FULFILLED
    if(this.list.length > 0) {
      setTimeout(() => {
        this.list.forEach(item => {
          item.onFulfilled(this.data)
        })
      })
    }
  }

  reject(value) {
    if (this.status !== PENDING) return
    this.data = value
    this.status = REJECTED
    if (this.list.length > 0) {
      setTimeout(() => {
        this.list.forEach(item => {
          item.onRejected(this.data)
        })
      })
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason}

    return new Promise((resolve, reject) => {

      const handle = (callback) => {
        try {
          const result = callback(this.data)

          if(result instanceof Promise) {
            result.then(value => {
              resolve(value)
            }, reason => {
              reject(reason)
            })
          } else {
            resolve(result)
          }
        } catch(err) {
          reject(err)
        }
      }

      if(this.status === PENDING) {
        this.list.push({
          onFulfilled(value) {
            handle(onFulfilled)
          },
          onRejected(reason) {
            handle(onRejected)
          }
        })
      } else if(this.status === FULFILLED) {
        setTimeout(() => {
          handle(onFulfilled)
        })
      } else {
        setTimeout(() => {
          handle(onRejected)
        })
      }
    })
  }
}

new Promise((resolve, reject) => {
  resolve(5)
}).then(value => {
  console.log(value)
  return 9
}).then(value => {
  console.log(value)
})