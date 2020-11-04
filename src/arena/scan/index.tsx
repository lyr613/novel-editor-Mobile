import { link_socket } from '@/socket/index'
import { router_nexter$ } from '@/subject/router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { RNCamera } from 'react-native-camera'

/** 扫码 */
export default function Scan() {
    const [src_scaned, next_src_scaned] = useState('')

    return (
        <View style={ss.box}>
            <View
                style={ss.jump}
                onTouchEnd={() => {
                    router_nexter$.next('shelf')
                }}
            >
                <Text style={ss.jumptxt}>去书架</Text>
            </View>
            {!src_scaned && (
                <RNCamera
                    style={ss.scan}
                    type={RNCamera.Constants.Type.back}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    onBarCodeRead={(e) => {
                        // console.log(e.data)
                        next_src_scaned(e.data)
                        link_socket(e.data, next_src_scaned)
                    }}
                />
            )}
        </View>
    )
}

const ss = StyleSheet.create({
    box: {
        height: '100%',
    },
    jump: {
        display: 'flex',
        height: 200,
        alignItems: 'center',
    },
    jumptxt: {
        fontSize: 36,
        textAlign: 'center',
    },
    scan: {
        width: '100%',
        height: '50%',
    },
})
