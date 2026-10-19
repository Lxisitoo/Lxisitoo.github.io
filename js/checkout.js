/* ==================================
   CEREBRO DEL CHECKOUT
   ================================== */
document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------
    // 1. CARGAR PRODUCTOS DE LA MEMORIA
    // ------------------------------------
    function cargarResumenCheckout() {
        const contenedorItems = document.getElementById('checkout-items-container');
        const subtotalElement = document.getElementById('summary-subtotal');
        const totalElement = document.getElementById('summary-total');

        if (!contenedorItems) return; 

        // Preguntamos por qué puerta entró el cliente
        const modoCheckout = localStorage.getItem('catysModoCheckout') || 'carrito';
        let cartContentGuardado = '';

        if (modoCheckout === 'rapido') {
            cartContentGuardado = localStorage.getItem('catysCompraRapida');
        } else {
            cartContentGuardado = localStorage.getItem('catysCarritoHTML');
        }
        
        const mostrarVacio = () => {
            contenedorItems.innerHTML = '<p style="text-align:center; padding:20px; color:#777;">Tu orden está vacía.</p>';
            if(subtotalElement) subtotalElement.innerText = 'S/ 0.00';
            if(totalElement) totalElement.innerText = 'S/ 0.00 PEN';
        };

        if (!cartContentGuardado) {
            mostrarVacio();
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cartContentGuardado;

        let total = 0;
        let htmlCheckout = '';

        if (modoCheckout === 'carrito') {
            const cartItems = tempDiv.querySelectorAll('.cart-item');
            if (cartItems.length === 0) return mostrarVacio();

            cartItems.forEach(item => {
                const imgSrc = item.querySelector('.cart-item-img').src;
                const title = item.querySelector('h4').innerText;
                const sizeText = item.querySelector('.cart-item-size').innerText; 
                const priceText = item.querySelector('.cart-item-price').innerText; 
                const qtyText = item.querySelector('.cart-item-qty').innerText; 

                const quantity = parseInt(qtyText.replace('Cant: ', '').trim());
                const price = parseFloat(priceText.replace('S/', '').replace('PEN', '').trim());

                total += (price * quantity);

                htmlCheckout += `
                    <div class="checkout-item">
                        <div class="item-img-wrapper">
                            <img src="${imgSrc}" alt="${title}">
                            <span class="item-qty-badge">${quantity}</span>
                        </div>
                        <div class="item-details">
                            <h4>${title}</h4>
                            <p>${sizeText}</p>
                        </div>
                        <div class="item-price">S/ ${(price * quantity).toFixed(2)}</div>
                    </div>
                `;
            });
        } 
        else {
            const itemUnico = tempDiv.querySelector('.checkout-item');
            if (!itemUnico) return mostrarVacio();

            const priceText = itemUnico.querySelector('.item-price').innerText;
            const qtyText = itemUnico.querySelector('.item-qty-badge').innerText;
            
            const quantity = parseInt(qtyText);
            const price = parseFloat(priceText.replace('S/', '').replace('PEN', '').trim());

            total = price * quantity;
            
            itemUnico.querySelector('.item-price').innerText = `S/ ${total.toFixed(2)}`;
            htmlCheckout = tempDiv.innerHTML;
        }

        contenedorItems.innerHTML = htmlCheckout;
        if(subtotalElement) subtotalElement.innerText = `S/ ${total.toFixed(2)}`;
        if(totalElement) totalElement.innerText = `S/ ${total.toFixed(2)} PEN`;
    }
    
    // Encendemos la función de carga
    cargarResumenCheckout();


    // ------------------------------------
    // 2. ENVÍO DE DATOS A WHATSAPP (Móvil y PC)
    // ------------------------------------
    const btnDesktop = document.querySelector('.btn-desktop');
    const btnMobile = document.querySelector('.btn-mobile');

    // ------------------------------------
    // FUNCIÓN: ALERTAS PERSONALIZADAS
    // ------------------------------------
    function mostrarAlerta(tipo, mensaje) {
        // 1. Verificamos si ya existe el contenedor de alertas, si no, lo creamos
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // 2. Elegimos el ícono SVG según el tipo de alerta
        let svgIcon = '';
        if (tipo === 'error') { // La cruz (X)
            svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        } else if (tipo === 'warning') { // Signo de admiración (!)
            svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        } else if (tipo === 'success') { // El check de éxito
            svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        }

        // 3. Armamos la caja en HTML
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon-wrapper">
                <div class="toast-icon-inner">${svgIcon}</div>
            </div>
            <div class="toast-message">${mensaje}</div>
        `;

        // 4. La metemos a la pantalla
        container.appendChild(toast);

        // 5. Animación de entrada
        setTimeout(() => toast.classList.add('show'), 10);

        // 6. Animación de salida (después de 4 segundos)
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400); // Esperamos a que termine de esconderse para borrarla
        }, 4000); 
    }

    function procesarOrden(e) {
        if (e) e.preventDefault(); // Evita que la página se recargue

        // ==========================================
        // 1. VALIDAMOS LOS DATOS DEL CLIENTE PRIMERO
        // ==========================================
        const inputNombre = document.getElementById('c-nombre');
        const inputDni = document.getElementById('c-dni');
        const inputCorreo = document.getElementById('c-correo'); 
        const inputCelular = document.getElementById('c-celular'); 
        
        if (!inputNombre || !inputDni || !inputCorreo || !inputCelular) return;

        // Metemos los inputs en una lista para revisarlos uno por uno
        const inputsAValidar = [inputNombre, inputDni, inputCorreo, inputCelular];
        let hayErrores = false;
        let primerCampoConError = null; // 🪄 NUEVA VARIABLE PARA GUARDAR EL DESTINO

        inputsAValidar.forEach(input => {
            if (input.value.trim() === "") {
                input.classList.add('input-error'); // Si está vacío, lo pintamos de rojo
                hayErrores = true;
                
                // Si es el PRIMER error que encontramos de arriba hacia abajo, lo guardamos
                if (!primerCampoConError) {
                    primerCampoConError = input;
                }
            } else {
                input.classList.remove('input-error'); // Si está lleno, lo limpiamos
            }
        });

        if (hayErrores) {
            mostrarAlerta('warning', 'Por favor, completa tus datos antes de continuar.');
            
            // 👇 LA MAGIA DEL SCROLL SUAVE 👇
            // Le decimos al navegador que viaje hacia ese input y lo ponga en el "centro" de la pantalla
            primerCampoConError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            return; // ⛔ Detiene si faltan datos
        }

        // Si pasamos la validación, guardamos los valores para el mensaje final
        const nombre = inputNombre.value.trim();
        const dni = inputDni.value.trim();
        const correo = inputCorreo.value.trim();
        const celular = inputCelular.value.trim();

        // ==========================================
        // 2. VALIDAMOS EL MÉTODO DE PAGO
        // ==========================================
        const metodoPagoSeleccionado = document.querySelector('input[name="pago"]:checked');
        if (!metodoPagoSeleccionado) {
            mostrarAlerta('error', 'Por favor, selecciona un método de pago para continuar.');
            return; // ⛔ Detiene si no hay pago seleccionado
        }
        const metodoPago = metodoPagoSeleccionado.parentElement.querySelector('.payment-name').innerText;

        // ==========================================
        // 3. VALIDAMOS QUE EL CARRITO NO ESTÉ VACÍO
        // ==========================================
        const itemsEnPantalla = document.querySelectorAll('.checkout-item');
        if (itemsEnPantalla.length === 0) {
            mostrarAlerta('warning', 'Tu carrito está vacío. Agrega productos antes de continuar.');
            return; // ⛔ Detiene si no hay productos
        }

        // ==========================================
        // 4. VALIDACIÓN DE PRIVACIDAD (ÚLTIMO FRENO)
        // ==========================================
        const checkDesktop = document.getElementById('terminos-datos-desktop');
        const checkMobile = document.getElementById('terminos-datos-mobile');
        let terminosAceptados = false;

        // Revisamos el checkbox correcto según la pantalla
        if (window.innerWidth <= 900) {
            terminosAceptados = checkMobile ? checkMobile.checked : false;
        } else {
            terminosAceptados = checkDesktop ? checkDesktop.checked : false;
        }

        if (!terminosAceptados) {
            mostrarAlerta('error', 'Debes aceptar las Políticas de Privacidad para continuar con tu compra.');
            return; // ⛔ Detiene si no marcaron la casilla
        }

        // ==========================================
        // 5. TODO ESTÁ PERFECTO: PROCESAMOS LA ORDEN
        // ==========================================
        let listaProductos = '';
        itemsEnPantalla.forEach(item => {
            const titulo = item.querySelector('h4').innerText;
            const cantidad = item.querySelector('.item-qty-badge').innerText;
            const talla = item.querySelector('.item-details p').innerText; 
            listaProductos += `- ${cantidad}x ${titulo} (${talla})%0A`; 
        });

        const total = document.getElementById('summary-total').innerText;

        let mensaje = `*¡NUEVA ORDEN DE COMPRA!* 🛍️%0A%0A`;
        mensaje += `*Datos del Cliente:*%0A`;
        mensaje += `👤 Nombre: ${nombre}%0A`;
        mensaje += `🪪 DNI/CE: ${dni}%0A`;
        mensaje += `📧 Correo: ${correo}%0A`;
        mensaje += `📱 Celular: ${celular}%0A%0A`;
        mensaje += `*Resumen del Pedido:*%0A`;
        mensaje += `${listaProductos}%0A`;
        mensaje += `*Total a Pagar:* ${total}%0A`;
        mensaje += `*Método de Pago:* ${metodoPago}%0A%0A`;
        mensaje += `Quedo a la espera de la confirmación para proceder.`;

        const numeroTienda = "51993755916"; 
        const linkWhatsapp = `https://wa.me/${numeroTienda}?text=${mensaje}`;

        window.open(linkWhatsapp, '_blank'); 
    }

    // ------------------------------------
    // LIMPIEZA DE ERRORES EN TIEMPO REAL
    // ------------------------------------
    const todosLosInputs = document.querySelectorAll('#c-nombre, #c-dni, #c-correo, #c-celular');
    
    todosLosInputs.forEach(input => {
        // Cada vez que el cliente escriba algo, le quitamos el traje rojo
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
        });
    });

    // Le conectamos la función a los dos botones
    if (btnDesktop) {
        btnDesktop.addEventListener('click', procesarOrden);
    }
    
    if (btnMobile) {
        btnMobile.addEventListener('click', procesarOrden);
    }
});

