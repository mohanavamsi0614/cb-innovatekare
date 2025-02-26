import { Route, Routes } from 'react-router';
import './App.css';
import Home from './Home';
import Payment from './payment';
import Form from './form';
import Admin from './admin';
import Attd from './Attd';
import TeamPanel from './TeamPanel';
import EventUp from './EventUp';
import Marks from './Marks';

function App() {
    return (
                <Routes >
        <Route path='/' element={<Home/>}/>
        <Route path='/registration' element={<Form/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path='/adminu' element={<Admin/>}/>
        <Route path='/attd' element={<Attd/>}/>
        <Route path='/teampanel' element={<TeamPanel/>}/>
        <Route path='/event' element={<EventUp/>}/>
        <Route path='/marks' element={<Marks/>}/>
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