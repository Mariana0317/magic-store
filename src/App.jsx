import React, { useState, useEffect } from "react";
import { commerce } from "./lib/commerce";
import { Products, Navbar, Cart, Checkout } from "./components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  const [products, setProducts] = useState([]); //creo el estado para los productos
  const [cart, setCart] = useState({}); //este estado es para agregar al carrito y va a ser un objeto
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProducts = async () => {
    //el fetch para traer los todos los productos de la api
    const { data } = await commerce.products.list();

    setProducts(data);
  };

  //este fetch es para ver que hay en el carrito
  const fetchCart = async () => {
    const cart = await commerce.cart.retrieve(); //la respuesta es el carrito response = cart le cambio el nombre  a la variable
    setCart(cart); //llamamos la funcion y actualizamos el carrito otra forma de hacerlo miniuto 54:39
  };

  //funcion para que se agregue los pproductos al carrito
  const handleAddToCart = async (productId, quanitity) => {
    //dos parametros el primero es el id del producto y el segundo la cantidad de productos que tenemos en el carro
    const { cart } = await commerce.cart.add(productId, quanitity);
    setCart(cart);
  }; //esta funcion la vamos a usar en el componente product singular asi que lo pasamos por props

  //funcion para actualizar la cantidad del carrito
  const handleUpdateCartQty = async (productId, quantity) => {
    const response = await commerce.cart.update(productId, { quantity });
    setCart(response.cart);
  };

  //funcion para borrar algo de carrito
  const handleRemoveFromCart = async (productId) => {
    const response = await commerce.cart.remove(productId);
    setCart(response.cart);
  };
  //funcion para eliminar todo del carrito
  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();
    setCart(response.cart);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );

      setOrder(incomingOrder);
      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };

  useEffect(() => {
    //el useefect para que pinte los prductos bien se carga la pagina en el montaje
    fetchProducts();
    fetchCart();
  }, []);

  console.log(cart);
  return (
    <Router>
      <div>
        <Navbar totalItems={cart.total_items} />
        <Switch>
          <Route exact path="/">
            <Products products={products} onAddToCart={handleAddToCart} />
          </Route>
          <Route exact path="/cart">
            <Cart
              cart={cart}
              handleUpdateCartQty={handleUpdateCartQty}
              handleRemoveFromCart={handleRemoveFromCart}
              handleEmptyCart={handleEmptyCart}
            />
          </Route>
          <Route exact path="/checkout">
            <Checkout
              cart={cart}
              order={order}
              onCaptureCheckout={handleCaptureCheckout}
              error={errorMessage}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
