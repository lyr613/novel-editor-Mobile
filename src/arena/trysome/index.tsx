import { useSocket } from '@/hook/socket'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

/** 尝试 */
export default function TrySome() {
    const [himsg, next_himsg] = useState('init')
    const sockethold = useSocket()
    useEffect(() => {
        const socket = sockethold.client
        if (!socket) {
            return
        }
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
