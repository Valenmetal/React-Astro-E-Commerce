import React from 'react'
import { useState, useEffect } from 'react';
/* import { Orbit } from '@uiball/loaders'; */


function Products({ productList }) {

    return (<>
        <h2 className="h2_products" >Productos</h2>
        <ul className="link-card-grid">
            {productList.map((prod, id) => {
                return (
                    <li key={id} className="link-card">
                        <div className="link">
                            <a href={`/product-details/${prod.id}`}>
                                <h3>
                                    {prod.name}
                                </h3>
                                <img src={prod.src} alt="Product Image" />
                            </a>
                            <p>
                                {prod.description}
                            </p>
                        </div>
                    </li>
                )
            })}</ul>
    </>
    )
}


export default Products