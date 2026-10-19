/* ==========================================================================
   1. VARIABLES GLOBALES Y SELECCIÓN DE ELEMENTOS
   ========================================================================== */

// --- Comunes ---
const header = document.querySelector('.header');
const cartOverlay = document.querySelector('.cart-overlay');
const botonWhatsapp = document.getElementById('btn-whatsapp');

// --- Carrito ---
const cartBtn = document.querySelector('.cart-btn'); 
const closeCartBtn = document.querySelector('.close-cart');
const cartSidebar = document.querySelector('.cart-sidebar');

// --- Buscador ---
const searchBtn = document.querySelector('.search-btn');
const searchContainer = document.querySelector('.search-bar-container');
const closeSearchBtn = document.querySelector('.close-search');
const searchInput = document.querySelector('.search-input');
const submitSearchBtn = document.querySelector('.submit-search');

// --- Menú Móvil ---
const hamburgerBtn = document.querySelector('.hamburger-btn');
const mobileSidebar = document.querySelector('.mobile-sidebar');
const closeMenuBtn = document.querySelector('.close-menu');
const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
const mobileDropdownContent = document.querySelector('.mobile-dropdown-content');
const searchBtnMobile = document.querySelector('.search-btn-mobile');
const loginBtnMobile = document.querySelector('.login-btn-mobile');


/* ==========================================================================
   2. FUNCIONES AUXILIARES (HELPERS)
   ========================================================================== */

// Bloquea el scroll del body y calcula el ancho del scrollbar para evitar saltos
const activarBloqueoScroll = () => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = 'hidden'; 
};

// Libera el scroll de la página al cerrar componentes
const desactivarBloqueoScroll = () => {
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0px';
};

// Escoba: Cierra masivamente cualquier panel y limpia los datos
const cerrarTodosLosModales = () => {
    // 1. Ocultar todos los paneles 
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (searchContainer) searchContainer.classList.remove('active');
    if (mobileSidebar) mobileSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('active');
    
    // Regresamos el WhatsApp a la pantalla con un pequeño retraso
    const botonWP = document.getElementById('btn-whatsapp');
    if (botonWP) {
        setTimeout(() => {
            botonWP.classList.remove('whatsapp-oculto');
        }, 500);
    }

    // 2. Devolver el scroll a la normalidad
    desactivarBloqueoScroll();
};

/* ==========================================================================
   3. LÓGICA DE COMPONENTES
   ========================================================================== */

// ------------------------------------
// CABECERA (Efecto Scroll)
// ------------------------------------
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ------------------------------------
// MENÚ MÓVIL (Hamburguesa)
// ------------------------------------
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        activarBloqueoScroll();
        mobileSidebar.classList.add('open');
        cartOverlay.classList.add('active'); 
    });
}

// Acordeón para "Categorías" en el celular
if (mobileDropdownToggle) {
    mobileDropdownToggle.addEventListener('click', () => {
        mobileDropdownContent.classList.toggle('open');
        
        // Girar la flechita
        const icon = mobileDropdownToggle.querySelector('svg');
        if (icon) {
            if (mobileDropdownContent.classList.contains('open')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0)';
            }
            icon.style.transition = 'transform 0.3s ease';
        }
    });
}

if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', cerrarTodosLosModales);
}

// Abrir buscador desde dentro del menú móvil
if (searchBtnMobile) {
    searchBtnMobile.addEventListener('click', () => {
        cerrarTodosLosModales(); // Barremos la pantalla
        activarBloqueoScroll();
        searchContainer.classList.add('active');
        cartOverlay.classList.add('active'); 
        
        setTimeout(() => {
            if (searchInput) searchInput.focus();
        }, 400); 
    });
}

// Abrir login desde dentro del menú móvil
if (loginBtnMobile) {
    loginBtnMobile.addEventListener('click', () => {
        // Enviamos al usuario a su cuenta
        window.location.href = '/mi-cuenta.html';
    });
}



// ------------------------------------
// CARRITO DE COMPRAS
// ------------------------------------
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        activarBloqueoScroll();
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        
        // Ocultamos el WhatsApp en tiempo real
        const botonWP = document.getElementById('btn-whatsapp');
        if (botonWP) botonWP.classList.add('whatsapp-oculto');
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', cerrarTodosLosModales);
}

// ------------------------------------
// BUSCADOR DESPLEGABLE
// ------------------------------------
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        activarBloqueoScroll();
        searchContainer.classList.add('active');
        cartOverlay.classList.add('active'); 
        
        setTimeout(() => {
            if (searchInput) searchInput.focus();
        }, 400); 
    });
}

const realizarBusqueda = () => {
    if (searchInput) {
        const textoBuscado = searchInput.value.trim().toLowerCase();
        if (textoBuscado !== "") {
            // Cerramos los paneles para que no estorben
            cerrarTodosLosModales(); 
            // Redirigimos al catálogo con la palabra clave
            window.location.href = `/catalogo.html?busqueda=${encodeURIComponent(textoBuscado)}`;
        }
    }
};

if (submitSearchBtn) {
    submitSearchBtn.addEventListener('click', realizarBusqueda);
}

if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            realizarBusqueda();
        }
    });
}

if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', cerrarTodosLosModales);
}


/* ==========================================================================
   4. EVENTOS GLOBALES
   ========================================================================== */

// Cierra cualquier modal haciendo clic en el fondo oscuro
if (cartOverlay) {
    cartOverlay.addEventListener('click', cerrarTodosLosModales);
}

/* ==================================
   LÓGICA DE LA PÁGINA DE PRODUCTO
   ================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Funcionalidad de las Tallas (Cambiar el color al hacer clic)
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // 2. Funcionalidad de la Cantidad (+ y -)
    const minusBtn = document.querySelector('.minus-btn');
    const plusBtn = document.querySelector('.plus-btn');
    const qtyInput = document.querySelector('.qty-input');

    if (plusBtn && minusBtn && qtyInput) {
        plusBtn.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
        });
        
        minusBtn.addEventListener('click', () => {
            if (parseInt(qtyInput.value) > 1) { 
                qtyInput.value = parseInt(qtyInput.value) - 1;
            }
        });
    }

    /* ==================================
       MAGIA DE MEMORIA (LOCALSTORAGE) Y CALCULADORA
       ================================== */
    function actualizarTotal() {
        const cartItems = document.querySelectorAll('.cart-item');
        const cartFooter = document.querySelector('.cart-footer');
        let total = 0;
        let cantidadTotal = 0; // Sumamos las cantidades de forma independiente

        // Recorremos todos los productos para sumar sus precios
        cartItems.forEach(item => {
            const priceElement = item.querySelector('.cart-item-price').textContent;
            const qtyElement = item.querySelector('.cart-item-qty').textContent;
            
            // MAGIA NUEVA: Expresión regular que limpia letras y espacios. Extrae SOLO los números y puntos.
            let precio = parseFloat(priceElement.replace(/[^\d.]/g, ''));
            let cantidad = parseInt(qtyElement.replace(/[^\d]/g, ''));
            
            if (!isNaN(precio) && !isNaN(cantidad)) {
                total += (precio * cantidad);
                cantidadTotal += cantidad;
            }
        });

        // 1. Actualizamos el texto en la pantalla
        const totalPriceElement = document.querySelector('.total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = `S/ ${total.toFixed(2)}`;
        }

        // 2. Mostramos u ocultamos el footer del carrito (Botón FINALIZAR COMPRA)
        if (cartFooter) {
            if (total > 0) {
                cartFooter.style.display = 'block';
            } else {
                cartFooter.style.display = 'none';
            }
        }

        // 3. Actualizamos todos los globitos rojos
        document.querySelectorAll('.cart-count').forEach(badge => {
            badge.textContent = cantidadTotal;
            if (cantidadTotal === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'flex'; 
            }
        });
    }

    function guardarCarrito() {
        const cartContent = document.querySelector('.cart-content');
        if (cartContent) {
            // Ya no guardamos el contador. Solo guardamos las tarjetas de producto.
            localStorage.setItem('catysCarritoHTML', cartContent.innerHTML);
        }
    }

    function cargarCarrito() {
        const cartContentGuardado = localStorage.getItem('catysCarritoHTML');
        const cartContent = document.querySelector('.cart-content');

        // Si hay algo guardado en la memoria, lo pegamos en la pantalla
        if (cartContentGuardado && cartContent) {
            cartContent.innerHTML = cartContentGuardado;
        }
        
        // Ejecutamos la calculadora de inmediato para que procese el total y los globitos
        actualizarTotal();
    }

    // ¡Lo primero que hacemos al cargar CUALQUIER página es revisar la memoria!
    cargarCarrito();


    // 3. Funcionalidad: AÑADIR AL CARRITO
    const btnAddToCart = document.querySelector('.btn-add-to-cart');
    const cartContent = document.querySelector('.cart-content');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartSidebar = document.querySelector('.cart-sidebar');

    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            const title = document.querySelector('.single-product-title').innerText;
            const price = document.querySelector('.single-new-price').innerText;
            const imageSrc = document.querySelector('.main-product-stage img').src;
            const size = document.querySelector('.size-btn.active').innerText;
            const quantity = parseInt(document.querySelector('.qty-input').value);

            const emptyState = document.querySelector('.empty-cart-state');
            if (emptyState) {
                emptyState.style.display = 'none';
            }

            // Lógica Inteligente para productos duplicados
            let productoExiste = false;
            const itemsEnCarrito = document.querySelectorAll('.cart-item');

            itemsEnCarrito.forEach(item => {
                const tituloItem = item.querySelector('h4').innerText;
                const tallaItem = item.querySelector('.cart-item-size').innerText; 

                if (tituloItem === title && tallaItem === `Talla: ${size}`) {
                    const qtyElemento = item.querySelector('.cart-item-qty');
                    let cantidadActual = parseInt(qtyElemento.textContent.replace(/[^\d]/g, ''));
                    qtyElemento.textContent = `Cant: ${cantidadActual + quantity}`;
                    productoExiste = true; 
                }
            });

            if (!productoExiste) {
                const cartItemHTML = `
                    <div class="cart-item">
                        <img src="${imageSrc}" alt="${title}" class="cart-item-img">
                        <div class="cart-item-info">
                            <h4>${title}</h4>
                            <p class="cart-item-size">Talla: ${size}</p>
                            <p class="cart-item-price">${price}</p>
                            <p class="cart-item-qty">Cant: ${quantity}</p>
                        </div>
                        <button class="remove-item" aria-label="Eliminar producto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                `;
                cartContent.insertAdjacentHTML('beforeend', cartItemHTML);
            }
            
            cartOverlay.classList.add('active');
            cartSidebar.classList.add('open');
            
            const botonWP = document.getElementById('btn-whatsapp');
            if (botonWP) botonWP.classList.add('whatsapp-oculto');

            document.querySelector('.qty-input').value = 1;

            // Delegamos todo el trabajo a la calculadora y la guardamos
            actualizarTotal();
            guardarCarrito();
        });
    }

    // 4. Funcionalidad: ELIMINAR DEL CARRITO
    if (cartContent) {
        cartContent.addEventListener('click', (e) => {
            const btnEliminar = e.target.closest('.remove-item');
            
            if (btnEliminar) {
                const cartItem = btnEliminar.closest('.cart-item');
                cartItem.remove();

                const remainingItems = cartContent.querySelectorAll('.cart-item');
                if (remainingItems.length === 0) {
                    cartContent.innerHTML = `
                        <div class="empty-cart-state" style="display: flex;">
                            <h3 class="empty-title">TU CARRITO ESTÁ VACÍO</h3>
                            <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#cccccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <p class="empty-subtitle">¡Empecemos a comprar!</p>
                            <button class="btn-start-shopping" onclick="document.querySelector('.close-cart').click()">EMPIEZA A COMPRAR</button>
                        </div>
                    `;
                }

                // La calculadora y la memoria hacen el resto
                actualizarTotal(); 
                guardarCarrito();
            }
        });
    }

}); // <---- ¡ESTA ERA LA LLAVE QUE NOS FALTABA!

// ----------------------------------------------------
// REDIRECCIÓN AL CHECKOUT (DESDE EL CARRITO)
// ----------------------------------------------------
const btnCheckout = document.querySelector('.btn-checkout');

if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
        // Le avisamos al checkout que lea la memoria del carrito
        localStorage.setItem('catysModoCheckout', 'carrito'); 
        window.location.href = '/checkout.html';
    });
}

// ----------------------------------------------------
// Funcionalidad: COMPRAR AHORA (Flujo Directo y Aislado)
// ----------------------------------------------------
const btnBuyNow = document.querySelector('.btn-buy-now');

if (btnBuyNow) {
    btnBuyNow.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        const title = document.querySelector('.single-product-title').innerText;
        const price = document.querySelector('.single-new-price').innerText;
        const imageSrc = document.querySelector('.main-product-stage img').src;
        const size = document.querySelector('.size-btn.active').innerText;
        const quantity = parseInt(document.querySelector('.qty-input').value);

        const cartItemHTML = `
            <div class="checkout-item">
                <div class="item-img-wrapper">
                    <img src="${imageSrc}" alt="${title}">
                    <span class="item-qty-badge">${quantity}</span>
                </div>
                <div class="item-details">
                    <h4>${title}</h4>
                    <p>Talla: ${size}</p>
                </div>
                <div class="item-price">${price}</div>
            </div>
        `;

        // MAGIA: Lo guardamos en una memoria SEPARADA
        localStorage.setItem('catysCompraRapida', cartItemHTML);
        // Le avisamos al checkout que lea esta memoria rápida
        localStorage.setItem('catysModoCheckout', 'rapido'); 
        
        window.location.href = '/checkout.html';
    });
}

/* ==========================================================================
   5. LÓGICA DEL CATÁLOGO DINÁMICO Y BUSCADOR
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    
    function cargarCatalogo() {
        // 1. Buscamos el contenedor y el título
        const contenedorProductos = document.getElementById('contenedor-productos');
        const tituloCategoria = document.getElementById('titulo-categoria');

        // Si no estamos en el catálogo, abortamos
        if (!contenedorProductos) return;

        // 2. Leemos la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        const categoriaSolicitada = parametrosURL.get('categoria');
        const busquedaSolicitada = parametrosURL.get('busqueda'); 
        const ofertasSolicitadas = parametrosURL.get('ofertas'); 
        const etiquetaSolicitada = parametrosURL.get('etiqueta'); 

        if (typeof baseDeDatosProductos === 'undefined') return;

        let productosFiltrados = [];

        // 3. ¿Cómo llegó el cliente aquí?
        if (ofertasSolicitadas === 'true') {
            tituloCategoria.innerHTML = "SÚPER OFERTAS";
            productosFiltrados = baseDeDatosProductos.filter(producto => producto.precioAnterior !== undefined && producto.precioAnterior !== "");

        } else if (categoriaSolicitada) {
            tituloCategoria.innerHTML = categoriaSolicitada.toUpperCase();
            productosFiltrados = baseDeDatosProductos.filter(producto => producto.categoria.toLowerCase() === categoriaSolicitada.toLowerCase());

        } else if (etiquetaSolicitada) {
            tituloCategoria.innerHTML = etiquetaSolicitada.toUpperCase();
            productosFiltrados = baseDeDatosProductos.filter(producto => {
                return producto.etiquetas && producto.etiquetas.some(tag => tag.toLowerCase() === etiquetaSolicitada.toLowerCase());
            });

        } else if (busquedaSolicitada) {
            tituloCategoria.innerHTML = `RESULTADOS PARA: <span class="resaltado-busqueda">"${busquedaSolicitada.toUpperCase()}"</span>`;
            
            const palabrasBuscadas = busquedaSolicitada.toLowerCase().split(' ').filter(p => p.trim() !== '');

            productosFiltrados = baseDeDatosProductos.filter(producto => {
                const textoCompletoProducto = `
                    ${producto.titulo.toLowerCase()} 
                    ${producto.categoria.toLowerCase()} 
                    ${producto.etiquetas ? producto.etiquetas.join(' ').toLowerCase() : ''} 
                    ${(producto.descripcion || '').toLowerCase()}
                `;
                return palabrasBuscadas.every(palabra => textoCompletoProducto.includes(palabra));
            });

        } else {
            tituloCategoria.innerHTML = "TODOS LOS PRODUCTOS";
            productosFiltrados = baseDeDatosProductos; 
        }

        // 4. Si la búsqueda no dio resultados
        if (productosFiltrados.length === 0) {
            contenedorProductos.innerHTML = `<p style='text-align:center; grid-column: 1/-1; padding: 40px; color: #777;'>Ups, no encontramos nada relacionado con tu búsqueda. ¡Intenta con otra palabra!</p>`;
            return;
        }

        // 5. Dibujamos las tarjetas 
        let htmlProductos = '';
        productosFiltrados.forEach(producto => {
            const htmlPrecioAnterior = producto.precioAnterior ? `<span class="old-price">${producto.precioAnterior}</span>` : '';
            const htmlEtiqueta = producto.etiqueta ? `<span class="badge-oferta">${producto.etiqueta}</span>` : '';

            htmlProductos += `
                <a href="${producto.url}" class="product-card">
                    <div class="product-image">
                        <img src="${producto.imagen}" alt="${producto.titulo}">
                        ${htmlEtiqueta}
                    </div>
                    <div class="product-info">
                        <h3>${producto.titulo}</h3>
                        <div class="product-pricing">
                            ${htmlPrecioAnterior}
                            <span class="new-price">${producto.precioNuevo}</span>
                        </div>
                    </div>
                </a>
            `;
        });

        contenedorProductos.innerHTML = htmlProductos;
    }

    cargarCatalogo();
});

/* ==========================================================================
   6. LÓGICA DE LA PÁGINA ÚNICA DE PRODUCTO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    function cargarProductoDetalle() {
        const tituloElemento = document.querySelector('.single-product-title');
        if (!tituloElemento) return; 

        const parametrosURL = new URLSearchParams(window.location.search);
        const idSolicitado = parseInt(parametrosURL.get('id'));

        if (!idSolicitado) {
            tituloElemento.innerText = "Producto no encontrado";
            return;
        }

        const productoEncontrado = baseDeDatosProductos.find(producto => producto.id === idSolicitado);

        if (!productoEncontrado) {
            tituloElemento.innerText = "Este producto ya no está disponible";
            document.querySelector('.single-new-price').innerText = "";
            return;
        }

        // 1. Textos principales
        tituloElemento.innerText = productoEncontrado.titulo;
        document.querySelector('.single-new-price').innerText = productoEncontrado.precioNuevo;
        
        // 2. Imágenes (Principal y miniatura)
        const imagenPrincipal = document.getElementById('dinamico-imagen-principal');
        const imagenMiniatura = document.getElementById('dinamico-miniatura');
        if (imagenPrincipal) {
            imagenPrincipal.src = productoEncontrado.imagen;
            imagenPrincipal.alt = productoEncontrado.titulo;
        }
        if (imagenMiniatura) {
            imagenMiniatura.src = productoEncontrado.imagen;
        }

        // 3. Ofertas y precios antiguos
        const precioAnteriorElemento = document.querySelector('.single-old-price');
        const etiquetaOferta = document.getElementById('dinamico-etiqueta');
        
        if (productoEncontrado.precioAnterior) {
            if(precioAnteriorElemento) {
                precioAnteriorElemento.innerText = productoEncontrado.precioAnterior;
                precioAnteriorElemento.style.display = 'inline-block';
            }
            if(etiquetaOferta && productoEncontrado.etiqueta) {
                etiquetaOferta.innerText = productoEncontrado.etiqueta;
                etiquetaOferta.style.display = 'block';
            }
        }

        // 4. Descripciones y Materiales
        const descripcionElemento = document.getElementById('dinamico-descripcion');
        const materialElemento = document.getElementById('dinamico-material');
        if (descripcionElemento) descripcionElemento.innerText = productoEncontrado.descripcion || "Descripción no disponible.";
        if (materialElemento) materialElemento.innerText = productoEncontrado.material || "No especificado.";

        // 5. Migas de pan (Breadcrumbs)
        const breadCategoriaTexto = document.getElementById('dinamico-categoria-texto');
        const breadCategoriaLink = document.getElementById('dinamico-categoria-link');
        const breadTitulo = document.getElementById('dinamico-titulo-bread');
        
        if (breadCategoriaTexto && breadCategoriaLink && breadTitulo) {
            let catCapitalizada = productoEncontrado.categoria.charAt(0).toUpperCase() + productoEncontrado.categoria.slice(1);
            breadCategoriaTexto.innerText = catCapitalizada;
            breadCategoriaLink.href = `/catalogo.html?categoria=${productoEncontrado.categoria}`;
            breadTitulo.innerText = productoEncontrado.titulo;
        }

        // 6. Productos Relacionados
        const contenedorRelacionados = document.getElementById('contenedor-relacionados');
        
        if (contenedorRelacionados) {
            let relacionados = baseDeDatosProductos.filter(prod => 
                prod.categoria === productoEncontrado.categoria && prod.id !== productoEncontrado.id
            );

            relacionados = relacionados.slice(0, 4);

            if (relacionados.length > 0) {
                let htmlRelacionados = '';
                relacionados.forEach(prod => {
                    const htmlPrecioAnterior = prod.precioAnterior ? `<span class="old-price">${prod.precioAnterior}</span>` : '';
                    const htmlEtiqueta = prod.etiqueta ? `<span class="badge-oferta">${prod.etiqueta}</span>` : '';

                    htmlRelacionados += `
                        <a href="${prod.url}" class="product-card">
                            <div class="product-image">
                                <img src="${prod.imagen}" alt="${prod.titulo}">
                                ${htmlEtiqueta}
                            </div>
                            <div class="product-info">
                                <h3>${prod.titulo}</h3>
                                <div class="product-pricing">
                                    ${htmlPrecioAnterior}
                                    <span class="new-price">${prod.precioNuevo}</span>
                                </div>
                            </div>
                        </a>
                    `;
                });
                contenedorRelacionados.innerHTML = htmlRelacionados;
            } else {
                contenedorRelacionados.parentElement.style.display = 'none';
            }
        }

    }
    cargarProductoDetalle();
});

/* ==========================================================================
   7. LÓGICA DE PRODUCTOS DESTACADOS (HOME)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    
    function cargarProductosDestacados() {
        const contenedorDestacados = document.getElementById('contenedor-destacados');
        if (!contenedorDestacados) return;

        const productosHome = baseDeDatosProductos.filter(producto => producto.destacado === true);
        let htmlDestacados = '';

        productosHome.forEach(producto => {
            const htmlPrecioAnterior = producto.precioAnterior ? `<span class="old-price">${producto.precioAnterior}</span>` : '';
            const htmlEtiqueta = producto.etiqueta ? `<span class="badge-oferta">${producto.etiqueta}</span>` : '';

            htmlDestacados += `
                <a href="${producto.url}" class="product-card">
                    <div class="product-image">
                        <img src="${producto.imagen}" alt="${producto.titulo}">
                        ${htmlEtiqueta}
                    </div>
                    <div class="product-info">
                        <h3>${producto.titulo}</h3>
                        <div class="product-pricing">
                            ${htmlPrecioAnterior}
                            <span class="new-price">${producto.precioNuevo}</span>
                        </div>
                    </div>
                </a>
            `;
        });

        contenedorDestacados.innerHTML = htmlDestacados;
    }
    cargarProductosDestacados();
});

/* ==========================================================================
   8. REDIRECCIÓN DEL CARRITO VACÍO
   ========================================================================== */
document.addEventListener('click', (e) => {
    const btnEmpezar = e.target.closest('.btn-start-shopping');
    
    if (btnEmpezar) {
        e.preventDefault(); 
        cerrarTodosLosModales();
        setTimeout(() => {
            window.location.href = '/#contenedor-destacados';
        }, 300);
    }
});

/* ==========================================================================
   9. LÓGICA DEL BANNER DINÁMICO (Cross-Fade Profesional)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    
    const sectionBanner = document.getElementById('banner-principal');

    if (typeof baseDeDatosBanners !== 'undefined' && sectionBanner && baseDeDatosBanners.length > 1) {
        
        let bannerActual = 0;
        const capaTransicion = document.createElement('div');
        capaTransicion.className = 'banner-capa-transicion';
        sectionBanner.appendChild(capaTransicion);

        sectionBanner.style.backgroundImage = `url('${baseDeDatosBanners[0]}')`;

        setInterval(() => {
            let siguienteBanner = bannerActual + 1;
            if (siguienteBanner >= baseDeDatosBanners.length) {
                siguienteBanner = 0;
            }

            capaTransicion.style.backgroundImage = `url('${baseDeDatosBanners[siguienteBanner]}')`;
            capaTransicion.style.opacity = '1';

            setTimeout(() => {
                sectionBanner.style.backgroundImage = `url('${baseDeDatosBanners[siguienteBanner]}')`;
                capaTransicion.style.transition = 'none'; 
                capaTransicion.style.opacity = '0'; 

                setTimeout(() => {
                    capaTransicion.style.transition = 'opacity 1s ease-in-out';
                }, 50);

                bannerActual = siguienteBanner;
            }, 1000); 

        }, 5000); 
        
    } else if (typeof baseDeDatosBanners !== 'undefined' && sectionBanner && baseDeDatosBanners.length === 1) {
        sectionBanner.style.backgroundImage = `url('${baseDeDatosBanners[0]}')`;
    }
});

/* ==========================================================================
   10. LÓGICA DE LA PÁGINA "MI CUENTA" (DISEÑO MINIMALISTA)
   ========================================================================== */

window.cambiarPestana = function(vista) {
    document.getElementById('vista-login').style.display = 'none';
    document.getElementById('vista-registro').style.display = 'none';
    
    document.getElementById('tab-login').classList.remove('active');
    document.getElementById('tab-registro').classList.remove('active');
    
    if(vista === 'login') {
        document.getElementById('vista-login').style.display = 'block';
        document.getElementById('tab-login').classList.add('active');
    } else {
        document.getElementById('vista-registro').style.display = 'block';
        document.getElementById('tab-registro').classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const btnOlvidePass = document.querySelector('.forgot-pass-container a');
    if (btnOlvidePass) {
        btnOlvidePass.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof mostrarAlerta === "function") {
                mostrarAlerta('success', 'Te hemos enviado un correo con las instrucciones para recuperar tu contraseña.');
            } else {
                alert('Te hemos enviado un correo para recuperar tu contraseña.');
            }
        });
    }
});