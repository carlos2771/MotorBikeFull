import { useContext, useEffect, useState, useMemo} from "react";
import { ItemCart } from "../ItemCart";
import CartContext from "../../context/CartContext";
import styles from "./styles.module.scss";
import { useClientes } from "../../context/ClientContext";
import { useForm } from "react-hook-form";
import { useCartCliente } from "../../context/CartClienteContext";
import { Link, useNavigate } from "react-router-dom";
import {
  ClienteRequired,
  NombreRequired,
  discountValidations,
} from "../../utils/validations";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

const Cart = () => {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [productsLength, setProductsLength] = useState(0);
  const [buttonHidden, setButtonHidden] = useState(false);
  const { getClientes, clientes } = useClientes();
  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm({mode: 'onChange', defaultValues: {
    descuento: 0    
  }});
  const { createCartCliente, errors: Errors } = useCartCliente();

  useEffect(() => {
    try {
      getClientes();
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  }, []);

  /* Traemos del context los productos del carrito */
  const { cartItems, cleartCart, handleChangeCartItems } = useContext(CartContext);
  const descuento = watch('descuento')

  const totalCartTest = useMemo(() => {
    const total = cartItems?.reduce(
      (previous, current) => previous + current.amount * current.price,
      0
    );

    // Calculamos el descuento como un porcentaje del total
     if(descuento < 1) {

       return total
     }

    const discountAmount = total * (descuento / 100) || 0;

    // Restamos el descuento del total
    const totalConDescuento = total - discountAmount;
    return totalConDescuento
  }, [cartItems, descuento])

 

  const handleAmountChange = (newValue) => {
    const newCart = cartItems.map((cart) => cart.name === newValue.name ? newValue: cart)
    handleChangeCartItems(newCart)
  }

  /* Cada vez que se modifica el carrito, actualizamos la cantidad de productos */
  useEffect(() => {
    const quantityProducts = cartItems?.reduce((previous, current) => Number(previous) + Number(current.amount), 0) // reduce para reducir el array a un solo valor
    
    setProductsLength(quantityProducts);
  }, [cartItems]);

  /* Obtenemos el precio total */
  /* Obtenemos el precio total */
  // useEffect(() => {
  //   const total = cartItems?.reduce(
  //     (previous, current) => previous + current.amount * current.price,
  //     0
  //   );

    // Calculamos el descuento como un porcentaje del total
    // const discountAmount = total * (descuento / 100) || 0;

    // Restamos el descuento del total
  //   const totalConDescuento = total - discountAmount;

  //   setTotalCart(totalConDescuento > 0 ? totalConDescuento : 0); // Asegurarse de que el total no sea negativo
  // }, [cartItems, descuento]);

 

  const onSubmit = async (data) => {
    try {
      // aqui no se devuelva mas

      const { cliente, descuento, ...restData } = data;
      const result = cartItems.map((item) => {
        // Create a copy of each item
        const newItem = { ...item };

        // Resize the image before saving
        const image = new Image();
        image.src = newItem.image; // Assuming the image property is present in your item object

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set the desired dimensions for the resized image
        const newWidth = 100; // Adjust this value according to your requirements
        const newHeight = (newWidth / image.width) * image.height;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw the image on the canvas with the new dimensions
        ctx.drawImage(image, 0, 0, newWidth, newHeight);

        // Convert the canvas content to a data URL
        const resizedImage = canvas.toDataURL("image/jpeg");

        // Update the item's image property with the resized image
        newItem.image = resizedImage;
        
        return { ...newItem };
      });
      setButtonHidden(true);
      const descuentoNumber = parseInt(descuento);
      const datosCartCliente = {
        ...restData,
        cart: result,
        cliente,
        descuento: descuentoNumber,
      };

      const res = await createCartCliente(datosCartCliente);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
          color: "white",
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Venta Agregada correctamente",
        });
        if (res) {
          navigate("/home-page");
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
            color: "white",
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "error",
            title: "No se ha agregado",
          });
        }

      if (res && !res.error) {
        navigate("/home-page");
        cleartCart();
      } else {
        console.log("huvo un error");
      }
    } catch (error) {
      
      console.error("Error al enviar el carrito y cliente:", error);
    }
  };
  useEffect(() => {
    if (buttonHidden) {
      const timeoutId = setTimeout(() => {
        setButtonHidden(false);
      }, 4000);
  
      // Limpia el temporizador al desmontar el componente
      return () => clearTimeout(timeoutId);
    }
  }, [buttonHidden]);

  return (
    <div className={styles.cartContainer}>
      <div
        onClick={() => setCartOpen(!cartOpen)}
        className={styles.buttonCartContainer}
      >
        <div className={styles.buttonCart}>
          {" "}
          {/* icono del carro */}
          {!cartOpen ? (
            <svg
              className={styles.open}
              width={"35px"}
              viewBox="0 0 30 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.733 6.64651C29.595 6.44711 29.4108 6.28414 29.196 6.17154C28.9813 6.05895 28.7425 6.00009 28.5 6.00001H7.9995L6.2685 1.84501C6.04153 1.29784 5.6572 0.830389 5.16424 0.501923C4.67127 0.173457 4.09187 -0.00123156 3.4995 6.53586e-06H0V3.00001H3.4995L10.6155 20.0775C10.7295 20.3507 10.9218 20.5841 11.1681 20.7483C11.4145 20.9125 11.7039 21 12 21H24C24.6255 21 25.185 20.6115 25.4055 20.028L29.9055 8.02801C29.9905 7.80094 30.0193 7.55664 29.9892 7.31603C29.9592 7.07543 29.8713 6.84569 29.733 6.64651V6.64651Z"
                fill="#F0F0F0"
              />
              <path
                d="M12.75 27C13.9926 27 15 25.9926 15 24.75C15 23.5074 13.9926 22.5 12.75 22.5C11.5074 22.5 10.5 23.5074 10.5 24.75C10.5 25.9926 11.5074 27 12.75 27Z"
                fill="#F0F0F0"
              />
              <path
                d="M23.25 27C24.4926 27 25.5 25.9926 25.5 24.75C25.5 23.5074 24.4926 22.5 23.25 22.5C22.0074 22.5 21 23.5074 21 24.75C21 25.9926 22.0074 27 23.25 27Z"
                fill="#F0F0F0"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.559099 0.559099C0.917199 0.201108 1.40282 0 1.90917 0C2.41553 0 2.90115 0.201108 3.25925 0.559099L10.0115 7.31138L16.7638 0.559099C17.124 0.211254 17.6063 0.0187787 18.107 0.0231296C18.6077 0.0274804 19.0866 0.228309 19.4407 0.582361C19.7947 0.936413 19.9956 1.41536 19.9999 1.91605C20.0043 2.41673 19.8118 2.8991 19.464 3.25925L12.7117 10.0115L19.464 16.7638C19.8118 17.124 20.0043 17.6063 19.9999 18.107C19.9956 18.6077 19.7947 19.0866 19.4407 19.4407C19.0866 19.7947 18.6077 19.9956 18.107 19.9999C17.6063 20.0043 17.124 19.8118 16.7638 19.464L10.0115 12.7117L3.25925 19.464C2.8991 19.8118 2.41673 20.0043 1.91605 19.9999C1.41536 19.9956 0.936413 19.7947 0.582361 19.4407C0.228309 19.0866 0.0274804 18.6077 0.0231296 18.107C0.0187787 17.6063 0.211254 17.124 0.559099 16.7638L7.31138 10.0115L0.559099 3.25925C0.201108 2.90115 0 2.41553 0 1.90917C0 1.40282 0.201108 0.917199 0.559099 0.559099Z"
                fill="#F0F0F0"
              />
            </svg>
          )}
        </div>
        {/*numero de productos que estan en el carro */}
        {!cartOpen && (
          <div className={styles.productsNumber}>{productsLength}</div>
        )}
      </div>

      {cartItems && cartOpen && (
        <div className={styles.cart}>
          <h2>Tu carrito</h2>
          {Errors.map((error, i) => (
            <div className="bg-red-500 p-2 text-white" key={i}>
              {error}
            </div>
          ))}

          {cartItems.length === 0 ? (
            <p className="ml-36 font-font-semibold">Tu carrito esta vacio</p>
          ) : (
            <div className={styles.productsContainer}>
              {cartItems.map((item, i) => (
                <ItemCart
                  key={i}
                  item={item}
                  handleAmountChange={handleAmountChange} 
                />
              ))}
              <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <select
                    {...register("cliente", ClienteRequired)}
                    onChange={(e) => setValue("cliente", e.target.value)}
                    className="w-full bg-slate-700 border-0 border-b-2 border-blue-700 text-white px-4 py-2 my-2"
                  >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente._id} value={cliente._id}>
                        {cliente.nombre_cliente}
                      </option>
                    ))}
                  </select>
                  {errors.cliente && (
                    <p className="text-red-500">{errors.cliente.message}</p>
                  )}
                  <input
                    type="number"
                    {...register("descuento", discountValidations)}
                    placeholder="Descuento (%)"
                    className="w-full bg-slate-700 border-0 border-b-2 border-blue-700 text-white px-4 py-2 my-2"
                  />

                  {errors.descuento && (
                    <p className="text-red-500">{errors.descuento.message}</p>
                  )}
                </div>
                {buttonHidden ? (
                  <div className="flex justify-center items-center">
                    <ClipLoader
                      css={css`
                        display: block;
                        margin: 0 auto;
                        border-color: red;
                      `}
                      size={35}
                      color={"#123abc"}
                      loading={buttonHidden}
                    />
                    <p className="ml-2 text-white">Enviando...</p>
                  </div>
                ) : (
                  <button
                    className="px-5 py-1 mb-4 text-sm text-withe font-semibold rounded-full border  border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent shadow-lg shadow-zinc-300/30 d ml-40 "
                    type="submit"
                  >
                    Enviar
                  </button>
                )}
              </form>
            </div>
          )}

          <h2 className={styles.total}>Total: ${totalCartTest.toLocaleString()}</h2>
        </div>
      )}
    </div>
  );
};

export default Cart;
