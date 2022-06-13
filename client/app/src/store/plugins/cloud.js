import { SOCKET_HOST } from '@/config'




// when reconnecting socket the return stuff is already sent and is using old socket
// maybe move return inside the startWebSocket function, prob wont work
// or move startwebsocket into the return and the socket onmessage & subscribe into the startWebSocket
export default function createWebSocketPlugin() {

  return store => {
    // socket responses
    const startWebSocket = () => {
      let socket = new WebSocket(SOCKET_HOST);
      let socketOpen = false
      socket.addEventListener('open', () => {
        socketOpen = true
      })
  
      socket.addEventListener('close', () => {
        socketOpen = false
        // retry connection
        startWebSocket()
      })


      socket.onmessage = (event) => {
        store.dispatch('explorer/dataRecieved')
        
        const json = JSON.parse(event.data)
        if (json.success) {
          store.commit('explorer/setData', json.data)
        } else {
          store.commit('explorer/setError', json.message)
        }
      }
      // path change
      store.subscribe((mutation, state) => {
        if (mutation.type === 'explorer/setPath') {
          store.dispatch('explorer/dataRequested')
          if (socketOpen) { // if socket is open send message
            socket.send(state.explorer.path)
          } else {  // else wait socket to open
            socket.onopen = () => {
              socket.send(state.explorer.path)
            }
          }
        }
      })
    } // /startwebsocket
    startWebSocket()    
  }
}