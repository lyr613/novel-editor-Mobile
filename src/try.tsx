import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useHistory } from 'react-router'
import { mk_router } from '@/router/opt'

export default function TTTT() {
    const his = useHistory()
    useEffect(() => {
        console.log('efff')
    }, [])
    return (
        <View
            onTouchStart={() => {
                console.log(2345)
                his.push('/qqq')
            }}>
            <Text style={styles.big}>{mk_router('edit', 'b')}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    big: {
        fontSize: 60,
    },
})
