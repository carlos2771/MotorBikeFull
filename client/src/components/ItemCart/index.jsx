import React, { useContext, useState } from "react";
import CartContext from "../../context/CartContext";
import styles from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
} from "@fortawesome/free-solid-svg-icons";

export const ItemCart = ({ item,   handleAmountChange  }) => {
  
  const { amount, price, img, name } = item;
  // const [num, setNum] = useState(amount);
  const { deleteProduct } = useContext(CartContext);

  const handleInputChange = (event) => {
    let newValue = event.target.value;
    // Verificar si el nuevo valor es 0 o NaN, si es así, establecerlo en 1 en su lugar
    // if (isNaN(newValue) || newValue <= 0 ) {
    //   newValue = 1;
    // }
    const newValueItem = {
      ...item,
      amount: newValue
    }

    handleAmountChange(newValueItem)
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
              value={amount}
              onChange={handleInputChange}
              className="w-12  border-0 bg-slate-700  border-b-2 border-blue-600 text-white  "
            />
            <button className="max-sm:text-xs px-3 py-1 ml-3 text-xs text-withe font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30" onClick={async() => await deleteProduct(item._id)}><FontAwesomeIcon icon={faBan} /></button>
          </div>
        </div>
        <div className={styles.right}>
          <div>{amount.toLocaleString()}</div> {/* Aquí aplicamos el separador de miles */}
          <p>Total: ${(amount * price).toLocaleString()}</p> {/* Aplicamos el separador de miles al total también */}
        </div>
      </div>
    </div>
  );
};

