import React, { useContext } from "react";
import CartContext from "../../context/CartContext";

const Products = () => {
  const { addItemToCart, products } = useContext(CartContext);

  return (
    <div className="w-full grid grid-cols-4 gap-y-20 gap-x-75 justify-items-center pt-20 mr-96 ">
      {products &&
        products.map((product, i) => (
          <div key={i} className=" flex flex-col items-center justify-center space-y-2">
            <img className="w-full" src={`data:image/png;base64,${product.img}`} alt={product.name} />
            <div>
              <p className="font-Roboto text-center font-bold">{product.name} - ${product.price}</p>
            </div>
            {!product.inCart ? (
              <button
                className="border-none rounded-3px px-5 py-2 cursor-pointer hover:bg-gray-300"
                onClick={() => addItemToCart(product)}
              >
                Add to Cart
              </button>
            ) : (
              <button className="border-none rounded-3px px-5 py-2">En el carrito</button>
            )}
          </div>
        ))}
    </div>
  );
};

export default Products;
