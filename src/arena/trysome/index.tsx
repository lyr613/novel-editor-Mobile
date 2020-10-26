import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
// var socket = require('socket.io-client')('http://172.16.0.38:3000')
import SocketIOClientStatic from 'socket.io-client'
/** 尝试 */
export default function TrySome() {
    const [himsg, next_himsg] = useState('init')
    useEffect(() => {
        const socket = SocketIOClientStatic('http://172.16.0.38:3000')
        console.log(socket.disconnected)

        socket.on('disconnect', () => {
            console.log('unlink')
            socket.close()
        })

        socket.on('connect', function () {
            // function qqq() {
            //     socket.emit('heart1', 233)
            // }
            // qqq()
            // setInterval(() => {
            //     qqq()
            // }, 3000)
            socket.on('re', (msg: string) => {
                console.log(msg, 111)
                next_himsg(msg)
            })
        })
        return () => {
            try {
                socket.close()
            } catch (error) {}
        }
    }, [])
    return (
        <View>
            <Text>123{himsg}</Text>
        </View>
    )
}

const ss = StyleSheet.create({})
