import { router_nexter$ } from '@/subject/router'
import React, { useEffect } from 'react'
import { BackHandler, SafeAreaView, StatusBar } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'

import { NativeRouter, Route, Switch, useHistory } from 'react-router-native'
import Chapter from './chapter'
import Scan from './scan'
import Shelf from './shelf'
import TrySome from './trysome'

const App = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={ss.rootbox}>
                <NativeRouter>
                    <RT />
                </NativeRouter>
            </SafeAreaView>
        </>
    )
}

function RT() {
    const rt = useHistory()
    useEffect(() => {
        // 监听安卓返回键
        BackHandler.addEventListener('hardwareBackPress', function () {
            if (rt.location.pathname !== '/' && rt.location.pathname !== '/shelf') {
                rt.goBack()
                return true
            }
            /**
             * 返回false时会使事件继续传递，触发其他注册的监听函数，或是系统默认的后退行为
             */
            return false
        })
    }, [])
    useEffect(() => {
        // 监听路由改变
        router_nexter$.subscribe((next) => {
            if (!next) {
                rt.push('/')
                return
            }
            if (Array.isArray(next)) {
                next = next.join('/').replace(/\/+/g, '')
            }
            next = next.replace(/^\/*/, '/')
            rt.push(next)
        })
    }, [])
    return (
        <Switch>
            <Route path="/shelf" component={Shelf}></Route>
            <Route path="/chapter" component={Chapter}></Route>
            <Route path="/scan" component={Scan}></Route>
            <Route component={Empty}></Route>
        </Switch>
    )
}

/** 承接没有的路由, 转到主页去 */
function Empty() {
    const rt = useHistory()
    rt.push('/shelf')
    return <View></View>
}

const ss = StyleSheet.create({
    rootbox: {
        flex: 1,
    },
})

export default App
