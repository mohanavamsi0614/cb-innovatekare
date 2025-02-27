import axios from "axios";
import { useEffect, useState } from "react";
import api from "./api";
function SquidGame(){
    const [teams,setTeams]=useState([])
    useEffect(()=>{
        async function data() {
            try {
                let res = await axios.get(`${api}/event/students`);
                res = await res.data;
                setTeams(res);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        }
        data()
    })
    return(
        <div>
            <h1>Squid Game Score Panel</h1>
           
        </div>
    )
}
export default SquidGame;