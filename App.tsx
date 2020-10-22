import React from 'react'
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native'

import TTTT from './src/try'
import QQQ from './src/qqq'
import { NativeRouter, Route, Switch } from 'react-router-native'

const App = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <NativeRouter>
                    <Switch>
                        <Route path="/qqq" component={QQQ}></Route>
                        <Route component={TTTT}></Route>
                    </Switch>
                </NativeRouter>
            </SafeAreaView>
        </>
    )
}

export default App
