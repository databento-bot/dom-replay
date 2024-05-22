import { useEffect } from "react"
import { Dispatch } from "react"
import { ReducerAction, MBO, MBP10 } from "../types"
import useWebSocket, { ReadyState } from "react-use-websocket"

const useWebSocketConnection = (
  WS_URL: string,
  dispatch: Dispatch<ReducerAction>,
) => {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    }
  )
    console.log(readyState, lastJsonMessage)
  function isMBO(message: any): message is MBO {
    return (message as MBO).hd?.rtype === 160;
  }
  function isMBP10(message: any): message is MBP10 {
    return (message as MBP10).hd?.rtype === 10;
  }

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "subscribe",
      })
    }
  }, [readyState, sendJsonMessage])

  useEffect(() => {
    console.log(lastJsonMessage)
    if (!lastJsonMessage || Object.keys(lastJsonMessage).length === 0) {
      return
    }
    /* if message is MBO */
    if (isMBO(lastJsonMessage)) {
      let mbo = lastJsonMessage as MBO

      console.log(lastJsonMessage)
      /* if mbo.action === "T" */
      if (mbo.action === 84) {
        dispatch({ type: "UPDATE_MBO", payload: mbo })
      }

      /* if message is MBP10 */
    } else if (isMBP10(lastJsonMessage)) {
      let mbp10 = lastJsonMessage as MBP10
      console.log(mbp10)

      dispatch({ type: "UPDATE_DEPTH", payload: mbp10 })
    }

  }, [lastJsonMessage, dispatch])
}

export default useWebSocketConnection