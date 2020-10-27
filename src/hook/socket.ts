import { useEffect } from 'react'
import SocketIOClientStatic from 'socket.io-client'
import RNFS from 'react-native-fs'
import { mk_file_src } from '@/util/file-src'

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
        // 接受文件, json和节文本都通过此
        client.on('send-file', async (book_id: string, rest_src: string, txt: string) => {
            // console.log('send-file')
            // console.log(book_id, rest_src, txt.length)

            const src = mk_file_src([book_id, rest_src])
            await RNFS.writeFile(src, txt, 'utf8')
            // const red = await RNFS.readFile(src)
            // console.log('read', red.length)
            client.emit('send-next')
        })
        /** 第一步, 准备书的目录和碎片信息 */
        client.on('setup-book', async (id: string, name: string) => {
            console.log('准备书文件夹')
            const root_src = mk_file_src([])
            const be_root_exist = await RNFS.existsAssets(root_src)
            if (!be_root_exist) {
                await RNFS.mkdir(root_src)
            }

            const book_src = mk_file_src([id])
            const be_book_exist = await RNFS.existsAssets(book_src)
            if (!be_book_exist) {
                await RNFS.mkdir(book_src)
            }
            // 节文本的文件夹
            const nodebox_src = [book_src, 'chapters'].join('/')
            const be_nodebox_exist = await RNFS.existsAssets(nodebox_src)
            if (!be_nodebox_exist) {
                await RNFS.mkdir(nodebox_src)
            }

            // opt
            const optsrc = mk_file_src([id, 'shard.json'])
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
            console.log('书文件夹准备好了')

            client.emit('send-next')
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
