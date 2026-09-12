/**
 * app.js
 * Premium E-Commerce Portfolio Interactive Scripts
 * Handles Theme Management, Project Categorization & Filtering,
 * Live Africa/Lagos Clock, Cost Estimator, Video Screencast Modal, and FAQ Accordion.
 */

(function () {
  'use strict';

  // --- 1. THEME STATE MANAGER ---
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

    // Sync active state on both desktop and mobile theme buttons
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

  // Watch System Theme changes when set to 'system'
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('bb-portfolio-theme') === 'system') {
      applyTheme('system');
    }
  });


  // --- 2. LIVE NIGERIA (WAT) TIMEZONE WIDGET ---
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
      // Fallback if Intl is unavailable
      const localDate = new Date();
      const utc = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);
      const watTime = new Date(utc + (3600000 * 1)); // WAT is UTC+1
      timeDisplay.textContent = watTime.toLocaleTimeString();
    }
  }
  
  setInterval(updateNigeriaTime, 1000);
  updateNigeriaTime();


  // --- 3. INTERACTIVE PROJECT CATEGORY FILTERING ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.pcard');
  const projCountBadge = document.getElementById('projCountBadge');

  if (filterTabs.length > 0 && projectCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        filterTabs.forEach(t => t.classList.remove('act'));
        this.classList.add('act');

        const filter = this.getAttribute('data-filter');
        let visibleCount = 0;

        projectCards.forEach(card => {
          const categories = (card.getAttribute('data-category') || '').split(' ');
          
          if (filter === 'all' || categories.includes(filter)) {
            card.classList.remove('is-hidden');
            visibleCount++;
            
            // Re-trigger reveal animation smoothly
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.classList.add('is-hidden');
          }
        });

        if (projCountBadge) {
          const label = filter === 'all' ? 'All' : filter.toUpperCase();
          projCountBadge.textContent = `Showing ${visibleCount} ${label === 'All' ? '' : label + ' '}Projects · 2024–2026`;
        }
      });
    });
  }


  // --- 4. INTERACTIVE COST ESTIMATOR ---
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

  let activeService = 'migration';
  let basePrice = 650;
  let productCount = 100;

  servicePills.forEach(pill => {
    pill.addEventListener('click', function () {
      servicePills.forEach(p => p.classList.remove('act'));
      this.classList.add('act');
      
      activeService = this.getAttribute('data-service');
      basePrice = parseFloat(this.getAttribute('data-price'));

      // Show/Hide SKU slider based on service context
      if (activeService === 'codework') {
        if (skuSliderGroup) skuSliderGroup.style.display = 'none';
      } else {
        if (skuSliderGroup) skuSliderGroup.style.display = 'block';
      }

      calculateEstimate();
    });
  });

  // SKU Slider Input Listener
  if (skuSlider) {
    const paintSliderProgress = () => {
      const min = parseFloat(skuSlider.min) || 0;
      const max = parseFloat(skuSlider.max) || 1000;
      const pct = ((skuSlider.value - min) / (max - min)) * 100;
      skuSlider.style.setProperty('--range-progress', `${pct}%`);
    };

    skuSlider.addEventListener('input', function () {
      productCount = parseInt(this.value);
      if (skuDisplayVal) {
        skuDisplayVal.textContent = `${productCount} Products`;
      }
      paintSliderProgress();
      calculateEstimate();
    });

    paintSliderProgress();
  }

  // Addon Checkbox Listeners
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateEstimate);
  });

  function calculateEstimate() {
    if (!calcPriceEl) return;

    let totalUSD = basePrice;
    let detailsHTML = '';

    // 1. Base Service Details
    if (activeService === 'migration') {
      detailsHTML += `<li>• Base Migration Service: $${basePrice} (Up to 100 items)</li>`;
      
      if (productCount > 100) {
        const extraVolume = productCount - 100;
        const extraCharge = Math.ceil(extraVolume / 50) * 25;
        totalUSD += extraCharge;
        detailsHTML += `<li>• Volume SKU Surcharge (${productCount} items): +$${extraCharge}</li>`;
      }
    } 
    else if (activeService === 'newbuild') {
      detailsHTML += `<li>• Base Build & Funnel Setup: $${basePrice} (Physical or Service)</li>`;
      
      if (productCount > 20) {
        const extraVolume = productCount - 20;
        const extraCharge = Math.ceil(extraVolume / 20) * 15;
        totalUSD += extraCharge;
        detailsHTML += `<li>• Volume SKU Surcharge (${productCount} items): +$${extraCharge}</li>`;
      }
    } 
    else if (activeService === 'codework') {
      detailsHTML += `<li>• Shopify / Liquid Custom Code Tasks: $${basePrice}</li>`;
    }

    // 2. Add-ons Calculation
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        const value = parseFloat(cb.value);
        totalUSD += value;
        
        let addonName = '';
        if (cb.id === 'addonImage') addonName = 'Image Cleanup & Product Framing';
        if (cb.id === 'addonSeo') addonName = 'SEO 301 Slugs & Redirect Mapping';
        if (cb.id === 'addonMerchant') addonName = 'Google Merchant Shopping Sync';

        detailsHTML += `<li>• Add-on: ${addonName} (+$${value})</li>`;
      }
    });

    // 3. Convert NGN
    const totalNaira = totalUSD * NAIRA_RATE;

    // 4. Update UI
    calcPriceEl.textContent = `$${totalUSD}`;
    calcNairaEl.textContent = `₦${totalNaira.toLocaleString()}`;
    calcDetailsEl.innerHTML = detailsHTML;

    // 5. Update WhatsApp pre-filled link
    let serviceLabel = 'Platform Migration';
    if (activeService === 'newbuild') serviceLabel = 'New Store / Service Build';
    if (activeService === 'codework') serviceLabel = 'Custom Code Fixes';

    let messageText = `Hello Bayode, I generated a project quote on your portfolio: \n\n`;
    messageText += `*Service:* ${serviceLabel}\n`;
    if (activeService !== 'codework') {
      messageText += `*Product / Item Count:* ${productCount} items\n`;
    }
    
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
    messageText += `Let's discuss my project requirements!`;

    if (whatsappBtn) {
      whatsappBtn.href = `https://wa.me/2348126679348?text=${encodeURIComponent(messageText)}`;
    }
  }

  // Initial Calculation
  calculateEstimate();


  // --- 5. FAQ ACCORDION ---
  window.toggleFaqAccordion = function (buttonElement) {
    if (!buttonElement) return;

    const currentItem = buttonElement.closest('.faq-item');
    const isAlreadyOpen = currentItem.classList.contains('open');

    // Close open items first
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


  // --- 6. SCREENCAST VIDEO MODAL ---
  const videoModal = document.getElementById('videoModal');
  const videoIframe = document.getElementById('videoIframe');

  window.openVideoModal = function (url) {
    if (!videoModal || !videoIframe) return;
    videoIframe.src = url;
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeVideoModal = function () {
    if (!videoModal || !videoIframe) return;
    videoIframe.src = '';
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Close modal when clicking backdrop
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


  // --- 7. NAVIGATION SCROLL & ACTIVE SECTION TRACKER ---
  const navHeader = document.querySelector('header');
  const backToTopBtn = document.getElementById('backToTop');
  const trackedSections = ['about', 'projects', 'estimator', 'services', 'videos', 'proof', 'faq', 'contact'];

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollPos = window.scrollY;

        // Header glassmorphism
        if (navHeader) {
          if (scrollPos > 60) {
            navHeader.classList.add('scrolled');
          } else {
            navHeader.classList.remove('scrolled');
          }
        }

        // Back to top visibility
        if (backToTopBtn) {
          if (scrollPos > 400) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
        }

        // Active Nav link tracking
        const triggerLine = scrollPos + window.innerHeight * 0.35;
        let activeSectionId = '';

        trackedSections.forEach(sectionId => {
          const sectionEl = document.getElementById(sectionId);
          if (sectionEl) {
            const offsetTop = sectionEl.offsetTop;
            if (triggerLine >= offsetTop) {
              activeSectionId = sectionId;
            }
          }
        });

        document.querySelectorAll('[data-s]').forEach(anchorLink => {
          if (anchorLink.getAttribute('data-s') === activeSectionId) {
            anchorLink.classList.add('act');
          } else {
            anchorLink.classList.remove('act');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Back to Top smooth scroll
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // --- 8. LIGHTWEIGHT INTERSECTION OBSERVER REVEALS ---
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.scroll-reveal, .reveal-item').forEach(target => {
    revealObserver.observe(target);
  });

  // Hero elements entry sequence
  const animHeroElements = () => {
    const heroElements = document.querySelectorAll(
      '.avail-widget, .hero-eyebrow, .hero-h1, .hero-tagline, .hero-stats-row, .hero-cta-row, .hero-price-anchor, .hero-bottom'
    );
    heroElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transitionDelay = `${index * 0.07 + 0.04}s`;
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 40);
    });
  };
  
  animHeroElements();

})();
