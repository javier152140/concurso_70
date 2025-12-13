document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // I. VARIABLES Y SETUP INICIAL
    // =========================================================

    const carouselContainer = document.getElementById('activityCarousel');
    const cards = Array.from(carouselContainer.getElementsByClassName('activity-card'));
    const prevBtn = document.getElementById('prevActivity');
    const nextBtn = document.getElementById('nextActivity');
    const dotsContainer = document.getElementById('carouselDots');
    
    const totalCards = cards.length;
    let currentCardIndex = 0;

    // =========================================================
    // II. FUNCIONES DEL CARRUSEL
    // =========================================================

    /**
     * Aplica las clases de posición (active, next-1, prev-1, etc.) 
     * a cada tarjeta basándose en el índice actual (currentCardIndex).
     * Esto crea el efecto visual de apilamiento centrado (Cover Flow).
     */
    const updateStackedCards = () => {
        
        cards.forEach((card, index) => {
            
            // 1. Limpieza de clases de posición
            card.classList.remove('active', 'next-1', 'next-2', 'hidden-next', 'prev-1', 'hidden-prev', 'hidden-left');
            
            // 2. Cálculo del índice relativo (distancia al centro)
            const relativeIndex = index - currentCardIndex;
            
            if (relativeIndex === 0) {
                // CENTRAL: La tarjeta principal y grande
                card.classList.add('active');
            } 
            
            // --- DERECHA (Próximas tarjetas) ---
            else if (relativeIndex === 1) {
                // Inmediatamente a la derecha
                card.classList.add('next-1');
            } else if (relativeIndex === 2) {
                // Segunda a la derecha
                card.classList.add('next-2');
            } else if (relativeIndex > 2) {
                // Muy lejos a la derecha (oculta)
                card.classList.add('hidden-next');
            } 
            
            // --- IZQUIERDA (Tarjetas vistas) ---
            else if (relativeIndex === -1) {
                // Inmediatamente a la izquierda (visible)
                card.classList.add('prev-1');
            } else if (relativeIndex === -2) {
                // Segunda a la izquierda (visible)
                card.classList.add('hidden-prev');
            } else if (relativeIndex < -2) {
                // Muy lejos a la izquierda (oculta)
                card.classList.add('hidden-left');
            }
        });

        // 3. Actualizar estado de botones y puntos
        prevBtn.disabled = (currentCardIndex === 0);
        nextBtn.disabled = (currentCardIndex === totalCards - 1);
        
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentCardIndex);
        });
    };

    /**
     * Mueve el carrusel a la tarjeta anterior.
     */
    const showPrevCard = () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateStackedCards();
        }
    };

    /**
     * Mueve el carrusel a la siguiente tarjeta.
     */
    const showNextCard = () => {
        if (currentCardIndex < totalCards - 1) {
            currentCardIndex++;
            updateStackedCards();
        }
    };

    /**
     * Mueve el carrusel a la tarjeta seleccionada por el punto.
     */
    const goToCard = (index) => {
        if (index >= 0 && index < totalCards) {
            currentCardIndex = index;
            updateStackedCards();
        }
    };
    
    // =========================================================
    // III. INICIALIZACIÓN Y EVENTOS
    // =========================================================

    /**
     * Crea los puntos de navegación y los añade al contenedor.
     */
    const createDots = () => {
        for (let i = 0; i < totalCards; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = i;
            dot.addEventListener('click', () => goToCard(i));
            dotsContainer.appendChild(dot);
        }
    };

    // Asignación de Event Listeners a los botones
    prevBtn.addEventListener('click', showPrevCard);
    nextBtn.addEventListener('click', showNextCard);

    // Inicializar: crear puntos y mostrar la primera tarjeta
    createDots();
    updateStackedCards(); 

    // Opcional: Permitir navegación con las teclas de flecha
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showPrevCard();
        } else if (e.key === 'ArrowRight') {
            showNextCard();
        }
        
    });
});
// =========================================================
// IV. BOTÓN "SELECCIONAR ACTIVIDAD"
// =========================================================

const selectButtons = document.querySelectorAll('.add-to-cart-btn');

selectButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // No interferir con el carrusel

        button.classList.toggle('selected');

        if (button.classList.contains('selected')) {
            button.textContent = 'Seleccionado';
        } else {
            button.textContent = 'Seleccionar Actividad';
        }
    });
});
