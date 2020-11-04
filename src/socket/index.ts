import SocketIOClientStatic from 'socket.io-client'
import RNFS from 'react-native-fs'
import { mk_file_src } from '@/util/file-src'

let app_socket_client: SocketIOClient.Socket | null = null

export function link_socket(src: string, setter: Function) {
    setter('进入方法')

    app_socket_client = SocketIOClientStatic(src)
    if (!app_socket_client) {
        return
    }
    setter('client设置了')
    app_socket_client.on('connect', function () {
        setter('连上了, 即将发送设置此app')
        app_socket_client!.emit('set_it_app')
        setter('已经发送设置此手机端')
    })
    // 接受文件, json和节文本都通过此
    app_socket_client.on('send-file', async (book_id: string, rest_src: string, txt: string) => {
        const src = mk_file_src([book_id, rest_src])
        await RNFS.writeFile(src, txt, 'utf8')
        app_socket_client!.emit('send-next')
    })
    /** 第一步, 准备书的目录和碎片信息 */
    app_socket_client.on('setup-book', async (id: string, name: string) => {
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

        app_socket_client!.emit('send-next')
    })
}

export { app_socket_client }
