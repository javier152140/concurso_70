document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // I. VARIABLES Y SETUP INICIAL DEL CARRUSEL
    // La variable 'carouselContainer' se usa para proteger el script.
    // =========================================================

    const carouselContainer = document.getElementById('activityCarousel');
    
    // 🛑 Protección: Solo inicializar si el contenedor del carrusel existe.
    if (carouselContainer) {
        
        const cards = Array.from(carouselContainer.getElementsByClassName('activity-card'));
        const prevBtn = document.getElementById('prevActivity');
        const nextBtn = document.getElementById('nextActivity');
        const dotsContainer = document.getElementById('carouselDots');
        
        const totalCards = cards.length;
        let currentCardIndex = 0;

        // =========================================================
        // II. FUNCIONES DEL CARRUSEL
        // =========================================================

        const updateStackedCards = () => {
            
            cards.forEach((card, index) => {
                
                card.classList.remove('active', 'next-1', 'next-2', 'hidden-next', 'prev-1', 'hidden-prev', 'hidden-left');
                
                const relativeIndex = index - currentCardIndex;
                
                if (relativeIndex === 0) {
                    card.classList.add('active');
                } 
                else if (relativeIndex === 1) {
                    card.classList.add('next-1');
                } else if (relativeIndex === 2) {
                    card.classList.add('next-2');
                } else if (relativeIndex > 2) {
                    card.classList.add('hidden-next');
                } 
                else if (relativeIndex === -1) {
                    card.classList.add('prev-1');
                } else if (relativeIndex === -2) {
                    card.classList.add('hidden-prev');
                } else if (relativeIndex < -2) {
                    card.classList.add('hidden-left');
                }
            });

            // Actualizar estado de botones y puntos
            if (prevBtn) prevBtn.disabled = (currentCardIndex === 0);
            if (nextBtn) nextBtn.disabled = (currentCardIndex === totalCards - 1);
            
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentCardIndex);
            });
        };

        const showPrevCard = () => {
            if (currentCardIndex > 0) {
                currentCardIndex--;
                updateStackedCards();
            }
        };

        const showNextCard = () => {
            if (currentCardIndex < totalCards - 1) {
                currentCardIndex++;
                updateStackedCards();
            }
        };

        const goToCard = (index) => {
            if (index >= 0 && index < totalCards) {
                currentCardIndex = index;
                updateStackedCards();
            }
        };
        
        // =========================================================
        // III. INICIALIZACIÓN Y EVENTOS DEL CARRUSEL
        // =========================================================

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
            if (e.key === 'ArrowLeft') {
                showPrevCard();
            } else if (e.key === 'ArrowRight') {
                showNextCard();
            }
        });
        
    } // Cierre del IF que protege la inicialización del carrusel.
    
    // =========================================================
    // IV. BOTÓN "SELECCIONAR ACTIVIDAD" (FUNCIONALIDAD GLOBAL)
    // ESTA SECCIÓN SE EJECUTA EN TODAS LAS PÁGINAS.
    // =========================================================

    const selectButtons = document.querySelectorAll('.js-select-btn'); 

    selectButtons.forEach(button => {
        button.addEventListener('click', function(e) { 
            
            e.preventDefault(); 
            e.stopPropagation(); 
            
            // 1. Alternar SOLO la clase 'selected' (para el color verde)
            const isSelected = this.classList.toggle('selected'); 
            
            // 2. Controlar el texto del botón
            if (isSelected) {
                this.textContent = 'SELECCIONADO';
            } else {
                // Lógica para determinar el texto original
                if (this.classList.contains('primary-cta-btn')) {
                    this.textContent = '¡Reservar Premium!';
                } else if (this.classList.contains('secondary-cta-btn')) {
                    // Texto para Estándar y Familiar (Busca el título de la tarjeta)
                    try {
                        const cardTitle = this.closest('.pricing-card').querySelector('h3').textContent;
                        this.textContent = `¡Reservar ${cardTitle.replace('Paquete ', '')}!`;
                    } catch (error) {
                        // Fallback si no encuentra el título (ej. en la página de inicio)
                        this.textContent = 'Seleccionar Actividad';
                    }
                } else {
                    // Fallback general (ej. en la página de inicio)
                    this.textContent = 'Seleccionar Actividad';
                }
            }
            
            this.blur(); 
            return false; 
        });
    });

    // =========================================================
    // V. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
    // ESTA SECCIÓN TAMBIÉN SE EJECUTA EN TODAS LAS PÁGINAS.
    // =========================================================

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('h3');
        
        if (header) { 
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

}); // <--- Cierre único y correcto de todo el script