
import React, { useState, useEffect } from 'react';
/* import { Orbit } from '@uiball/loaders'; */
import data from "../../products.json"
import { motion, AnimatePresence } from "framer-motion"

export default function Products() {

    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [itemsQuantity, setItemsQuantity] = useState(8);
    const [visibility, setVisibility] = useState(true);

    let todo = data;
    let filtered = products;
    let buscado = "";

    useEffect(() => {
        setProducts(data)
    }, [])

    const sortCategory = (category) => {
        let inCategory = data.filter(prod => prod.category === category)
        setVisibility(false)
        setProducts(inCategory)
        setItemsQuantity(inCategory.length)
    }

    return (<>
        <div className='product-container'>
            <h2 className="h2_products" >Productos</h2>
            <div className="search_bar_container">
                <div className="searchBar">

                    <input onChange={(e) => {
                        setSearch(e.target.value)
                        buscado = e.target.value

                        filtered = products.filter(val => val.name.toLowerCase().includes(buscado.toLowerCase()))
                            .slice(0, itemsQuantity)

                        if (itemsQuantity >= products.length - 8) {
                            setVisibility(false);
                        }
                        else if (filtered.length < 8 && filtered.length >= 0) {
                            setVisibility(false);
                        }
                        else {
                            setVisibility(true);
                        }

                    }} id="searchQueryInput" type="text" name="searchQueryInput" placeholder="Buscar" />

                    <button id="searchQuerySubmit" type="submit" name="searchQuerySubmit">
                        <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24"><path fill="#666666" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* categorias categorias categorias*/}
            <div className="categories-container">
                <button className='category-btn' onClick={() => {
                    setProducts(todo)
                    setVisibility(true)
                    setItemsQuantity(8)
                }
                }>
                    Todos
                </button>
                <button className='category-btn' onClick={() => sortCategory("chapas")}>
                    Chapas
                </button>

                <button className='category-btn' onClick={() => sortCategory("canaletas")}>
                    Canaletas
                </button>

                <button className='category-btn' onClick={() => sortCategory("grampas")}>
                    Grampas
                </button>

                <button className='category-btn' onClick={() => sortCategory("sombreros")}>
                    Sombreros
                </button>
                <button className='category-btn' onClick={() => sortCategory("eolicos")}>
                    Eolicos
                </button>
                <button className='category-btn' onClick={() => sortCategory("flexibles")}>
                    Flexibles
                </button>
                <button className='category-btn' onClick={() => sortCategory("ramales")}>
                    Ramales
                </button>
            </div>

            <motion.ul className="link-card-grid">
                {
                    products
                        .filter(val => val.name.toLowerCase().includes(search.toLowerCase()))
                        .slice(0, itemsQuantity)
                        .map((val, id) => (
                            <AnimatePresence key={id}>
                                <motion.li layout
                                    transition={{

                                        opacity: {
                                            duration: 2,
                                            ease: [.12, .98, .67, .96]
                                        },
                                        y: {
                                            duration: 1,
                                            ease: [.12, .98, .67, .96]
                                        }
                                    }}
                                    whileInView={{ opacity: 1, y: 70 }}
                                    key={val.id} className="link-card">


                                    <a href={`/product-details/${val.id}`}>
                                        <h3>
                                            {val.name}
                                        </h3>
                                    </a>
                                    <a href={`/product-details/${val.id}`}>
                                        <img src={val.src} alt="Product Image" />
                                    </a>
                                    <p>
                                        {val.description}
                                    </p>
                                </motion.li>
                            </AnimatePresence>
                        )
                        )
                }
            </motion.ul>

            {visibility ?
                <button onClick={() => {
                    setItemsQuantity(itemsQuantity + 8)
                    if (itemsQuantity >= products.length - 8) {
                        setVisibility(false);
                    }
                }}
                    className='show-more'>
                    <span className="text">Ver Mas</span>
                    <span>&#8595;</span>
                </button>
                :
                <></>}


        </div>

    </>
    )
}
