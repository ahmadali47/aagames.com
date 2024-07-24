// Array of image URLs
const images = [
    'cowboy/1.png',
    'cowboy/2.png',
    'cowboy/3.png',
    'cowboy/4.png',
    'cowboy/5.png',
    'cowboy/6.png',
    'cowboy/7.png',
    'cowboy/8.png',
    'cowboy/9.png',
    'cowboy/10.png',
    // Add more image URLs as needed
  ];
  
  const imageContainer = document.getElementById('imageContainer');
  let currentImageIndex = 0;
  
  function loadNextImage() {
    // Create a new image element
    const img = new Image();
    img.src = images[currentImageIndex];
  
    // When image is loaded, add it to the container and prepare for the next image
    img.onload = function() {
      // Remove the current active image
      const currentActiveImage = imageContainer.querySelector('.active');
      if (currentActiveImage) {
        currentActiveImage.classList.remove('active');
      }
  
      // Add the new image to the container
      imageContainer.appendChild(img);
      img.classList.add('active');
  
      // Increment current image index and loop back to the beginning if necessary
      currentImageIndex = (currentImageIndex + 1) % images.length;
  
      // Schedule the next image load after a delay (e.g., 3 seconds)
      setTimeout(loadNextImage, 2000); // Change delay as needed (in milliseconds)
    };
  }
  
  // Start the image loading process
  loadNextImage();
  