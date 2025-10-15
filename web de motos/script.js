document.addEventListener('DOMContentLoaded', () => {
    // Intenta obtener los datos de la API de motos. Si el elemento no existe, usa un array vacío.
    const motoApiElement = document.getElementById('moto-api');
    const motoApiData = motoApiElement ? JSON.parse(motoApiElement.textContent) : [];

    // --- MANEJO DEL HEADER ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    // --- MENÚ MÓVIL ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // --- RENDERIZADO Y FILTRO DE MODELOS / MODAL ---
    const motoGrid = document.getElementById('moto-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('moto-modal');
    const modalContent = document.getElementById('modal-content');
    
    // --- MODAL FUNCTIONS ---
    // (Solo se definen si los elementos del modal existen, lo que evita errores en contacto.html)
    if (modal && modalContent) {
        
        const closeModal = () => {
            modalContent.classList.remove('scale-100');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300);
        };
        
        const openModal = (moto) => {
            // Hacemos que la galería y especificaciones sean arrays/objetos vacíos si no existen
            const safeGaleria = moto.galeria || [];
            const safeSpecs = moto.especificaciones || {};
            const defaultImage = 'https://placehold.co/1280x720/4a5568/ffffff?text=Imagen+no+disponible';

            modalContent.innerHTML = `
                <button id="close-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl">&times;</button>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    <div>
                        <img id="modal-main-image" src="${safeGaleria[0] || defaultImage}" alt="${moto.nombre}" class="w-full rounded-lg shadow-lg mb-4">
                        <div id="modal-thumbnail-gallery" class="flex gap-2 overflow-x-auto pb-2">
                            ${safeGaleria.map((imgSrc, index) => `
                                <img src="${imgSrc}" class="w-1/3 min-w-[32%] cursor-pointer rounded ${index === 0 ? 'border-2 border-amber-500' : ''}" onclick="document.getElementById('modal-main-image').src='${imgSrc}'; document.querySelectorAll('#modal-thumbnail-gallery img').forEach(img => img.classList.remove('border-2', 'border-amber-500')); this.classList.add('border-2', 'border-amber-500');">
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <h2 class="text-4xl font-extrabold">${moto.nombre}</h2>
                        <span class="inline-block bg-gray-700 text-amber-400 text-sm font-bold px-3 py-1 rounded-full uppercase mt-2">${moto.categoria}</span>
                        <p class="text-gray-300 my-4">${moto.descripcion || 'Descripción no disponible.'}</p>
                        <h3 class="text-2xl font-bold mb-3 border-b border-gray-700 pb-2">Especificaciones</h3>
                        <ul class="space-y-2 text-gray-400">
                            ${Object.keys(safeSpecs).length > 0 ? Object.entries(safeSpecs).map(([key, value]) => `
                                <li><strong class="text-white font-semibold">${key}:</strong> ${value}</li>
                            `).join('') : '<li>Especificaciones no detalladas.</li>'}
                        </ul>
                        <div class="mt-6">
                            <p class="text-3xl font-bold text-amber-400">Precio: $${moto.precio} USD</p>
                            <a href="contacto.html" class="mt-4 inline-block w-full text-center bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-full transition-transform duration-300 hover:scale-105">
                                Solicitar Cotización
                            </a>
                        </div>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => modalContent.classList.add('scale-100'), 50);

            // Se adjunta el listener para cerrar el modal
            document.getElementById('close-modal').addEventListener('click', closeModal);
        };
        
        // Listener principal para las tarjetas
        if (motoGrid) {
            motoGrid.addEventListener('click', (e) => {
                const card = e.target.closest('.moto-card');
                if (card) {
                    const motoId = parseInt(card.dataset.motoId);
                    const selectedMoto = motoApiData.find(m => m.id === motoId);
                    if (selectedMoto) {
                         openModal(selectedMoto);
                    }
                }
            });

            // Listener para cerrar al hacer clic fuera
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }
    }
    // --- FIN MODAL FUNCTIONS ---

    const renderMotos = (filter = 'all') => {
        if (!motoGrid || motoApiData.length === 0) return;

        motoGrid.classList.add('fade-out');
        
        setTimeout(() => {
            motoGrid.innerHTML = '';
            const filteredMotos = filter === 'all' 
                ? motoApiData 
                : motoApiData.filter(moto => moto.categoria === filter);

            filteredMotos.forEach((moto, index) => {
                const card = document.createElement('div');
                card.className = 'moto-card bg-gray-800 rounded-lg shadow-lg cursor-pointer animate-on-scroll';
                card.style.transitionDelay = `${index * 0.05}s`;
                card.setAttribute('data-moto-id', moto.id); // <-- Agrega el atributo necesario

                const imgSrc = moto.imagen_principal || 'https://placehold.co/600x400/1a202c/ffffff?text=No+Image';

                card.innerHTML = `
                    <img src="${imgSrc}" alt="${moto.nombre}" class="w-full h-48 object-cover rounded-t-lg">
                    <div class="p-6">
                        <span class="inline-block bg-amber-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full uppercase">${moto.categoria}</span>
                        <h3 class="text-2xl font-bold mt-4">${moto.nombre}</h3>
                        <p class="text-gray-400 mt-2">Desde $${moto.precio} USD</p>
                    </div>
                `;
                card.classList.add('is-visible'); 
                motoGrid.appendChild(card);
            });

            motoGrid.classList.remove('fade-out');
            setupScrollAnimations();
            
        }, 300);
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const activeBtn = document.querySelector('.filter-btn.active');
            if (activeBtn) {
                activeBtn.classList.remove('active');
            }
            button.classList.add('active');
            renderMotos(button.dataset.filter);
        });
    });


    // --- MANEJO DEL FORMULARIO DE CONTACTO Y SIMULACIÓN DE API (Solo para contacto.html) ---
    const contactForm = document.getElementById('contact-form');
    const formMessageContainer = document.getElementById('form-message-container');
    const submitButton = document.getElementById('submit-button');
    const modelSelect = document.getElementById('model-select');

    if (contactForm) {
        // POBLAR SELECT DE MODELOS
        if (modelSelect && motoApiData.length > 0) {
            Array.from(modelSelect.options).slice(1).forEach(option => option.remove());
            
            motoApiData.forEach(moto => {
                const option = document.createElement('option');
                option.value = moto.nombre;
                option.textContent = moto.nombre;
                modelSelect.appendChild(option);
            });
        }

        const showMessage = (type, message) => {
            // ... (función showMessage permanece igual) ...
            const baseClasses = 'p-6 rounded-lg mb-6 transition-all duration-300';
            let classes = '';
            let icon = '';

            if (type === 'loading') {
                classes = 'bg-blue-900 text-blue-300 flex items-center justify-center';
                icon = '<div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-300 mr-3"></div>';
            } else if (type === 'success') {
                classes = 'bg-green-700 text-white transform scale-105';
                icon = '<span class="text-2xl mr-3">✅</span>';
            } else if (type === 'error') {
                classes = 'bg-red-700 text-white transform scale-105';
                icon = '<span class="text-2xl mr-3">❌</span>';
            }

            formMessageContainer.innerHTML = `
                <div class="${baseClasses} ${classes}">
                    ${icon}
                    <p class="font-semibold text-lg">${message}</p>
                </div>
            `;
            formMessageContainer.classList.remove('hidden');
        };

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            Array.from(contactForm.elements).forEach(el => el.disabled = true);
            submitButton.innerHTML = 'Enviando...';
            submitButton.classList.add('opacity-70');
            showMessage('loading', 'Procesando tu solicitud. Por favor, espera...');

            setTimeout(() => {
                const success = Math.random() < 0.9; 

                if (success) {
                    showMessage('success', '¡Solicitud enviada con éxito! Nos pondremos in contacto contigo pronto.');
                    contactForm.reset(); 
                    
                    Array.from(contactForm.elements).forEach(el => el.disabled = false);
                    submitButton.innerHTML = 'Enviar Solicitud';
                    submitButton.classList.remove('opacity-70');

                    setTimeout(() => {
                        formMessageContainer.classList.add('hidden');
                        formMessageContainer.innerHTML = '';
                    }, 5000); 

                } else {
                    showMessage('error', 'Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
                    Array.from(contactForm.elements).forEach(el => el.disabled = false);
                    submitButton.innerHTML = 'Enviar Solicitud';
                    submitButton.classList.remove('opacity-70');
                }
            }, 2000);
        });
    }


    // --- ANIMACIONES AL HACER SCROLL ---
    let observer;
    const setupScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        if(observer) observer.disconnect();

        observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    if (!entry.target.style.transitionDelay) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    };

    // --- INICIALIZACIÓN ---
    document.getElementById('year').textContent = new Date().getFullYear();
    renderMotos();
    setupScrollAnimations();
});

// ... dentro de script.js

// Función para abrir el modal con los detalles de la moto
const openModal = (moto) => {
    // ... (Manejo de imágenes y specs seguras) ...

    modalContent.innerHTML = `
        <button id="close-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl">&times;</button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
                <img id="modal-main-image" src="${safeGaleria[0] || defaultImage}" alt="${moto.nombre}" class="w-full rounded-lg shadow-lg mb-4">
                <div id="modal-thumbnail-gallery" class="flex gap-2 overflow-x-auto pb-2">
                    ${safeGaleria.map(/* ... */).join('')}
                </div>
            </div>
            <div>
                <h2 class="text-4xl font-extrabold">${moto.nombre}</h2>
                <span class="inline-block bg-gray-700 text-amber-400 text-sm font-bold px-3 py-1 rounded-full uppercase mt-2">${moto.categoria}</span>
                
                <p class="text-gray-300 my-4">${moto.descripcion || 'Descripción no disponible.'}</p>
                
                <h3 class="text-2xl font-bold mb-3 border-b border-gray-700 pb-2">Especificaciones</h3>
                <ul class="space-y-2 text-gray-400">
                    ${Object.keys(safeSpecs).length > 0 ? Object.entries(safeSpecs).map(([key, value]) => `
                        <li><strong class="text-white font-semibold">${key}:</strong> ${value}</li>
                    `).join('') : '<li>Especificaciones no detalladas.</li>'}
                </ul>
                
                <div class="mt-6">
                    <p class="text-3xl font-bold text-amber-400">Precio: $${moto.precio} USD</p>
                    <a href="contacto.html" class="mt-4 inline-block w-full text-center bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-full transition-transform duration-300 hover:scale-105">
                        Solicitar Cotización
                    </a>
                </div>
            </div>
        </div>
    `;
    // Muestra el modal con la animación
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modalContent.classList.add('scale-100'), 50);

    // ... (Listener para cerrar el modal) ...
};

// ...
// Listener para las tarjetas de moto
if (motoGrid) {
    motoGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.moto-card');
        if (card) {
            const motoId = parseInt(card.dataset.motoId);
            const selectedMoto = motoApiData.find(m => m.id === motoId);
            if (selectedMoto) {
                 openModal(selectedMoto); // <--- Aquí se abre el modal con la info
            }
        }
    });
}


// ...existing code...

document.addEventListener('DOMContentLoaded', () => {
    // ...todo tu código actual...

    // --- MODAL PARA MOMENTOS LEGENDARIOS ---
    const momentosModal = document.getElementById('momentos-modal');
    const momentosModalImg = document.getElementById('momentos-modal-img');
    const closeMomentosModal = document.getElementById('close-momentos-modal');

    if (momentosModal && momentosModalImg && closeMomentosModal) {
        // Selecciona todas las imágenes de momentos legendarios
        const momentosImgs = document.querySelectorAll('.momentos-legendarios-img');
        momentosImgs.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                momentosModalImg.src = img.src;
                momentosModal.classList.remove('hidden');
                momentosModal.classList.add('flex');
            });
        });

        closeMomentosModal.addEventListener('click', () => {
            momentosModal.classList.add('hidden');
            momentosModal.classList.remove('flex');
            momentosModalImg.src = '';
        });

        // Cerrar modal al hacer clic fuera de la imagen
        momentosModal.addEventListener('click', (e) => {
            if (e.target === momentosModal) {
                momentosModal.classList.add('hidden');
                momentosModal.classList.remove('flex');
                momentosModalImg.src = '';
            }
        });
    }

    // ...resto de tu código...
});