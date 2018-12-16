import React, { Component } from 'react';

import 'filepond/dist/filepond.min.css';
import logo from './logo.svg';
import './App.css';
import FolderList from "./DirectoryList";
import SimpleAppBar from './Bar';

class App extends Component {


    render() {
        return (
            <div className="App">
                <SimpleAppBar/>
                <FolderList/>

            </div>
        );
    }
}

export default App;
