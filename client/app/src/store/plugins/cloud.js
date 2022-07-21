import { SOCKET_HOST } from '@/config'

export default function createWebSocketPlugin() {

  return store => {
    let socketOpen = false
    let socket
    const startWebSocket = () => {
      socket = new WebSocket(SOCKET_HOST);

      socketOpen = false
      socket.addEventListener('open', () => {
        socketOpen = true
      })

      // retry connection on websockets close
      socket.addEventListener('close', () => {
        startWebSocket()
      })

      // listen for socket response message
      socket.onmessage = (event) => {
        store.dispatch('explorer/dataRecieved')

        const json = JSON.parse(event.data)
        if (json.success) {
          store.commit('explorer/setData', json.data)
        } else {
          store.commit('explorer/setError', json.message)
        }
      }
    } // /startwebsocket

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

    // reload connection
    store.subscribeAction((action) => {
      if (action.type === 'explorer/reloadConnection') {
        // restart websocket
        startWebSocket()
      }
    })

    startWebSocket()
  }
}