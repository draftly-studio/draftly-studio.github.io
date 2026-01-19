document.addEventListener('DOMContentLoaded', async () => {
    // Array of known JPG filenames
    const jpgFiles = [
        '01.jpg',
        '02.jpg',
        '03.jpg'
    ];

    // --- Dynamic Image Discovery ---
    // Automatically looks for 04.jpg, 05.jpg... and adds them to the list
    const discoverImages = async () => {
        let nextIndex = 4; // Start searching from 04.jpg
        let searching = true;

        while (searching) {
            const filename = nextIndex.toString().padStart(2, '0') + '.jpg';
            const filePath = 'cv_templates/' + filename;

            try {
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => reject();
                    img.src = filePath;
                });

                // Image exists, add to array
                console.log(`Discovered new template: ${filename}`);
                jpgFiles.push(filename);
                nextIndex++;
            } catch (error) {
                // Image does not exist, stop searching
                searching = false;
            }
        }
    };

    // Wait for discovery to finish before rendering
    await discoverImages();

    // Re-sort to ensure order if necessary, though discovery adds in order
    jpgFiles.sort();

    // --- Page Logic Routing ---
    const carouselContainer = document.getElementById('carousel-container');
    const templatesGrid = document.getElementById('templates-grid');

    if (carouselContainer) {
        initCarousel();
    }

    if (templatesGrid) {
        renderTemplatesGrid();
    }

    // --- Carousel Logic (index.html) ---
    function initCarousel() {
        let currentIndex = 0;
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const templateNameDisplay = document.getElementById('template-name');

        function renderSlide(index) {
            // Ensure index is within bounds (circular)
            if (index < 0) {
                currentIndex = jpgFiles.length - 1;
            } else if (index >= jpgFiles.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            const filename = jpgFiles[currentIndex];
            const filePath = 'cv_templates/' + filename;

            // Create Image tag
            carouselContainer.innerHTML = `
                <img src="${filePath}" alt="CV Template ${currentIndex + 1}" class="template-image">
            `;

            // Update Name Display
            if (templateNameDisplay) {
                templateNameDisplay.textContent = `Template ${currentIndex + 1}`;
            }
        }

        // Event Listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                renderSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                renderSlide(currentIndex + 1);
            });
        }

        // Initial render
        renderSlide(0);
    }

    // --- Grid Logic (templates.html) ---
    function renderTemplatesGrid() {
        templatesGrid.innerHTML = ''; // Clear placeholder

        jpgFiles.forEach((filename, index) => {
            const filePath = 'cv_templates/' + filename;
            const templateNum = index + 1;
            const templateName = `Template ${templateNum}`;

            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `
                <div class="template-image-wrapper">
                    <img src="${filePath}" alt="${templateName}" loading="lazy">
                </div>
                <div class="template-info">
                    <h3 class="template-name">${templateName}</h3>
                </div>
            `;

            templatesGrid.appendChild(card);
        });
    }

    // --- Shared Logic (Mobile Menu) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});
