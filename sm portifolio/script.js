// Navigation Toggle & Smooth Scroll
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  const header = document.querySelector('.site-header');

  // Mobile Menu Toggle
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('show');
      navToggle.textContent = nav.classList.contains('show') ? '✕' : '☰';
    });
  }

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('show')) {
        nav.classList.remove('show');
        navToggle.textContent = '☰';
      }
    });
  });

  // Header Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Animated Counters
  const counters = document.querySelectorAll('.stat-value');
  const options = { threshold: 0.5 };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-count');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps

        let current = 0;
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current) + (target > 100 ? '+' : '');
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + (target > 100 ? '+' : '');
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, options);

  counters.forEach(counter => {
    observer.observe(counter);
  });

  // Scroll Reveal Animation for Sections
  const revealElements = document.querySelectorAll('section');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.classList.add('reveal-hidden'); // Initial state
    revealObserver.observe(el);
  });

  // Testimonials carousel (horizontal scroll + arrow buttons)
  const testimonialCarousel = document.getElementById('testimonialCarousel');
  const testimonialPrev = document.getElementById('testimonialPrev');
  const testimonialNext = document.getElementById('testimonialNext');

  function setTestimonialCardWidths() {
    if (!testimonialCarousel) return;
    const w = testimonialCarousel.clientWidth;
    const gap = 28;
    const isWide = window.innerWidth >= 951;
    const cardW = isWide ? (w - 2 * gap) / 3 : Math.min(w * 0.92, 400);
    testimonialCarousel.style.setProperty('--card-w', `${Math.max(240, cardW)}px`);
  }

  function updateTestimonialNav() {
    if (!testimonialCarousel || !testimonialPrev || !testimonialNext) return;
    const { scrollLeft, scrollWidth, clientWidth } = testimonialCarousel;
    const atStart = scrollLeft <= 2;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 2;
    testimonialPrev.disabled = atStart;
    testimonialNext.disabled = atEnd;
  }

  if (testimonialCarousel && testimonialPrev && testimonialNext) {
    const scrollPage = (dir) => {
      testimonialCarousel.scrollBy({
        left: dir * testimonialCarousel.clientWidth,
        behavior: 'smooth'
      });
    };

    const sync = () => {
      setTestimonialCardWidths();
      updateTestimonialNav();
    };

    sync();
    requestAnimationFrame(sync);
    window.addEventListener('resize', sync);

    testimonialPrev.addEventListener('click', () => scrollPage(-1));
    testimonialNext.addEventListener('click', () => scrollPage(1));

    testimonialCarousel.addEventListener('scroll', updateTestimonialNav, { passive: true });

    testimonialCarousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollPage(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollPage(1);
      }
    });
  }

  // Contact Form Handling
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const originalText = btn.textContent;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate sending
      setTimeout(() => {
        btn.textContent = 'Message Sent!';
        btn.style.backgroundColor = '#00ff88';
        btn.style.color = '#000';
        form.reset();

        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.backgroundColor = '';
          btn.style.color = '';
        }, 3000);
      }, 1500);
    });
  }
});


// Lightbox functions (kept as is)
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  lightbox.classList.add('active');
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
}

// Scroll Spy for Navigation Highlighting
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav a');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});
