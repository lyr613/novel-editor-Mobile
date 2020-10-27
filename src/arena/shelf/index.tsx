import React, { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { timer } from 'rxjs'
import { useObservable } from 'rxjs-hooks'
import { take } from 'rxjs/operators'
import RNFS from 'react-native-fs'
import { book_use_id$ } from '@/subject/book'

/** 书架 */
export default function Shelf() {
    const [books, next_books] = useState([] as bk[])
    useEffect(() => {
        async function get_books() {
            const childs = await RNFS.readDir(RNFS.CachesDirectoryPath)
            const childs2 = childs.filter((v) => v.isDirectory() && /[a-z0-9]{32}/.test(v.name))
            const re = []
            for await (const cd of childs2) {
                const optsrc = [RNFS.CachesDirectoryPath, cd.name, 'shard.json'].join('/')
                const opttxt = await RNFS.readFile(optsrc, 'utf8')
                const opt = JSON.parse(opttxt)
                re.push({
                    id: cd.name,
                    name: opt.name,
                })
            }
            console.log(re)
            next_books(re)
        }
        get_books()
    }, [])
    return (
        <View style={ss.shelf}>
            {/* <Text>书架{t}</Text> */}
            <FlatList
                style={ss.bookbox}
                data={books}
                renderItem={Book}
                keyExtractor={(v) => v.id}
                ItemSeparatorComponent={SplitLine}
            ></FlatList>
            {/* <Text>书架{t}</Text> */}
        </View>
    )
}

interface bk {
    id: string
    name: string
}

const bookli: bk[] = Array.from({ length: 20 }, (_, i) => {
    return {
        id: i + '',
        name: '啊名字' + i,
    }
})

function Book(p: { item: bk }) {
    return (
        <View
            style={ss.book}
            onTouchEnd={() => {
                book_use_id$.next(p.item.id)
            }}
        >
            <View style={ss.inforline}>
                <Text style={ss.namet}>{p.item.name.slice(0, 10)}</Text>
            </View>
            <View style={ss.inforline}>
                <Text style={ss.namet}>字数: 233333</Text>
            </View>
            <View style={ss.inforline}>
                <Text style={ss.namet}>更新: 2020-10-23</Text>
            </View>
            <Image source={require('./media/q.png')} style={ss.img} />
        </View>
    )
}

function SplitLine() {
    return <View style={ss.splitline}></View>
}

const ss = StyleSheet.create({
    shelf: {
        overflow: 'hidden',
    },
    bookbox: {
        height: '100%',
    },
    book: {
        position: 'relative',
        marginHorizontal: 20,
        height: 120,
    },
    splitline: {
        margin: 10,
        marginHorizontal: 40,
        height: 1,
        backgroundColor: '#66ccff',
    },
    inforline: {
        // margin: 10,
        display: 'flex',
        height: '33%',
        justifyContent: 'center',
        paddingLeft: 10,
        overflow: 'hidden',
        // backgroundColor: 'red',
    },
    namet: {
        fontSize: 20,
    },
    img: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 80,
        height: 120,
    },
})
