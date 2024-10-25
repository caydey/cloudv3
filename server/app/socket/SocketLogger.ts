import { IS_DEV } from "../config";

class SocketLogger {
  private static writeLog(log: string) {
    if (IS_DEV) {
      console.log(log);
    }
  }

  public static recieved(id: string, data: string) {
    SocketLogger.writeLog(`WS [${id}]v ${data}`);
  }
  public static send(id: string, data: string) {
    SocketLogger.writeLog(`WS [${id}]^ ${data}`);
  }
  public static open(id: string) {
    SocketLogger.writeLog(`WS [${id}] OPEN`);
  }
  public static close(id: string) {
    SocketLogger.writeLog(`WS [${id}] CLOSE`);
  }
}

export default SocketLogger;
