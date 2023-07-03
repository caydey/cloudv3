const cache = new Map();

const CACHE_EXPIRE = 30_000;

export default function createWebSocketPlugin() {
  return (store) => {
    // path change
    store.subscribe((mutation, state) => {
      const path = state.explorer.path;
      if (mutation.type === "explorer/setData") {
        // cache set
        cache.set(path, { time: Date.now(), data: mutation.payload });
      }

      if (mutation.type === "explorer/setPath") {
        // cache hit
        if (cache.has(path)) {
          const cacheHit = cache.get(path);
          // cache not expired
          if (Date.now() - cacheHit.time < CACHE_EXPIRE) {
            // apply cache
            store.dispatch("explorer/dataRecieved");
            store.commit("explorer/setData", cacheHit.data);
          }
        }
      }
    });
  };
}
