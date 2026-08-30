/**
 * app.js
 * Premium E-Commerce Portfolio Interactive Scripts
 * Handles custom cursor, local time widget, interactive pricing calculator, video modals, FAQ, and reveal animations.
 */

(function () {
  'use strict';

  // --- THEME STATE MANAGER ---
  const html = document.documentElement;
  const themeButtons = document.querySelectorAll('.tp-btn, .mob-tp-btn');
  const savedTheme = localStorage.getItem('bb-portfolio-theme') || 'dark';

  function applyTheme(theme) {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      html.setAttribute('data-theme', theme);
    }
    
    localStorage.setItem('bb-portfolio-theme', theme);

    // Sync active states on all theme pill buttons
    themeButtons.forEach(btn => {
      if (btn.getAttribute('data-t') === theme) {
        btn.classList.add('act');
      } else {
        btn.classList.remove('act');
      }
    });
  }

  // Initialize Theme
  applyTheme(savedTheme);

  // Bind Theme Clicks
  themeButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      applyTheme(this.getAttribute('data-t'));
    });
  });

  // Watch System Theme changes if set to system
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('bb-portfolio-theme') === 'system') {
      applyTheme('system');
    }
  });


  // --- LIVE NIGERIA TIMEZONE WIDGET ---
  const timeDisplay = document.getElementById('nigeriaTime');
  
  function updateNigeriaTime() {
    if (!timeDisplay) return;
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      timeDisplay.textContent = formatter.format(new Date());
    } catch (e) {
      // Fallback if Intl is unsupported
      const localDate = new Date();
      const utc = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);
      const watTime = new Date(utc + (3600000 * 1)); // WAT is UTC+1
      timeDisplay.textContent = watTime.toLocaleTimeString();
    }
  }
  
  setInterval(updateNigeriaTime, 1000);
  updateNigeriaTime();


  // --- CUSTOM SPRING CURSOR ---
  const cursor = document.getElementById('customCursor');
  const cursorDot = cursor?.querySelector('.cursor-dot');
  const cursorRing = cursor?.querySelector('.cursor-ring');
  const cursorText = cursor?.querySelector('.cursor-text');

  let mouseX = 0, mouseY = 0; // Target coordinates
  let ringX = 0, ringY = 0;   // Interpolated ring coordinates
  let dotX = 0, dotY = 0;     // Interpolated dot coordinates
  let isMoving = false;

  if (cursor) {
    // Show cursor on first movement
    document.addEventListener('mousemove', (e) => {
      if (!isMoving) {
        cursor.style.display = 'block';
        isMoving = true;
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Hide cursor if mouse leaves page
    document.addEventListener('mouseleave', () => {
      cursor.style.display = 'none';
      isMoving = false;
    });

    // Animation Loop (Spring Physics Interpolation)
    const tickCursor = () => {
      // Ring interpolation (slower, springy)
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      // Dot interpolation (faster)
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }
      if (cursorDot) {
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
      }

      requestAnimationFrame(tickCursor);
    };
    requestAnimationFrame(tickCursor);

    // Dynamic Hover States
    const attachCursorHovers = () => {
      // Elements that trigger "VIEW" state
      document.querySelectorAll('.pcard, .vcard, .sv').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.className = 'custom-cursor hovering-project';
          if (cursorText) {
            cursorText.textContent = el.classList.contains('vcard') ? 'PLAY' : 'VIEW';
          }
        });
        el.addEventListener('mouseleave', () => {
          cursor.className = 'custom-cursor';
          if (cursorText) cursorText.textContent = '';
        });
      });

      // Elements that trigger "TALK" or accent states
      document.querySelectorAll('a, button, .service-pill, .addon-card, .faq-q-btn').forEach(el => {
        // Skip card containers if they already have cursor hover overrides
        if (el.closest('.pcard') && !el.classList.contains('pcard-link')) return;
        if (el.closest('.vcard')) return;

        el.addEventListener('mouseenter', () => {
          cursor.className = 'custom-cursor hovering-contact';
          if (cursorText) {
            if (el.classList.contains('calc-whatsapp') || el.classList.contains('clink')) {
              cursorText.textContent = 'TALK';
            } else if (el.classList.contains('tp-btn') || el.classList.contains('mob-tp-btn')) {
              cursorText.textContent = 'THEME';
            } else {
              cursorText.textContent = 'CLICK';
            }
          }
        });
        el.addEventListener('mouseleave', () => {
          cursor.className = 'custom-cursor';
          if (cursorText) cursorText.textContent = '';
        });
      });
    };
    attachCursorHovers();
  }


  // --- INTERACTIVE COST ESTIMATOR ---
  const servicePills = document.querySelectorAll('.service-pill');
  const skuSliderGroup = document.getElementById('productCountGroup');
  const skuSlider = document.getElementById('productCountRange');
  const skuDisplayVal = document.getElementById('productCountVal');
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
  
  const calcPriceEl = document.getElementById('calcPrice');
  const calcNairaEl = document.getElementById('calcNaira');
  const calcDetailsEl = document.getElementById('calcDetails');
  const whatsappBtn = document.getElementById('estimateWhatsAppBtn');

  // Conversion rate (1 USD to NGN)
  const NAIRA_RATE = 1400;

  let activeService = 'migration'; // 'migration', 'newbuild', 'codework'
  let basePrice = 650;
  let productCount = 100;

  // Track active service pill selection
  servicePills.forEach(pill => {
    pill.addEventListener('click', function () {
      servicePills.forEach(p => p.classList.remove('act'));
      this.classList.add('act');
      
      activeService = this.getAttribute('data-service');
      basePrice = parseFloat(this.getAttribute('data-price'));

      // Show/Hide SKU slider group based on service context
      if (activeService === 'codework') {
        skuSliderGroup.style.display = 'none';
      } else {
        skuSliderGroup.style.display = 'block';
      }

      calculateEstimate();
    });
  });

  // SKU Slider Input Listener
  if (skuSlider) {
    skuSlider.addEventListener('input', function () {
      productCount = parseInt(this.value);
      if (skuDisplayVal) {
        skuDisplayVal.textContent = `${productCount} Products`;
      }
      calculateEstimate();
    });
  }

  // Addon Checkbox Listeners
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateEstimate);
  });

  function calculateEstimate() {
    if (!calcPriceEl) return;

    let totalUSD = basePrice;
    let detailsHTML = '';

    // 1. Service Base Details
    if (activeService === 'migration') {
      detailsHTML += `<li>• Base Migration Service: $${basePrice} (Up to 100 products)</li>`;
      
      // Migration scaling: +$25 per additional 50 products above 100 products
      if (productCount > 100) {
        const extraVolume = productCount - 100;
        const extraCharge = Math.ceil(extraVolume / 50) * 25;
        totalUSD += extraCharge;
        detailsHTML += `<li>• Volume SKU Surcharge (${productCount} items): +$${extraCharge}</li>`;
      }
    } 
    else if (activeService === 'newbuild') {
      detailsHTML += `<li>• Base Build Service: $${basePrice} (Up to 20 products)</li>`;
      
      // New build scaling: +$15 per additional 20 products above 20 products
      if (productCount > 20) {
        const extraVolume = productCount - 20;
        const extraCharge = Math.ceil(extraVolume / 20) * 15;
        totalUSD += extraCharge;
        detailsHTML += `<li>• Volume SKU Surcharge (${productCount} items): +$${extraCharge}</li>`;
      }
    } 
    else if (activeService === 'codework') {
      detailsHTML += `<li>• Shopify Custom Code Tasks: $${basePrice} (Quoted base rate)</li>`;
    }

    // 2. Add-ons Calculation
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        const value = parseFloat(cb.value);
        totalUSD += value;
        
        let addonName = '';
        if (cb.id === 'addonImage') addonName = 'Image Background & Branding Crop';
        if (cb.id === 'addonSeo') addonName = 'SEO URL 301 Redirect Mapping';
        if (cb.id === 'addonMerchant') addonName = 'Google Merchant Shopping Sync';

        detailsHTML += `<li>• Add-on: ${addonName} (+$$${value})</li>`;
      }
    });

    // 3. Convert NGN (Naira)
    const totalNaira = totalUSD * NAIRA_RATE;

    // 4. Update UI
    calcPriceEl.textContent = `$${totalUSD}`;
    calcNairaEl.textContent = `₦${totalNaira.toLocaleString()}`;
    calcDetailsEl.innerHTML = detailsHTML;

    // 5. Update WhatsApp pre-filled link
    let serviceLabel = 'Platform Migration';
    if (activeService === 'newbuild') serviceLabel = 'New Store Build';
    if (activeService === 'codework') serviceLabel = 'Shopify Code Fixes';

    let messageText = `Hello Bayode, I generated a project quote on your portfolio: \n\n`;
    messageText += `*Service:* ${serviceLabel}\n`;
    if (activeService !== 'codework') {
      messageText += `*Product Count:* ${productCount} SKUs\n`;
    }
    
    // Checked Add-ons text listing
    const checkedAddons = Array.from(addonCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => {
        if (cb.id === 'addonImage') return 'Image Cleanup';
        if (cb.id === 'addonSeo') return 'SEO Slugs';
        if (cb.id === 'addonMerchant') return 'Google Merchant';
        return '';
      })
      .join(', ');
      
    if (checkedAddons) {
      messageText += `*Add-ons:* ${checkedAddons}\n`;
    }
    
    messageText += `*Estimated Quote:* $${totalUSD} / ₦${totalNaira.toLocaleString()}\n\n`;
    messageText += `Let's discuss my project details!`;

    if (whatsappBtn) {
      whatsappBtn.href = `https://wa.me/2348126679348?text=${encodeURIComponent(messageText)}`;
    }
  }

  // Run Estimator Initial Calculation
  calculateEstimate();


  // --- FAQ ACCORDION TRANSITIONS ---
  window.toggleFaqAccordion = function (buttonElement) {
    if (!buttonElement) return;

    const currentItem = buttonElement.closest('.faq-item');
    const isAlreadyOpen = currentItem.classList.contains('open');

    // Close all open elements first
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('open');
      const btn = item.querySelector('.faq-q-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });

    // Toggle current item
    if (!isAlreadyOpen) {
      currentItem.classList.add('open');
      buttonElement.setAttribute('aria-expanded', 'true');
    }
  };


  // --- PROJECT GRID SEE MORE TOGGLE ---
  const projMoreBtn = document.getElementById('projMoreBtn');
  const projGrid = document.getElementById('projectsGrid');

  if (projMoreBtn && projGrid) {
    projMoreBtn.addEventListener('click', function () {
      const isExpanded = projGrid.classList.toggle('expanded');
      this.textContent = isExpanded ? 'See Less Projects' : 'See More Projects';

      // If collapsing, scroll grid header back into view nicely
      if (!isExpanded) {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }


  // --- SLEEK SCREENCAST VIDEO MODAL ---
  const videoModal = document.getElementById('videoModal');
  const videoIframe = document.getElementById('videoIframe');

  window.openVideoModal = function (url) {
    if (!videoModal || !videoIframe) return;
    videoIframe.src = url;
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  window.closeVideoModal = function () {
    if (!videoModal || !videoIframe) return;
    videoIframe.src = '';
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock background scroll
  };

  // Close modal when clicking dark backdrop space
  videoModal?.addEventListener('click', function (e) {
    if (e.target === this) {
      closeVideoModal();
    }
  });

  // Close modal when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVideoModal();
    }
  });


  // --- NAVIGATION SCROLL EVENTS ---
  const navHeader = document.querySelector('header');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header styling shift
    if (navHeader) {
      if (scrollPos > 60) {
        navHeader.classList.add('scrolled');
      } else {
        navHeader.classList.remove('scrolled');
      }
    }

    // Scroll to Top visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    trackActiveSections();
  }, { passive: true });

  // Scroll to Top action
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // --- TRACKING ACTIVE SECTION LINK INDICATORS ---
  const trackedSections = ['about', 'projects', 'estimator', 'services', 'videos', 'proof', 'faq', 'contact'];
  
  function trackActiveSections() {
    const currentScrollPos = window.scrollY + window.innerHeight * 0.35; // Trigger line
    let activeSectionId = '';

    trackedSections.forEach(sectionId => {
      const sectionEl = document.getElementById(sectionId);
      if (sectionEl) {
        const offsetTop = sectionEl.offsetTop;
        if (currentScrollPos >= offsetTop) {
          activeSectionId = sectionId;
        }
      }
    });

    // Update active highlight classes in both standard nav & mobile nav bar
    document.querySelectorAll('[data-s]').forEach(anchorLink => {
      if (anchorLink.getAttribute('data-s') === activeSectionId) {
        anchorLink.classList.add('act');
      } else {
        anchorLink.classList.remove('act');
      }
    });
  }

  // Run initial call
  trackActiveSections();


  // --- INTERSECTION REVEAL OBSERVER ---
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  // Watch layout components
  document.querySelectorAll('.scroll-reveal, .reveal-item').forEach(target => {
    revealObserver.observe(target);
  });

  // Hero Items entry sequencing (without observer waiting)
  const animHeroElements = () => {
    const heroElements = document.querySelectorAll('.avail-widget, .hero-eyebrow, .hero-h1, .hero-tagline, .hero-stats-row, .hero-cta-row, .hero-price-anchor, .hero-bottom');
    heroElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transitionDelay = `${index * 0.08 + 0.05}s`;
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 50);
    });
  };
  
  animHeroElements();

})();
