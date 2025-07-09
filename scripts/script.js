document.addEventListener('DOMContentLoaded', function() {
  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Navbar scroll effect
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
      navbar.style.height = 'var(--nav-scroll-height)';
      navbar.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
    } else {
      navbar.style.height = 'var(--nav-height)';
      navbar.style.backgroundColor = 'rgba(10, 25, 47, 0.85)';
    }
  });

  // Fade in animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections for fade-in animation
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Enhanced About Section Animations
  const aboutSection = document.getElementById('about');
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger text animations
        const aboutTexts = entry.target.querySelectorAll('.about-text p');
        const skillItems = entry.target.querySelectorAll('.skills-list li');
        
        aboutTexts.forEach((text, index) => {
          setTimeout(() => {
            text.style.animationPlayState = 'running';
          }, index * 200);
        });
        
        skillItems.forEach((skill, index) => {
          setTimeout(() => {
            skill.style.animationPlayState = 'running';
          }, 700 + index * 100);
        });
        
        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  if (aboutSection) {
    // Pause animations initially
    aboutSection.querySelectorAll('.about-text p, .skills-list li').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
    aboutObserver.observe(aboutSection);
  }

  // Interactive skill effects
  document.querySelectorAll('.skills-list li').forEach(skill => {
    skill.addEventListener('mouseenter', function() {
      // Create ripple effect
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(100, 255, 218, 0.4)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.left = '50%';
      ripple.style.top = '50%';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.marginLeft = '-10px';
      ripple.style.marginTop = '-10px';
      ripple.style.pointerEvents = 'none';
      
      this.style.position = 'relative';
      this.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    });
  });

  // Typing animation function
  function typeWriter(element, text, speed = 100, callback) {
    let i = 0;
    element.classList.add('typing-cursor');
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        element.classList.remove('typing-cursor');
        if (callback) callback();
      }
    }
    type();
  }

  // Hero section fade-in and typing
  const heroContent = document.querySelector('.hero-content');
  const typedName = document.getElementById('typed-name');
  const typedSubtitle = document.getElementById('typed-subtitle');
  
  if (heroContent && typedName && typedSubtitle) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
      
      // Start typing name after fade-in
      setTimeout(() => {
        typeWriter(typedName, 'Connor Mcilhinney.', 80, () => {
          // Start typing subtitle after name is complete
          setTimeout(() => {
            typeWriter(typedSubtitle, 'I build things.', 80);
          }, 300);
        });
      }, 500);
    }, 100);
  }

  // D3.js 3D Network Animation
  const container = document.getElementById('d3-background');
  if (container) {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    const svg = d3.select('#d3-background')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    const nodes = d3.range(50).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 3 + 1
    }));
    
    const links = [];
    nodes.forEach((node, i) => {
      nodes.slice(i + 1).forEach((otherNode, j) => {
        if (Math.random() < 0.1) {
          links.push({ source: node, target: otherNode });
        }
      });
    });
    
    const link = svg.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link')
      .style('stroke', '#64ffda')
      .style('stroke-opacity', 0.3)
      .style('stroke-width', 1);
    
    const node = svg.selectAll('.node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', d => d.radius)
      .style('fill', '#64ffda')
      .style('opacity', 0.6);
    
    function animate() {
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));
      });
      
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }

  // Fun Facts D3 Visualizations
  // Soccer goal and ball animation
  const soccerViz = d3.select('#soccer-viz')
    .append('svg')
    .attr('width', '100%')
    .attr('height', 60);
  
  // Goal posts
  soccerViz.append('text')
    .attr('x', 220)
    .attr('y', 35)
    .attr('font-size', '30px')
    .text('🥅')
    .attr('opacity', 0.7);
  
  const ball = soccerViz.append('text')
    .attr('x', 20)
    .attr('y', 35)
    .attr('font-size', '20px')
    .text('⚽');
  
  function animateBall() {
    ball.transition()
      .duration(1500)
      .attr('x', 215)
      .on('end', function() {
        // Explosion effect
        d3.select(this).text('💥')
          .attr('font-size', '25px')
          .transition()
          .duration(500)
          .attr('opacity', 0)
          .on('end', function() {
            d3.select(this)
              .text('⚽')
              .attr('font-size', '20px')
              .attr('x', 20)
              .attr('opacity', 1);
            setTimeout(animateBall, 1000);
          });
      });
  }
  animateBall();

  // Country flags display
  const travelViz = d3.select('#travel-viz')
    .append('svg')
    .attr('width', '100%')
    .attr('height', 60);
  
  const countryFlags = [ '\uD83C\uDDEA\uD83C\uDDF8', // Spain
  '\uD83C\uDDEE\uD83C\uDDF9', // Italy
  '\uD83C\uDDF2\uD83C\uDDE6', // Morocco
  '\uD83C\uDDE9\uD83C\uDDEA', // Germany
  '\uD83C\uDDF3\uD83C\uDDF1', // Netherlands
  '\uD83C\uDDEE\uD83C\uDDEA', // Ireland
  '\uD83C\uDDED\uD83C\uDDF7', // Croatia
  '\uD83C\uDDE7\uD83C\uDDE6'  // Bosnia and Herzegovina
  ]
  
  travelViz.selectAll('.country-flag')
    .data(countryFlags)
    .enter()
    .append('text')
    .attr('class', 'country-flag')
    .attr('x', (d, i) => 15 + i * 30)
    .attr('y', 35)
    .attr('font-size', '20px')
    .attr('opacity', 0)
    .text(d => d)
    .transition()
    .delay((d, i) => i * 200)
    .duration(500)
    .attr('opacity', 1);

  // Family chaos animation
  const familyViz = d3.select('#family-viz')
    .append('svg')
    .attr('width', '100%')
    .attr('height', 60);
  
  // Family house
  familyViz.append('text')
    .attr('x', 10)
    .attr('y', 35)
    .attr('font-size', '25px')
    .text('🏠')
    .attr('opacity', 0)
    .transition()
    .duration(500)
    .attr('opacity', 1);
  
  // Family members with chaos effect
  const familyData = [
    { emoji: '👨', x: 50, y: 25, delay: 200 },
    { emoji: '👩', x: 70, y: 25, delay: 400 },
    { emoji: '👦', x: 90, y: 35, delay: 600 },
    { emoji: '👧', x: 110, y: 35, delay: 800 },
    { emoji: '👶', x: 130, y: 35, delay: 1000 },
    { emoji: '🧒', x: 150, y: 35, delay: 1200 },
    { emoji: '🐕', x: 180, y: 40, delay: 1400 },
    { emoji: '🐕', x: 200, y: 40, delay: 1600 },
    { emoji: '🐕', x: 220, y: 40, delay: 1800 },
    { emoji: '🐱', x: 240, y: 40, delay: 2000 }
  ];
  
  familyData.forEach((member, i) => {
    const memberElement = familyViz.append('text')
      .attr('x', member.x)
      .attr('y', member.y)
      .attr('font-size', '16px')
      .text(member.emoji)
      .attr('opacity', 0)
      .transition()
      .delay(member.delay)
      .duration(300)
      .attr('opacity', 1)
      .on('end', function() {
        // Add bouncing animation
        d3.select(this)
          .transition()
          .duration(800)
          .attr('y', member.y - 5)
          .transition()
          .duration(800)
          .attr('y', member.y)
          .on('end', function bounce() {
            d3.select(this)
              .transition()
              .duration(1000 + Math.random() * 1000)
              .attr('y', member.y - Math.random() * 8)
              .transition()
              .duration(1000 + Math.random() * 1000)
              .attr('y', member.y)
              .on('end', bounce);
          });
      });
  });
  
  // Chaos indicator
  setTimeout(() => {
    familyViz.append('text')
      .attr('x', 270)
      .attr('y', 35)
      .attr('font-size', '20px')
      .text('💥')
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1)
      .transition()
      .delay(500)
      .duration(500)
      .attr('opacity', 0)
      .on('end', function flash() {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .transition()
          .duration(300)
          .attr('opacity', 0)
          .on('end', () => setTimeout(flash, Math.random() * 3000 + 2000));
      });
  }, 2500);
  
  // Experience Section D3 Effects
  const experienceSection = document.getElementById('experience');
  const experienceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const jobs = entry.target.querySelectorAll('.job');
        
        jobs.forEach((job, index) => {
          setTimeout(() => {
            job.style.opacity = '1';
            job.style.transform = 'translateX(0)';
            
            // Animate skill bar
            const skillFill = job.querySelector('.job-skills-fill');
            const skillLevel = job.dataset.skills;
            if (skillFill && skillLevel) {
              setTimeout(() => {
                skillFill.style.width = skillLevel + '%';
              }, 300);
            }
            
            // Animate description items
            const descItems = job.querySelectorAll('.job-description li');
            descItems.forEach((item, i) => {
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, 500 + i * 100);
            });
          }, index * 200);
        });
        
        experienceObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  if (experienceSection) {
    experienceObserver.observe(experienceSection);
  }

  // D3 Experience Visualizations
  // PDI Tech Stack - Animated dots
  const pdiViz = d3.select('#pdi-viz')
    .append('svg')
    .attr('width', '100%')
    .attr('height', 60);
  
  const techData = d3.range(8).map(i => ({ x: 20 + i * 30, y: 30 }));
  pdiViz.selectAll('.tech-dot')
    .data(techData)
    .enter()
    .append('circle')
    .attr('class', 'tech-dot')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 0)
    .attr('fill', '#64ffda')
    .attr('opacity', 0.7)
    .transition()
    .delay((d, i) => i * 100)
    .duration(500)
    .attr('r', 4)
    .on('end', function() {
      d3.select(this)
        .transition()
        .duration(1500)
        .attr('r', 6)
        .attr('opacity', 0.4)
        .transition()
        .duration(1500)
        .attr('r', 4)
        .attr('opacity', 0.7)
        .on('end', function pulse() {
          d3.select(this)
            .transition()
            .duration(2000 + Math.random() * 1000)
            .attr('r', 6)
            .attr('opacity', 0.4)
            .transition()
            .duration(2000 + Math.random() * 1000)
            .attr('r', 4)
            .attr('opacity', 0.7)
            .on('end', pulse);
        });
    });

  // GT Investment Committee - Stock chart simulation
  const gtViz = d3.select('#gt-viz')
    .append('svg')
    .attr('width', '100%')
    .attr('height', 60);
  
  const chartData = d3.range(10).map(i => ({ x: i * 25, y: 30 + Math.random() * 20 }));
  
  const line = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveMonotoneX);
  
  gtViz.append('path')
    .datum(chartData)
    .attr('fill', 'none')
    .attr('stroke', '#64ffda')
    .attr('stroke-width', 2)
    .attr('d', line)
    .attr('stroke-dasharray', function() { return this.getTotalLength(); })
    .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
    .transition()
    .duration(2000)
    .attr('stroke-dashoffset', 0);
  
  gtViz.selectAll('.data-point')
    .data(chartData)
    .enter()
    .append('circle')
    .attr('class', 'data-point')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 0)
    .attr('fill', '#64ffda')
    .transition()
    .delay((d, i) => i * 200)
    .duration(300)
    .attr('r', 3);

  // Canopy - Growth bars
  const canopyViz = d3.select('#canopy-viz')
    .append('svg')
    .attr('width', '100%')
    .attr('height', 60);
  
  const growthBars = [15, 25, 35, 20, 30];
  canopyViz.selectAll('.growth-bar')
    .data(growthBars)
    .enter()
    .append('rect')
    .attr('class', 'growth-bar')
    .attr('x', (d, i) => 20 + i * 40)
    .attr('y', 50)
    .attr('width', 25)
    .attr('height', 0)
    .attr('fill', '#64ffda')
    .attr('opacity', 0.7)
    .transition()
    .delay((d, i) => i * 300)
    .duration(1000)
    .attr('height', d => d)
    .attr('y', d => 50 - d);
  
  // Add ripple animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});