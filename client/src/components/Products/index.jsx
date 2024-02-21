import React, { useContext, useState, useEffect } from "react";
import CartContext from "../../context/CartContext";
import { useMarcas } from "../../context/MarcasContext";

const Products = () => {
  const { addItemToCart, products } = useContext(CartContext);
  const { marcas, getMarcas } = useMarcas();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarca, setSelectedMarca] = useState(""); // Estado para el ID de la marca seleccionada
  const [selectedSortOption, setSelectedSortOption] = useState(""); // Estado para la opción de ordenamiento seleccionada

  useEffect(() => {
    try {
      getMarcas();
    } catch (error) {
      console.error("Error al obtener clientes y mecánicos:", error);
    }
  }, []);

  // Función para filtrar los productos según el término de búsqueda y la marca seleccionada
  const filteredProducts = products.filter((product) =>
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

  return (
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
            <option key={marca._id} value={marca._id}> {/* Asigna el valor del ID de la marca */}
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

      <div className="w-full grid gap-y-20 gap-x-75 justify-items-center pt-20 mr-96 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 max-2xl:grid-cols-1 lg:grid-cols-3 gap-1">
        {sortedProducts().map((product, i) => (
          <div key={i} className="flex flex-col items-center justify-center space-y-2">
            <img
              className="w-full h-56"
              src={`${product.img}`}
              alt={product.name}
            />
            <div className="text-base max-md:text-2xl">
              <p className="font-Roboto text-center font-bold">{product.name} - ${product.price}</p>
              <p className="font-Roboto text-center font-bold">{product.nombre_marca}</p> {/* Utiliza el nombre de la marca */}
              <p className="font-Roboto text-center font-bold "> Existencia {product.amount}</p>
            </div>
            {!product.inCart ? (
              <button
                className="border-none rounded-3px px-5 py-2 cursor-pointer hover:bg-gray-300 text-base max-md:text-2xl"
                onClick={async () => await addItemToCart(product)}
              >
                Add to Cart
              </button>
            ) : (
              <button className="border-none rounded-3px px-5 py-2 max-md:text-2xl ">En el carrito</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
