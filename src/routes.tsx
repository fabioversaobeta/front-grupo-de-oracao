import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'

import Home from './pages/Home'
import CreateGroup from './pages/CreateGroup'

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={CreateGroup} path="/create-group" />
        </BrowserRouter>
    )
}

export default Routes