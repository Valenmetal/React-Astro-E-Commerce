import React, { useState, useEffect } from "react";
import data from "/products.json";
import { motion, AnimatePresence } from "framer-motion";
import { Orbit } from "@uiball/loaders";

export default function Products() {
   const [search, setSearch] = useState("");
   const [products, setProducts] = useState([]);
   const [itemsQuantity, setItemsQuantity] = useState(
      JSON.parse(localStorage.getItem("itemsQuantity") || 8)
   );
   const [visibility, setVisibility] = useState(true);
   const [loading, setLoading] = useState(false);

   const fetchData = async () => {
      const response = await fetch("products.json");
      const json = await response.json();
      setProducts(json);
      setLoading(true);
   };

   useEffect(() => {
      fetchData();
   }, []);

   /* useEffect to dissapear "show more" btn while there is no more products to show */
   let filtered = [];
   useEffect(() => {
      filtered = products.filter((val) =>
         val.name.toLowerCase().includes(search.toLowerCase())
      );

      if (itemsQuantity >= filtered.length) {
         setVisibility(false);
      } else if (filtered.length <= 8 && filtered.length >= 0) {
         setVisibility(false);
      } else {
         setVisibility(true);
      }
   }, [search, itemsQuantity, products]);

   /* useEffect to dissapear "show more" btn after 30s */
   /* useEffect(() => {
      localStorage.setItem("itemsQuantity", itemsQuantity);

      const timeout = setTimeout(() => {
         setItemsQuantity(8);
      }, 30000);

      return () => clearTimeout(timeout);
   }, [itemsQuantity]); */

   /* category sorting btn handler */
   const sortCategory = (category) => {
      let inCategory = data.filter((prod) => prod.category === category);
      setVisibility(false);
      setProducts(inCategory);
      setItemsQuantity(inCategory.length);
   };

   return (
      <>
         <div className="product-container">
            <h2 className="h2_products" id="products">
               Productos
            </h2>
            <div className="search_bar_container">
               <div className="searchBar">
                  <input
                     aria-label="Escribir Producto"
                     onChange={(e) => {
                        setSearch(e.target.value);
                     }}
                     id="searchQueryInput"
                     type="text"
                     name="searchQueryInput"
                     placeholder="Buscar"
                  />

                  <button
                     aria-label="Buscar"
                     id="searchQuerySubmit"
                     type="submit"
                     name="searchQuerySubmit">
                     <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
                        <path
                           fill="#666666"
                           d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                        />
                     </svg>
                  </button>
               </div>
            </div>

            {/* categorias categorias categorias*/}
            <div className="categories-container">
               <button
                  aria-label="Todos"
                  className="category-btn"
                  onClick={() => {
                     setProducts(data);
                     setVisibility(true);
                     setItemsQuantity(8);
                  }}>
                  Todos
               </button>
               <button
                  aria-label="Chapas"
                  className="category-btn"
                  onClick={() => sortCategory("chapas")}>
                  Chapas
               </button>

               <button
                  aria-label="Zingueria"
                  className="category-btn"
                  onClick={() => sortCategory("zingueria")}>
                  Zingueria
               </button>

               <button
                  aria-label="Construccion en seco"
                  className="category-btn"
                  onClick={() => sortCategory("seco")}>
                  Construccion en seco
               </button>

               <button
                  aria-label="Selladores"
                  className="category-btn"
                  onClick={() => sortCategory("selladores")}>
                  Selladores
               </button>
               <button
                  aria-label="Aislantes"
                  className="category-btn"
                  onClick={() => sortCategory("aislantes")}>
                  Aislantes
               </button>
               <button
                  aria-label="Otros"
                  className="category-btn"
                  onClick={() => sortCategory("otros")}>
                  Otros
               </button>
            </div>

            {loading ? (
               <>
                  <motion.ul className="link-card-grid">
                     {products
                        .filter((val) =>
                           val.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .slice(0, itemsQuantity)
                        .map((val, id) => (
                           <AnimatePresence key={id}>
                              <motion.li
                                 layout
                                 initial={{ opacity: 0 }}
                                 transition={{
                                    opacity: {
                                       duration: 1,
                                       ease: [0.88, 0.32, 1, 0.88],
                                    },
                                    y: {
                                       duration: 1,
                                       ease: [0.12, 0.98, 0.67, 0.96],
                                    },
                                 }}
                                 whileInView={{ opacity: 1, y: 70 }}
                                 key={val.id}
                                 className="link-card">
                                 <a
                                    href={`/React-Astro-E-Commerce/product-details/${val.id}`}>
                                    <h3>{val.name}</h3>
                                 </a>
                                 <a
                                    href={`/React-Astro-E-Commerce/product-details/${val.id}`}>
                                    <img src={val.src} alt={val.name} />
                                 </a>
                                 <p>{val.description}</p>
                              </motion.li>
                           </AnimatePresence>
                        ))}
                  </motion.ul>

                  {visibility ? (
                     <button
                        aria-label="Mostrar Mas"
                        onClick={() => {
                           setItemsQuantity(itemsQuantity + 8);

                           if (itemsQuantity >= filtered.length - 8) {
                              setVisibility(false);
                           }
                        }}
                        className="show-more">
                        <span className="text">Ver Mas</span>
                        <span>&#8595;</span>
                     </button>
                  ) : (
                     <></>
                  )}
               </>
            ) : (
               /* Loader */
               <div className="loader">
                  <Orbit size={35} speed={1.5} color="white" />
               </div>
            )}
         </div>
      </>
   );
}
