document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // I. FUNCIONES DE UTILIDAD Y GESTIÓN DEL CARRITO
    // =========================================================

    // Función para crear una clave única de ID a partir del nombre de la actividad
    const createProductKey = (name) => {
        if (!name) return null;
        // Limpia espacios y convierte a mayúsculas para crear un ID consistente.
        return name.toUpperCase().replace(/\s/g, '').replace(/[^\w]/g, '');
    };
    
    // --- GESTIÓN DEL CARRITO (localStorage) ---
    
    // USAMOS TU CLAVE ACTUAL: 'currentCart'
    const CART_KEY = 'currentCart'; 
    
    const loadCart = () => {
        try {
            const storedCart = localStorage.getItem(CART_KEY);
            return storedCart ? JSON.parse(storedCart) : []; 
        } catch (e) {
            console.error("Error cargando el carrito:", e);
            return [];
        }
    };
    
    const saveCart = (cart) => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    };

    // La variable global del carrito se carga una única vez al inicio
    let currentCart = loadCart(); 
    
    // --- FUNCIÓN PARA ACTUALIZAR EL BOTÓN GLOBAL DEL CARRITO (EN TODAS LAS PÁGINAS) ---
    const updateGlobalCartButton = () => {
        const globalBtn = document.getElementById('js-go-to-cart');
        if (!globalBtn) return;
        
        const count = currentCart.length;
        
        if (count > 0) {
            globalBtn.textContent = `Ver Carrito (${count} Actividad${count > 1 ? 'es' : ''}) y Reservar`;
            globalBtn.classList.add('active'); 
            globalBtn.style.display = 'block';
        } else {
            globalBtn.textContent = `Ver Carrito (0 Actividades) y Reservar`;
            globalBtn.classList.remove('active');
            globalBtn.style.display = 'none'; 
        }
    };

    // =========================================================
    // II. CARRUSEL (PÁGINA DE INICIO) - MANTENIDO
    // =========================================================

    const carouselContainer = document.getElementById('activityCarousel');
    
    if (carouselContainer) {
        
        const cards = Array.from(carouselContainer.getElementsByClassName('activity-card'));
        const prevBtn = document.getElementById('prevActivity');
        const nextBtn = document.getElementById('nextActivity');
        const dotsContainer = document.getElementById('carouselDots');
        
        const totalCards = cards.length;
        let currentCardIndex = 0;

        const updateStackedCards = () => {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'next-1', 'next-2', 'hidden-next', 'prev-1', 'hidden-prev', 'hidden-left');
                const relativeIndex = index - currentCardIndex;
                
                if (relativeIndex === 0) { card.classList.add('active'); } 
                else if (relativeIndex === 1) { card.classList.add('next-1'); } 
                else if (relativeIndex === 2) { card.classList.add('next-2'); } 
                else if (relativeIndex > 2) { card.classList.add('hidden-next'); } 
                else if (relativeIndex === -1) { card.classList.add('prev-1'); } 
                else if (relativeIndex === -2) { card.classList.add('hidden-prev'); } 
                else if (relativeIndex < -2) { card.classList.add('hidden-left'); }
            });

            if (prevBtn) prevBtn.disabled = (currentCardIndex === 0);
            if (nextBtn) nextBtn.disabled = (currentCardIndex === totalCards - 1);
            
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentCardIndex);
            });
        };

        const showPrevCard = () => { if (currentCardIndex > 0) { currentCardIndex--; updateStackedCards(); } };
        const showNextCard = () => { if (currentCardIndex < totalCards - 1) { currentCardIndex++; updateStackedCards(); } };
        const goToCard = (index) => { if (index >= 0 && index < totalCards) { currentCardIndex = index; updateStackedCards(); } };
        
        const createDots = () => {
            if (dotsContainer) {
                for (let i = 0; i < totalCards; i++) {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    dot.dataset.index = i;
                    dot.addEventListener('click', () => goToCard(i));
                    dotsContainer.appendChild(dot);
                }
            }
        };

        if (prevBtn) prevBtn.addEventListener('click', showPrevCard);
        if (nextBtn) nextBtn.addEventListener('click', showNextCard);

        createDots();
        updateStackedCards(); 

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { showPrevCard(); } 
            else if (e.key === 'ArrowRight') { showNextCard(); }
        });
        
    }

    // =========================================================
    // III. LÓGICA DE SELECCIÓN DE MÚLTIPLES ACTIVIDADES 
    //      (index.html, ventajas.html, etc.) - CORREGIDO
    // =========================================================
    
    const selectButtons = document.querySelectorAll('.js-select-btn'); 

    selectButtons.forEach(button => {
        
        const rawName = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const productKey = createProductKey(rawName); 

        if (!productKey || isNaN(price) || price <= 0) {
            console.error(`Actividad con nombre "${rawName}" no tiene datos válidos. Revisa el data-name y data-price en el HTML.`);
            button.disabled = true;
            return;
        }

        // 1. Estado inicial del botón al cargar la página
        const isSelectedInitial = currentCart.some(item => item.id === productKey);
        if (isSelectedInitial) {
            button.textContent = 'SELECCIONADO';
            button.classList.add('selected');
        }

        button.addEventListener('click', function(e) { 
            
            e.preventDefault(); 
            e.stopPropagation(); 

            const itemIndex = currentCart.findIndex(item => item.id === productKey);

            if (itemIndex > -1) {
                // DESELECCIONAR: Eliminar del carrito
                currentCart.splice(itemIndex, 1);
                this.textContent = 'Seleccionar Actividad';
                this.classList.remove('selected');
            } else {
                // SELECCIONAR: Añadir al carrito
                currentCart.push({
                    id: productKey, 
                    name: rawName, 
                    price: price, 
                    qty: 1 // Cantidad inicial
                });
                this.textContent = 'SELECCIONADO';
                this.classList.add('selected');
            }

            saveCart(currentCart);
            updateGlobalCartButton(); 
            
            this.blur(); 
        });
    });
    
    updateGlobalCartButton(); 
    
    // Listener para el botón global que te lleva a contacto.html
    const globalCheckoutBtn = document.getElementById('js-go-to-cart');
    if (globalCheckoutBtn) {
        // Asumiendo que el botón es un <a> con href="contacto.html"
        globalCheckoutBtn.addEventListener('click', (e) => {
            if (currentCart.length === 0) {
                 e.preventDefault();
            }
        });
    }

    // =========================================================
    // IV. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ) - MANTENIDA
    // =========================================================

    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('h3');
        
        if (header) { 
            header.insertAdjacentHTML('beforeend', '<i class="fas fa-chevron-down faq-icon"></i>');
            
            header.addEventListener('click', () => {
                item.classList.toggle('active');

                // Cerrar otros ítems
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });
    
    // =========================================================
    // V. LÓGICA DE CARRITO Y RESERVA (contacto.html) - CORREGIDA
    // =========================================================
    
    const isBookingPage = document.getElementById('cart-stage');
    
    if (isBookingPage) {
        
        // Elementos del DOM del carrito
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartSubtotalSpan = document.getElementById('cart-subtotal');
        const cartTaxSpan = document.getElementById('cart-tax');
        const cartTotalSpan = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        const cartSummary = document.querySelector('.cart-summary');
        
        // Ahora usamos la variable global 'currentCart' y no la redeclaramos
        const IVA = 0.21; 
        
        // --- FUNCIONES DE CÁLCULO Y VISUALIZACIÓN ---

        function calculateTotals() {
            let subtotal = 0;
            
            currentCart.forEach(item => {
                const qty = Math.max(1, item.qty || 1); 
                subtotal += item.price * qty; 
            });

            const tax = subtotal * IVA;
            const total = subtotal + tax;

            cartSubtotalSpan.textContent = subtotal.toFixed(2) + '€';
            cartTaxSpan.textContent = tax.toFixed(2) + '€';
            cartTotalSpan.textContent = total.toFixed(2) + '€';

            // Validación del formulario
            const requiredInputs = document.querySelectorAll('#booking-form input[required], .contact-info input[required], .item-qty-input');
            const allInputsValid = Array.from(requiredInputs).every(input => input.checkValidity() && (input.type !== 'number' || parseInt(input.value) >= 1));
            
            checkoutBtn.disabled = subtotal === 0 || !allInputsValid;

            // Efecto visual de actualización
            cartSummary.classList.add('updated');
            setTimeout(() => {
                cartSummary.classList.remove('updated');
            }, 300);
        }

        function renderCart() {
            
            // Limpiar el carrito de actividades con cantidad 0 o inválida antes de renderizar
            currentCart = currentCart.filter(item => item.qty > 0);
            saveCart(currentCart); 
            
            if (currentCart.length === 0) {
                cartItemsContainer.innerHTML = '';
                emptyCartMessage.style.display = 'block';
                calculateTotals();
                return;
            }

            emptyCartMessage.style.display = 'none';
            cartItemsContainer.innerHTML = '';
            
            // Dibuja CADA actividad seleccionada
            currentCart.forEach(item => {
                
                const itemQty = Math.max(1, item.qty || 1); 
                const itemTotal = item.price * itemQty;

                const cartItemHTML = `
                    <div class="cart-item-detail" data-item-id="${item.id}">
                        <div class="item-info-left">
                            <span class="item-name">${item.name}</span>
                            <span class="small-info">${item.price.toFixed(2)}€ por persona</span>
                        </div>
                        <div class="item-info-right">
                            <input type="number" 
                                    class="item-qty-input" 
                                    data-item-id="${item.id}" 
                                    value="${itemQty}" 
                                    min="1" 
                                    required>
                            <span class="item-price-total">${itemTotal.toFixed(2)}€</span>
                        </div>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
            });

            // Añadir listeners a los nuevos inputs de cantidad
            document.querySelectorAll('.item-qty-input').forEach(input => {
                input.addEventListener('input', function() {
                    let newQty = parseInt(this.value);
                    const itemId = this.dataset.itemId;
                    
                    if (isNaN(newQty) || newQty < 1) {
                        newQty = 1;
                        this.value = 1;
                    }
                    
                    const itemToUpdate = currentCart.find(item => item.id === itemId);
                    if (itemToUpdate) {
                        itemToUpdate.qty = newQty;
                        saveCart(currentCart); 
                        
                        const itemTotalSpan = this.closest('.item-info-right').querySelector('.item-price-total');
                        if(itemTotalSpan) {
                             itemTotalSpan.textContent = (itemToUpdate.price * newQty).toFixed(2) + '€';
                        }
                        
                        calculateTotals();
                    }
                });
            });
            
            // Listener para la validación de la fecha
            const bookingDateInput = document.getElementById('booking-date');
            if (bookingDateInput) {
                bookingDateInput.addEventListener('input', (e) => {
                    const today = new Date().setHours(0,0,0,0);
                    const selectedDate = new Date(e.target.value).setHours(0,0,0,0);

                    if (selectedDate < today) {
                        e.target.setCustomValidity('La fecha seleccionada no puede ser pasada.');
                    } else {
                        e.target.setCustomValidity('');
                    }
                    calculateTotals(); // Revisa si habilita o deshabilita el botón
                });
            }

            calculateTotals();
        }

        function initializeCart() {
            // Asegura que todos los ítems del carrito tienen al menos qty=1
            currentCart.forEach(item => {
                if (!item.qty || item.qty < 1) {
                    item.qty = 1;
                }
            });
            
            // Añade listener a todos los campos requeridos para recalcular el total (y validar el botón)
            document.querySelectorAll('input[required]').forEach(input => {
                // Solo añadir si no es el input de cantidad, que ya tiene su propio listener
                if (!input.classList.contains('item-qty-input')) {
                    input.addEventListener('input', calculateTotals);
                }
            });

            renderCart();
        }

        initializeCart();
        
        // --- FINALIZACIÓN DE RESERVA ---
        
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (checkoutBtn.disabled) {
                // Mostrar mensajes de error de validación
                document.querySelectorAll('input:invalid, .item-qty-input').forEach(input => {
                    if (!input.checkValidity() || (input.type === 'number' && parseInt(input.value) < 1)) {
                        input.reportValidity();
                    }
                });
                return;
            }

            // Simulación de reserva exitosa
            localStorage.removeItem(CART_KEY); 
            currentCart = []; // Limpia la variable en memoria también
            
            const confirmationStage = document.getElementById('confirmation-stage');
            const cartStage = document.getElementById('cart-stage');
            
            if(confirmationStage && cartStage) {
                
                // 1. Oculta el formulario/carrito
                cartStage.classList.add('hidden');
                
                // 2. Muestra el mensaje de confirmación profesional
                confirmationStage.classList.remove('hidden');
                
                // Simulación de Referencia
                const refElement = document.getElementById('booking-reference');
                if (refElement) {
                    refElement.textContent = 'AS-2025-' + Math.floor(Math.random() * 90000 + 10000);
                }
                
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
                
                // Actualiza el botón global al estado de carrito vacío
                updateGlobalCartButton();

                document.querySelector('.confirmation-box .main-action-btn').addEventListener('click', () => {
                    window.location.href = 'index.html';
                });

            } else {
                 alert("Reserva simulada con éxito. Redirigiendo a inicio.");
                 window.location.href = 'index.html';
            }
        });
    }

});