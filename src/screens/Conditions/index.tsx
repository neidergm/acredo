import React from 'react';
import { useParams } from "react-router-dom";

const Conditions = () => {
  
  const {city} = useParams()
  return (
    <div>
        Condiciones {city}
    </div>
  )
}

export default Conditions;
