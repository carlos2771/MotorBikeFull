// import {CharPie} from "../../components/CharPie";
import {CharBar} from "../../components/CharBar";
import React from "react";
import SimpleCard from "../../components/SimpleCard";



export default function GraficosPage() {
return (

<div className="grid grid-cols-4 grid-cols-4 gap-4">
<div className="col-span-4">
        <SimpleCard />
      </div>
    
    <div className="col-start-1">
        <CharBar />
    </div>

    {/* <div className="col-start-3">
        <CharPie /> 
      </div>  */}
</div>



    
    );
  }
  
