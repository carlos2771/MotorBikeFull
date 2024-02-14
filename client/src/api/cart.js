import { axiosClient } from "./axiosInstance";

export const getProductsRequest = async () => {
    const response = await axiosClient.get("/products");
    return response.data.products;
  };
export const getProductsCartRequest = async () => {
    const response = await axiosClient.get("/products-cart");
    return response.data.productsCart;
  };

export const addItemToCartRequest = async (product) => {
    const response = await axiosClient.post("/products-cart", product).then(({data}))
    return response.data;
  };

export const editItemToCartRequest = async (id,query, amount) => {
    if (query === "del" && amount === 1) {
    const response = await axiosClient.put(`/products-cart/${id}?query=${query}`,{amount});
    return response.data;
    }else {
      const response = await axiosClient.delete(`/products-cart/${id}`)
      return response.data
    }
  };