import React from "react";
import { CharBar } from "../../components/CharBar";
import SimpleCard from "../../components/SimpleCard";
import SimpleCard3 from "../../components/SimpleCard3";
import SimpleCard2 from "../../components/SimpleCard2";
import SimpleCard4 from "../../components/SimpleCard4";

export default function GraficosPage() {

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-start-1">
        <SimpleCard2 />  
      </div>

      <div className="col-start-2">
        <SimpleCard />
      </div>

      <div className="col-start-3">
        <SimpleCard3 />
      </div>

      <div className="col-start-4">
        <SimpleCard4 />
      </div>

      <div className="col-start-1">
        <CharBar/>
      </div>
    </div>
  );
}
