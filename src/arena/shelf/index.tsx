import React, { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { Subject, timer } from 'rxjs'
import { useObservable } from 'rxjs-hooks'
import { take, tap } from 'rxjs/operators'
import RNFS from 'react-native-fs'
import { book_use_id$ } from '@/subject/book'
import { mk_file_src } from '@/util/file-src'
import { useHistory } from 'react-router-native'
import { router_nexter$ } from '@/subject/router'

/** 书架 */
export default function Shelf() {
    const [books, next_books] = useState([] as bk[])
    const rt = useHistory()

    useEffect(() => {
        async function get_books() {
            try {
                const childs = await RNFS.readDir(mk_file_src([]))
                const childs2 = childs.filter((v) => v.isDirectory() && /[a-z0-9]{32}/.test(v.name))
                const re = []
                for await (const cd of childs2) {
                    const optsrc = mk_file_src([cd.name, 'shard.json'])
                    const opttxt = await RNFS.readFile(optsrc, 'utf8')
                    const opt = JSON.parse(opttxt)
                    re.push({
                        id: cd.name,
                        name: opt.name,
                    })
                }
                console.log(re)
                next_books(re)
            } catch (error) {}
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

function Book(p: { item: bk }) {
    // const rt = useHistory()
    return (
        <View
            style={ss.book}
            onTouchEnd={() => {
                book_use_id$.next(p.item.id)
                router_nexter$.next('/chapter')

                // rt.push('/chapter')
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
