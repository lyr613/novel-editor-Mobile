import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useHistory } from 'react-router'
import { mk_router } from '@/router/opt'

import { RNCamera } from 'react-native-camera'

export default function TTTT() {
    const his = useHistory()
    const [did_view, next_did_view] = useState('')
    useEffect(() => {
        console.log('efff')
    }, [])
    return (
        <View
            onTouchStart={() => {
                console.log(2345)
                // his.push('/qqq')
            }}
        >
            {did_view ? (
                <View
                    onTouchEnd={() => {
                        next_did_view('')
                    }}
                >
                    <Text style={styles.big}>{did_view}</Text>
                </View>
            ) : (
                <RNCamera
                    style={styles.scan}
                    type={RNCamera.Constants.Type.back}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    onBarCodeRead={(e) => {
                        console.log(e.data)
                        next_did_view(e.data)
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
