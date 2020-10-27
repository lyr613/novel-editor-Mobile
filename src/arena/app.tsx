import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'

import { NativeRouter, Route, Switch } from 'react-router-native'
import Chapter from './chapter'
import Shelf from './shelf'
import TrySome from './trysome'

const App = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={ss.rootbox}>
                <NativeRouter>
                    <Switch>
                        <Route path="/qqq"></Route>
                        <Route path="/shelf" component={Shelf}></Route>
                        <Route path="/chapter" component={Chapter}></Route>
                        <Route component={TrySome}></Route>
                    </Switch>
                </NativeRouter>
            </SafeAreaView>
        </>
    )
}

const ss = StyleSheet.create({
    rootbox: {
        flex: 1,
    },
})

export default App
