import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'

import { NativeRouter, Route, Switch } from 'react-router-native'
import Shelf from './shelf'
import TrySome from './trysome'

const App = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <NativeRouter>
                    <Switch>
                        <Route path="/qqq"></Route>
                        <Route component={Shelf}></Route>
                        <Route component={TrySome}></Route>
                    </Switch>
                </NativeRouter>
            </SafeAreaView>
        </>
    )
}

export default App
