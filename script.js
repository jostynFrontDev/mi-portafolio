document.addEventListener('DOMContentLoaded', () => {
    // Animación de entrada de secciones al hacer scroll
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.2 // La sección se considera visible cuando el 20% de ella es visible
    });
    sections.forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll para el botón "Ver mis Proyectos"
    const scrollButton = document.getElementById('smooth-scroll-button');
    scrollButton.addEventListener('click', (e) => {
        e.preventDefault(); // Evita el comportamiento de anclaje predeterminado
        const targetId = scrollButton.getAttribute('href'); // Obtiene el ID del destino (ej. #proyectos)
        const targetElement = document.querySelector(targetId); // Encuentra el elemento de destino
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop, // Se desplaza a la posición superior del elemento
                behavior: 'smooth' // Habilita el desplazamiento suave
            });
        }
    });

    // Creación de partículas para el fondo animado
    const heroBg = document.getElementById('hero-bg');
    const numberOfParticles = 50; // Número de partículas a generar

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 20 + 5; // Tamaño aleatorio entre 5px y 25px
        // Posiciones de inicio y fin aleatorias para un movimiento más dinámico
        const xStart = Math.random() * 100 + 'vw';
        const yStart = Math.random() * 100 + 'vh';
        const xEnd = (Math.random() - 0.5) * 500 + 'px'; // Mayor rango de movimiento horizontal
        const yEnd = (Math.random() - 0.5) * 500 + 'px'; // Mayor rango de movimiento vertical
        const delay = Math.random() * 10; // Retraso de animación aleatorio para desincronizar

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`; // Posición inicial horizontal aleatoria
        particle.style.top = `${Math.random() * 100}vh`; // Posición inicial vertical aleatoria
        particle.style.setProperty('--x-start', xStart); // Establece variable CSS para inicio X
        particle.style.setProperty('--y-start', yStart); // Establece variable CSS para inicio Y
        particle.style.setProperty('--x-end', xEnd);     // Establece variable CSS para fin X
        particle.style.setProperty('--y-end', yEnd);     // Establece variable CSS para fin Y
        particle.style.animationDelay = `${delay}s`;     // Establece el retraso de la animación

        heroBg.appendChild(particle); // Agrega la partícula al fondo del héroe
    }

    // Efecto de máquina de escribir
    const typingText1 = document.getElementById('typing-text-1');
    const typingText2 = document.getElementById('typing-text-2');
    
    // Si quieres cambiar el nombre o el título, edita las siguientes líneas:
    const text1 = 'Soy <span class="text-accent-blue">Jostyn</span>'; // Texto para la primera línea
    const text2 = 'Desarrollador Web Front-End'; // Texto para la segunda línea
    
    // Función para simular el efecto de máquina de escribir
    function typeText(element, text, speed, callback) {
        let i = 0;
        element.innerHTML = ''; // Limpia el contenido inicial del elemento
        element.classList.add('typing-container'); // Agrega la clase para el efecto de cursor
        let typingInterval = setInterval(() => {
            if (i < text.length) {
                // Si el texto contiene HTML, se añade el carácter y se maneja la lógica para el span
                if (text.substring(i, i + 6) === '<span ') {
                    const spanEnd = text.indexOf('>', i) + 1;
                    const spanContentStart = spanEnd;
                    const spanContentEnd = text.indexOf('</span', spanContentStart);
                    const spanContent = text.substring(spanContentStart, spanContentEnd);
                    
                    element.innerHTML += text.substring(i, spanEnd); // Añade la etiqueta de apertura <span>
                    element.innerHTML += spanContent; // Añade el contenido dentro del <span>
                    element.innerHTML += '</span>'; // Añade la etiqueta de cierre </span>
                    i = text.indexOf('>', i) + 7; // Ajusta el índice para pasar todo el span
                } else if (text.substring(i, i + 7) === '</span>') {
                    // Evita añadir la etiqueta de cierre si ya se añadió con la lógica anterior
                    i += 7;
                } else {
                    element.innerHTML += text.charAt(i); // Añade un carácter a la vez
                    i++;
                }
            } else {
                clearInterval(typingInterval); // Detiene el intervalo cuando el texto se ha completado
                element.classList.remove('typing-container'); // Quita la clase del cursor
                if (callback) callback(); // Llama al callback si existe
            }
        }, speed); // Velocidad de escritura
    }

    // Inicia el efecto de máquina de escribir para las dos líneas
    typeText(typingText1, text1, 100, () => {
        setTimeout(() => {
            typeText(typingText2, text2, 80);
        }, 500); // Retraso de 0.5 segundos entre la primera y segunda línea
    });

    // Efecto de brillo que sigue el cursor
    const glowCursor = document.getElementById('glow-cursor');
    document.addEventListener('mousemove', (e) => {
        glowCursor.style.left = `${e.clientX}px`; // Actualiza la posición X del brillo
        glowCursor.style.top = `${e.clientY}px`;  // Actualiza la posición Y del brillo
    });
});