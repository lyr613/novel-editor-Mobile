import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useHistory } from 'react-router'
import RNFS from 'react-native-fs'
import { mk_router } from '@/router/opt'
import { mk_file_src } from '@/util/file-src'

// 文件读写
export default function QQQ() {
    const his = useHistory()
    const r = mk_router('edit')
    useEffect(() => {
        async function kkk() {
            const src = mk_file_src(['flag.txt'])
            await RNFS.writeFile(src, 'flag', 'utf8')
            const red = await RNFS.readFile(src)
            console.log('read', red)
        }
        kkk()
    }, [])

    return (
        <View
            onTouchStart={() => {
                his.push('ttt')
            }}
        >
            {[1].map((n) => (
                <Text key={n} style={styles.big}>
                    {RNFS.CachesDirectoryPath}
                </Text>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    big: {
        fontSize: 14,
        color: '#66ccff',
    },
})
