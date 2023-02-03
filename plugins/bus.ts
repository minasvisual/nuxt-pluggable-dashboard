import  _ from 'lodash'

export default defineNuxtPlugin((nuxtApp) => {
  
  const bus = new Map()
 
  return {
    provide:{
      'bus': {
        listen: (topic, cb) => {
          // console.log("subscribe ", topic) 
            if (bus.has(topic)) {
                return bus.set(topic, [ ...bus, cb ])
            }
            return bus.set(topic, [ cb ]) 
        },
        emit: (topic, data) => {
          // console.log("publiss ", topic, bus) 
            const myListeners = bus.get(topic)
            if (Array.isArray(myListeners) && myListeners.length) {
                myListeners.forEach(event => event(data))
            }
            return bus 
        }
      }
    }
  }

})