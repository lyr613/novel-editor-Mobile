import { book_use_id$ } from '@/subject/book'
import { mk_file_src } from '@/util/file-src'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import RNFS from 'react-native-fs'
import { Subject } from 'rxjs'

const node_id$ = new Subject<string>()

/** 章节目录 */
export default function Chapter() {
    const [chapters, next_chapters] = useState([] as chapter[])
    useEffect(() => {
        async function get_chapters() {
            const bookid = book_use_id$.value
            if (!bookid) {
                return
            }
            const cpsrc = mk_file_src([bookid, 'chapter.json'])
            const txt = await RNFS.readFile(cpsrc, 'utf8')
            const cps: chapter[] = JSON.parse(txt)
            next_chapters(cps)
        }
        get_chapters()
    }, [])
    return (
        <ScrollView style={ss.box}>
            {chapters.map((cp) => (
                <OneChapter cp={cp} key={cp.id} />
            ))}
            <Txt />
        </ScrollView>
    )
}

function OneChapter(p: { cp: chapter }) {
    return (
        <View>
            <Text>{p.cp.name}</Text>
            {p.cp.children.map((nd) => (
                <OneNode nd={nd} key={nd.id} />
            ))}
        </View>
    )
}

function OneNode(p: { nd: node }) {
    return (
        <View
            onTouchEnd={() => {
                node_id$.next(p.nd.id)
            }}
        >
            <Text>{p.nd.name}</Text>
        </View>
    )
}

function Txt() {
    const [txt, next_txt] = useState('')
    useEffect(() => {
        const ob = node_id$.subscribe(async (id) => {
            const src = mk_file_src([book_use_id$.value, 'chapters', id + '.txt'])
            const txt = await RNFS.readFile(src, 'utf8')
            next_txt(txt)
        })
        return () => {
            ob.unsubscribe()
        }
    }, [])
    return (
        <View>
            <Text>{txt} </Text>
        </View>
    )
}

const ss = StyleSheet.create({
    txt: {
        fontSize: 14,
    },
    box: {
        overflow: 'scroll',
        backgroundColor: 'red',
    },
})
