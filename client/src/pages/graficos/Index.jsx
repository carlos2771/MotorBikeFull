import React, { useState } from "react";
import { CharBar } from "../../components/CharBar";
import SimpleCard from "../../components/SimpleCard";
import SimpleCard3 from "../../components/SimpleCard3";
import SimpleCard2 from "../../components/SimpleCard2";

export default function GraficosPage() {
  const [totalMostrado, setTotalMostrado] = useState(0);

  const handleTotalChange = (total) => {
    setTotalMostrado(total);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-start-1">
        <SimpleCard2 totalMostrado={totalMostrado} />  
      </div>

      <div className="col-start-2">
        <SimpleCard />
      </div>

      <div className="col-start-3">
        <SimpleCard3 />
      </div>

      <div className="col-start-1">
        <CharBar onTotalChange={handleTotalChange} setTotalMostrado={setTotalMostrado}/>
      </div>
    </div>
  );
}
