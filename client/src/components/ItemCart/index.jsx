import React, { useContext, useState } from "react";
import CartContext from "../../context/CartContext";
import styles from "./styles.module.scss";

export const ItemCart = ({ item, updateTotal, handleUpadateUnit}) => {
  
  const { amount, price, img, name} = item;
  const [num, setNum] = useState(amount);

  const handleInputChange = (event) => {
    const newValue = Number(event.target.value);
      setNum(newValue);
      updateTotal(item._id, newValue);
      handleUpadateUnit({name,unit:newValue})
    
  };

  return (
    <div className={styles.cartItem}>
      <img className="h-1" src={img} alt={name} />
      <div className={styles.dataContainer}>
        <div className={styles.left}>
          <p>{item.name}</p>
          <div className={styles.buttons}>
            <input
            type="number"
              value={num}
              onChange={handleInputChange}
              className="w-10 text-black text-center"
              
            />
          </div>
        </div>
        <div className={styles.right}>
          <div>{num}</div>
          <p>Total: ${num * price}</p>
        </div>
      </div>
    </div>
  );
};
