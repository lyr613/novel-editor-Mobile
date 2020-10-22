import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'

import { NativeRouter, Route, Switch } from 'react-router-native'

const App = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <NativeRouter>
                    <Switch>
                        <Route path="/qqq"></Route>
                        <Route></Route>
                    </Switch>
                </NativeRouter>
            </SafeAreaView>
        </>
    )
}

export default App
