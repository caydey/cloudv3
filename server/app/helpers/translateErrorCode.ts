export default function (errcode?: string): string {
  switch (errcode) {
    case "EACCES":
      return "Access Denied";
    case "ENOENT":
      return "Path does not exist";
    case undefined:
      return "Unknown error encountered";
    default:
      console.log("new error code found:", errcode);
      return "Error";
  }
}
