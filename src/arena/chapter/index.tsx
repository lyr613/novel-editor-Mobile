import { pub_sty_btn } from '@/style'
import { book_use_id$ } from '@/subject/book'
import { mk_file_src } from '@/util/file-src'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, SectionList } from 'react-native'
import RNFS from 'react-native-fs'
import { BehaviorSubject, Subject } from 'rxjs'
import { useObservable } from 'rxjs-hooks'

const node_id$ = new BehaviorSubject<string>('')

const can_show_chapterli$ = new BehaviorSubject(true)

const chapter_li$ = new BehaviorSubject([] as chapter[])

/** 章节目录 */
export default function Chapter() {
    const [chapters, next_chapters] = useState([] as chapter[])
    const datali = chapters.map((v) => ({
        title: v.name,
        data: v.children,
        chapter: v,
    }))
    const can_show_chapterli = useObservable(() => can_show_chapterli$, true)

    useEffect(() => {
        async function get_chapters() {
            const bookid = book_use_id$.value
            if (!bookid) {
                return
            }
            const cpsrc = mk_file_src([bookid, 'chapter.json'])
            const txt = await RNFS.readFile(cpsrc, 'utf8')
            const cps: chapter[] = JSON.parse(txt)
            chapter_li$.next(cps)
            next_chapters(cps)
        }
        get_chapters()
    }, [])
    return (
        <View style={ss.box}>
            {can_show_chapterli ? (
                <SectionList
                    style={ss.chapterbox}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <NodeItem item={item} />}
                    sections={can_show_chapterli ? datali : []}
                    renderSectionHeader={({ section: { title, chapter } }) => (
                        <ChapterName title={title} chapter={chapter} />
                    )}
                />
            ) : (
                <Txt />
            )}
        </View>
    )
}

interface chapter_name {
    title: string
    chapter: chapter
}

function ChapterName(p: chapter_name) {
    return <Text style={ss.chapter}>{p.chapter.name}</Text>
}

interface nodeitem {
    item: node
}
function NodeItem(p: nodeitem) {
    const node = p.item
    return (
        <View
            onTouchEnd={() => {
                node_id$.next(node.id)
                can_show_chapterli$.next(false)
            }}
        >
            <Text style={ss.node}>{node.name}</Text>
        </View>
    )
}

function Txt() {
    const [txt, next_txt] = useState('')
    const [prevh, next_prevh] = useState(0)
    const [can_show_tool, next_can_show_tool] = useState(false)
    const rf = useRef(null as any)
    const [can_show_next, next_can_show_next] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            next_can_show_next(true)
        }, 1000)
    }, [])

    useEffect(() => {
        const ob = node_id$.subscribe(async (id) => {
            if (!id) {
                return
            }
            const src = mk_file_src([book_use_id$.value, 'chapters', id + '.txt'])
            const txt = await RNFS.readFile(src, 'utf8')
            next_txt(txt)
        })
        return () => {
            ob.unsubscribe()
        }
    }, [])
    return (
        <View style={styread.box}>
            <ScrollView
                ref={rf}
                style={ss.readbox}
                onScrollBeginDrag={(e) => {
                    const y = e.nativeEvent.contentOffset.y
                    next_prevh(y)
                }}
                onScrollEndDrag={(e) => {
                    const y2 = e.nativeEvent.contentOffset.y
                    const be_topper = prevh > y2 || y2 === 0
                    next_can_show_tool(be_topper)
                }}
            >
                <Text style={styread.readtxt}>{txt}</Text>
                {can_show_next && (
                    <View style={styread.toolfoo}>
                        <View
                            style={pub_sty_btn('').box}
                            onTouchEnd={() => {
                                const cps = chapter_li$.value
                                const nds: node[] = []
                                let i = 0
                                let savei = -1
                                // 奇怪, 咋没flat方法
                                cps.forEach((cp) => {
                                    cp.children.forEach((nd) => {
                                        if (nd.id === node_id$.value) {
                                            savei = i
                                        }
                                        nds.push(nd)
                                        i++
                                    })
                                })

                                if (savei > -1 && savei + 1 < nds.length) {
                                    const nexti = savei + 1
                                    const nd = nds[nexti]
                                    node_id$.next(nd.id)
                                    setTimeout(() => {
                                        const d = rf.current
                                        if (d) {
                                            d.scrollTo({
                                                x: 0,
                                                y: 0,
                                                animated: false,
                                            })
                                        }
                                    }, 100)
                                } else {
                                    can_show_chapterli$.next(true)
                                }
                            }}
                        >
                            <Text style={pub_sty_btn('').txt}>下一节</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {can_show_tool && (
                <View style={styread.toolbar}>
                    <View
                        style={styread.btn}
                        onTouchEnd={() => {
                            can_show_chapterli$.next(true)
                        }}
                    >
                        <Text style={styread.btntxt}>返回目录</Text>
                    </View>
                </View>
            )}
        </View>
    )
}

const ss = StyleSheet.create({
    txt: {
        fontSize: 14,
    },
    box: {
        height: '100%',
    },
    chapterbox: {
        height: '100%',
    },
    chapter: {
        paddingLeft: 20,
        fontSize: 24,
    },
    node: {
        paddingLeft: 40,
        lineHeight: 40,
    },
    readbox: {
        padding: 10,
        paddingHorizontal: 20,
    },
    read: {
        fontSize: 16,
    },
})

const styread = StyleSheet.create({
    box: {
        position: 'relative',
        height: '100%',
    },
    toolbar: {
        display: 'flex',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: 60,
        padding: 10,

        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    btn: {
        borderRadius: 4,
        width: 100,
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: '#66ccff',
    },
    btntxt: {
        lineHeight: 40,
        fontSize: 16,
        textAlign: 'center',
    },
    toolfoo: {
        marginBottom: 20,
        height: 60,
        padding: 10,
    },
    readtxt: {
        fontSize: 18,
    },
})
