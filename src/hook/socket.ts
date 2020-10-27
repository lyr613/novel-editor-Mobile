import { useEffect } from 'react'
import SocketIOClientStatic from 'socket.io-client'
import RNFS from 'react-native-fs'

class AppSocket {
    client: SocketIOClient.Socket | null = null
    link(src: string) {
        if (this.client) {
            this.client.disconnect()
        }
        const client = SocketIOClientStatic(src)
        client.on('connect', function () {
            client.emit('set_it_app')
            // function qqq() {
            //     socket.emit('heart1', 233)
            // }
            // qqq()
            // setInterval(() => {
            //     qqq()
            // }, 3000)
        })
        // 应该先做一个准备, 防止反复检查浪费时间
        client.on('send-file', async (book_id: string, rest_src: string, txt: string) => {
            console.log('send-file')

            console.log(book_id, rest_src, txt.length)

            const book_src = [RNFS.CachesDirectoryPath, book_id].join('/')
            console.log(book_src)

            const be_book_exist = await RNFS.existsAssets(book_src)
            if (!be_book_exist) {
                RNFS.mkdir(book_src)
            }
            const src = [RNFS.CachesDirectoryPath, book_id, rest_src].join('/')
            await RNFS.writeFile(src, txt, 'utf8')
            const red = await RNFS.readFile(src)
            console.log('read', red.length)
        })
        /** 第一步, 准备书的目录和碎片信息 */
        client.on('setup-book', async (id: string, name: string) => {
            const book_src = [RNFS.CachesDirectoryPath, id].join('/')
            const be_book_exist = await RNFS.existsAssets(book_src)
            if (!be_book_exist) {
                await RNFS.mkdir(book_src)
            }
            const optsrc = [RNFS.CachesDirectoryPath, id, 'shard.json'].join('/')
            const opt_exist = await RNFS.existsAssets(book_src)
            let next_opt = { name }
            if (opt_exist) {
                const oldopttxt = await RNFS.readFile(optsrc)
                const oldopt = JSON.parse(oldopttxt)
                Object.assign(oldopt, next_opt)
                next_opt = oldopt
            }
            const next_txt = JSON.stringify(next_opt)
            await RNFS.writeFile(optsrc, next_txt, 'utf8')
        })
        this.client = client
    }
}

export const app_socket = new AppSocket()

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
        const socket = get_socket_client()
        hold.client = socket
        socket.on('connect', function () {
            socket.emit('set_it_app')
            // function qqq() {
            //     socket.emit('heart1', 233)
            // }
            // qqq()
            // setInterval(() => {
            //     qqq()
            // }, 3000)
        })
    }, [])
    return hold
}
