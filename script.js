document.addEventListener('DOMContentLoaded', async () => {
    // Array of known JPG filenames
    // Added 04.jpg since we verified it exists
    const jpgFiles = [
        '01.jpg',
        '02.jpg',
        '03.jpg',
        '04.jpg'
    ];

    // --- Page Logic Routing ---
    const carouselContainer = document.getElementById('carousel-container');
    const templatesGrid = document.getElementById('templates-grid');

    // Initial Render (Dont wait for discovery)
    if (carouselContainer) {
        initCarousel();
    }

    if (templatesGrid) {
        renderTemplatesGrid();
    }

    // --- Dynamic Image Discovery ---
    // Automatically looks for 05.jpg, 06.jpg... and adds them to the list
    const discoverImages = async () => {
        let nextIndex = 5; // Start searching from 05.jpg (since we know 04 exists)
        let searching = true;
        let newFound = false;

        while (searching) {
            const filename = nextIndex.toString().padStart(2, '0') + '.jpg';
            const filePath = 'cv_templates/' + filename;

            try {
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => reject();
                    // Add a timeout to prevent hanging forever
                    setTimeout(() => reject(), 5000);
                    img.src = filePath;
                });

                // Image exists, add to array
                console.log(`Discovered new template: ${filename}`);
                jpgFiles.push(filename);
                nextIndex++;
                newFound = true;

                // Update UI incrementally if on templates page
                if (templatesGrid) {
                    renderTemplatesGrid();
                }

            } catch (error) {
                // Image does not exist, stop searching
                searching = false;
            }
        }

        if (newFound) {
            // Ensure sorted
            jpgFiles.sort();
            // Re-render to ensure correct order
            if (templatesGrid) renderTemplatesGrid();
            if (carouselContainer) {
                // For carousel, we might just want to update the current view if needed, 
                // but usually it dynamically reads the array, so next click will work.
                // We could force a re-render of current slide to be safe but it's fine.
            }
        }
    };

    // Start discovery in background (No await)
    discoverImages();


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
            if (carouselContainer) {
                carouselContainer.innerHTML = `
                    <img src="${filePath}" alt="CV Template ${currentIndex + 1}" class="template-image">
                `;
            }

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
        if (!templatesGrid) return;

        templatesGrid.innerHTML = ''; // Clear placeholder/previous content

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
