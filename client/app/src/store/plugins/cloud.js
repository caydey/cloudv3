import { SOCKET_HOST } from '@/config'

export default function createWebSocketPlugin() {

  return store => {
    let socketOpen = false
    let socket
    let lastPath;
    const startWebSocket = () => {
      socket = new WebSocket(SOCKET_HOST);

      socketOpen = false
      socket.addEventListener('open', () => {
        socketOpen = true
        if (lastPath) {
          socket.send(lastPath)
        }
      })

      // retry connection on websockets close
      socket.addEventListener('close', () => {
        setTimeout(startWebSocket, 10_000)
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
        lastPath = state.explorer.path
        if (socketOpen) { // if socket is open send message, else it'll be caught on open lastPath check
          socket.send(state.explorer.path)
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