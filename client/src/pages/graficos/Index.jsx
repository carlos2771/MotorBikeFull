// import {CharPie} from "../../components/CharPie";
import {CharBar} from "../../components/CharBar";
import React from "react";
import SimpleCard from "../../components/SimpleCard";
import SimpleCard2 from "../../components/SimpleCard2";



export default function GraficosPage() {
return (

<div className="grid grid-cols-4 gap-4">
<div className="col-start-1">
        <SimpleCard2 />
      </div>
      
      <div className="col-start-2">
        <SimpleCard />
      </div>
      
    
    <div className="col-start-1">
        <CharBar />
    </div>


    {/* <div className="col-start-3">
        <CharBar />
    </div> */}

    {/* <div className="col-start-3">
        <CharPie /> 
      </div>  */}
</div>



    
    );
  }
  
