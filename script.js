document.addEventListener('DOMContentLoaded', () => {
    // Array of JPG filenames now
    const jpgFiles = [
        '01.jpg',
        '02.jpg',
        '03.jpg'
    ];

    let currentIndex = 0;

    const carouselContainer = document.getElementById('carousel-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const statusDisplay = document.getElementById('carousel-status');

    // Function to render the current Slide (Image)
    function renderSlide(index) {
        if (!carouselContainer) return;

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

        // Update status text - Removed as requested
        // if (statusDisplay) {
        //     statusDisplay.textContent = `${currentIndex + 1} / ${jpgFiles.length}`;
        // }
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

    // Dynamic Image Discovery
    // Automatically looks for 04.jpg, 05.jpg... and adds them to the carousel
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

    // Start discovery in background
    discoverImages();
});
