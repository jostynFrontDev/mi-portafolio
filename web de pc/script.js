// Espera a que todo el contenido del DOM (la página) se cargue antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {

    // --- Parte 1: Animación de la Barra de Navegación al hacer Scroll ---
    const header = document.querySelector('header');

    // Escuchamos el evento 'scroll' en toda la ventana del navegador.
    window.addEventListener('scroll', () => {
        // Si el desplazamiento vertical (cuánto hemos bajado) es mayor a 50 píxeles...
        if (window.scrollY > 50) {
            // ...añadimos la clase 'scrolled' al header para activar los estilos de CSS.
            header.classList.add('scrolled');
        } else {
            // ...de lo contrario (si estamos en la parte superior), la quitamos para volver al estado inicial.
            header.classList.remove('scrolled');
        }
    });


    // --- Parte 2: Funcionalidad de Desplazamiento Suave del Botón "Explorar Productos" ---
    const exploreButton = document.querySelector('.cta-button');
    const productsSection = document.querySelector('#productos');

    if (exploreButton && productsSection) {
        // Añadimos un "escuchador de eventos" para el clic en el botón.
        exploreButton.addEventListener('click', (event) => {
            // Prevenimos el comportamiento por defecto del enlace (el salto brusco).
            event.preventDefault();

            // Usamos el método scrollIntoView para un desplazamiento suave hacia la sección de productos.
            productsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }


    // --- Parte 3: Animaciones de Aparición al hacer Scroll (Intersection Observer) ---
    // Creamos el observador. Esta función se ejecutará cuando un elemento observado entre o salga de la vista.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // Si el elemento (entry) es visible en la pantalla (isIntersecting)...
            if (entry.isIntersecting) {
                // ...le añadimos la clase 'show' para que se active la animación CSS de aparición.
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1 // La animación se dispara cuando al menos el 10% del elemento sea visible.
    });

    // Seleccionamos todos los elementos que tienen la clase 'hidden' que queremos animar.
    const hiddenElements = document.querySelectorAll('.hidden');
    // Le decimos al observador que "vigile" cada uno de esos elementos.
    hiddenElements.forEach((el) => observer.observe(el));


    // --- Parte 4: Activar Efecto 3D en las Tarjetas con Tilt.js ---
    // Seleccionamos todas las tarjetas de producto.
    const cards = document.querySelectorAll('.product-card');

    // Verificamos si la librería VanillaTilt está disponible.
    if (typeof VanillaTilt !== 'undefined') {
        // Aplicamos la inicialización de VanillaTilt a cada tarjeta con opciones personalizadas.
        VanillaTilt.init(cards, {
            max: 15,          // Inclinación máxima en grados.
            speed: 400,       // Velocidad de la animación de inclinación.
            glare: true,      // Añade un efecto de "reflejo de luz".
            "max-glare": 0.5  // Intensidad del reflejo (de 0 a 1).
        });
    }

});