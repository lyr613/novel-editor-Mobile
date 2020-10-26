import { useEffect } from 'react'
import SocketIOClientStatic from 'socket.io-client'

let Client: SocketIOClient.Socket | null = null

/** 获取socketio的客户端 */
export function get_socket_client() {
    if (!Client) {
        Client = SocketIOClientStatic('http://172.16.0.38:3000')
    }
    return Client
}

interface hold {
    client: SocketIOClient.Socket | null
}
/** 获取socketio的客户端
 * 确保会在useEffect内生成
 */
export function useSocket() {
    const hold: hold = {
        client: null,
    }
    useEffect(() => {
        hold.client = get_socket_client()
    }, [])
    return hold
}
