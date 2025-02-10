import {  Route, Routes } from 'react-router'
import './App.css'
import Home from './Home'
import Payment from './payment';
import Form from './form';
import { Analytics } from '@vercel/analytics/react';

function App() {
    return (
                <Routes >
                    <Route path='/' element={<Home/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/registration' element={<Form/>}/>
        <Route path='/payment' element={<Payment/>}/>
        {/* <Route path='/admin' element={<Admin/>}/>
        <Route path='/teampanel' element={<TeamPanel/>}/>
        <Route path='/at' element={<AllTeamsAttendance/>}/>
        <Route path='/Score' element={<Score/>}/>
        <Route path='/allscore' element={<AllScore/>}/>
        <Route path='/high' element={<High/>}/> */}
      </Routes>           
    );
}

export default App