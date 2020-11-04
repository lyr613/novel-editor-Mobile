import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useHistory } from 'react-router'
import { RNCamera } from 'react-native-camera'

/** 尝试 */
export default function TrySome() {
    const [src_scaned, next_src_scaned] = useState('')
    const rt = useHistory()
    return (
        <View
            onTouchStart={() => {
                console.log('跳到书架')
                rt.push('/shelf')
            }}
        >
            <View style={styles.jump}>
                <Text style={styles.big}>去书架</Text>
                <Text>{src_scaned}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    big: {
        fontSize: 60,
    },
    scan: {
        width: '100%',
        height: '70%',
    },
    jump: {
        height: '30%',
    },
})
