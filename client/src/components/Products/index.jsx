import React, { useContext, useState, useEffect } from "react";
import CartContext from "../../context/CartContext";
import { useMarcas } from "../../context/MarcasContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Products = () => {
  const { addItemToCart, products, getProducts } = useContext(CartContext);
  const { marcas, getMarcas } = useMarcas();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarca, setSelectedMarca] = useState(""); // Estado para el ID de la marca seleccionada
  const [selectedSortOption, setSelectedSortOption] = useState(""); // Estado para la opción de ordenamiento seleccionada
  const [noProductsMessage, setNoProductsMessage] = useState(false); // Estado para el mensaje de no productos

  const { user } = useAuth();

  useEffect(() => {
    try {
      getMarcas();
      getProducts();
    } catch (error) {
      console.error("Error al obtener clientes y mecánicos:", error);
    }
  }, []);

  // Función para filtrar los productos según el término de búsqueda y la marca seleccionada
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedMarca || product.marca === selectedMarca)
  );

  // Función para ordenar los productos según la opción seleccionada
  const sortedProducts = () => {
    let sorted = [...filteredProducts];
    if (selectedSortOption === "asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (selectedSortOption === "desc") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  };

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Venta Repuesto") ? (
        <div>
          <input
            type="text"
            placeholder="Buscar repuesto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-40 ml-10 bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
          />
          <select
            value={selectedMarca} // Valor controlado por el estado
            onChange={(e) => setSelectedMarca(e.target.value)} // Actualizar el estado cuando se selecciona una marca
            className="w-40 ml-10 bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
          >
            <option value="">Selecciona una marca</option>
            {marcas
              .filter((marca) => marca.estado === "Activo")
              .map((marca) => (
                <option key={marca._id} value={marca._id}>
                  {marca.nombre_marca}
                </option>
              ))}
          </select>

          <select
            value={selectedSortOption}
            onChange={(e) => setSelectedSortOption(e.target.value)}
            className="w-40 ml-10 bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
          >
            <option value="">Ordenar por precio</option>
            <option value="asc">Precio ascendente</option>
            <option value="desc">Precio descendente</option>
          </select>

          {sortedProducts().length === 0 && (
            <p className="text-center text-red-500">No hay productos disponibles con esta marca</p>
          )}

          <div className=" w-full grid gap-y-20 gap-x-75 justify-items-center pt-20 mr-96 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 max-2xl:grid-cols-1 lg:grid-cols-3 gap-1">
            {sortedProducts().map((product, i) => (
              <div key={i} className="flex flex-col items-center justify-center space-y-2">
                <img className="w-full h-56" src={`${product.img}`} alt={product.name} />
                <div className="text-base max-md:text-2xl">
                  <p className="font-Roboto text-center font-font-semibold">{product.name} - ${product.price}</p>
                  <p className="font-Roboto text-center font-font-semibold">{marcas.find(marca => marca._id === product.marca)?.nombre_marca}</p>
                  <p className="font-Roboto text-center font-font-semibold "> Existencia {product.amount}</p>
                </div>
                {!product.inCart ? (
                  <button
                    className="max-sm:text-xs px-5 py-1 mt-4 text-sm text-withe font-semibold  rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 "
                    onClick={async () => await addItemToCart(product)}
                  >
                    Agregar al carro
                    <FontAwesomeIcon icon={faCartShopping} />
                  </button>
                ) : (
                  <button className="max-sm:text-xs px-5 py-1 ml-3 text-sm text-withe font-semibold bg-red-500 rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ">En el carrito <FontAwesomeIcon icon={faCartShopping} /> </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Navigate to="/tasks" />
      )}
    </>
  );
};

export default Products;
