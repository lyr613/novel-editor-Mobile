import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useHistory } from 'react-router'
import { RNCamera } from 'react-native-camera'
import { app_socket } from '@/hook/socket'

/** 尝试 */
export default function TrySome() {
    const [src_scaned, next_src_scaned] = useState('')
    const [himsg, next_himsg] = useState('init')
    return (
        <View>
            <Text>123{himsg}</Text>
            <Text>{src_scaned}</Text>
            {!src_scaned && (
                <RNCamera
                    style={styles.scan}
                    type={RNCamera.Constants.Type.back}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    onBarCodeRead={(e) => {
                        console.log(e.data)
                        next_src_scaned(e.data)
                        app_socket.link(e.data)
                        const client = app_socket.client
                        if (!client) {
                            return
                        }
                    }}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    big: {
        fontSize: 60,
    },
    scan: {
        width: '100%',
        height: '100%',
    },
})
