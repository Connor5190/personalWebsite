// Typing Animation (using Typed.js)
document.addEventListener('DOMContentLoaded', function() {
  const typed = new Typed('.typing-text', {
    strings: ["Web Developer", "UI/UX Designer", "Tech Enthusiast"],
    typeSpeed: 100,
    loop: true
  });

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Project Filter (example)
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      // Filter logic here
    });
  });
});