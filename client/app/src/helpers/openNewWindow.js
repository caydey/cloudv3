import { EXPLORE_ROUTE_NAME } from "@/config"

export default function openNewWindow(path) {
  const url = "/"+EXPLORE_ROUTE_NAME+path
  window.open(url, "_blank")
}