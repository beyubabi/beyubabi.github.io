/**
 * app.js
 * Interactive Logic for Bayode Akindiose Portfolio
 * Handles Theme Management, Project Category Filtering, Interactive Scope Estimator,
 * Project Deep-Dive Modal, Video Screencast Modal, Lagos Clock, and FAQ Accordions.
 */

(function () {
  'use strict';

  // --- 1. THEME STATE MANAGER ---
  const html = document.documentElement;
  const themeButtons = document.querySelectorAll('.tp-btn');
  const mobThemeQuickBtn = document.getElementById('mobThemeQuickToggle');
  const savedTheme = localStorage.getItem('bb-portfolio-theme') || 'dark';

  function applyTheme(theme) {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      html.setAttribute('data-theme', theme);
    }
    
    localStorage.setItem('bb-portfolio-theme', theme);

    // Sync active state on all theme buttons
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

  // Bind Theme Button Clicks
  themeButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      applyTheme(this.getAttribute('data-t'));
    });
  });

  // Mobile Quick Toggle Switch
  if (mobThemeQuickBtn) {
    mobThemeQuickBtn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // Watch System Theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('bb-portfolio-theme') === 'system') {
      applyTheme('system');
    }
  });


  // --- 2. LIVE LAGOS (WAT) CLOCK ---
  const timeDisplayHero = document.getElementById('nigeriaTime');
  const timeDisplayNav = document.getElementById('nigeriaTimeNav');
  const timeDisplayDrawer = document.getElementById('nigeriaTimeDrawer');
  
  function updateNigeriaTime() {
    let formattedTime = '';
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      formattedTime = formatter.format(new Date());
    } catch (e) {
      const localDate = new Date();
      const utc = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);
      const watTime = new Date(utc + (3600000 * 1)); // WAT is UTC+1
      formattedTime = watTime.toLocaleTimeString();
    }

    if (timeDisplayHero) timeDisplayHero.textContent = formattedTime;
    if (timeDisplayNav) timeDisplayNav.textContent = formattedTime;
    if (timeDisplayDrawer) timeDisplayDrawer.textContent = formattedTime;
  }
  
  setInterval(updateNigeriaTime, 1000);
  updateNigeriaTime();


  // --- 3. MOBILE NAVIGATION DRAWER & DOCK ---
  const mobDrawerOverlay = document.getElementById('mobDrawerOverlay');
  const mobMenuOpenBtn = document.getElementById('mobMenuOpenBtn');
  const dockMoreBtn = document.getElementById('dockMoreBtn');
  const mobDrawerCloseBtn = document.getElementById('mobDrawerCloseBtn');
  const drawerLinks = document.querySelectorAll('[data-drawer-link]');

  function openDrawer() {
    if (!mobDrawerOverlay) return;
    mobDrawerOverlay.classList.add('open');
    mobDrawerOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobDrawerOverlay) return;
    mobDrawerOverlay.classList.remove('open');
    mobDrawerOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  mobMenuOpenBtn?.addEventListener('click', openDrawer);
  dockMoreBtn?.addEventListener('click', openDrawer);
  mobDrawerCloseBtn?.addEventListener('click', closeDrawer);

  mobDrawerOverlay?.addEventListener('click', function (e) {
    if (e.target === this) {
      closeDrawer();
    }
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });


  // --- 4. PROJECT CATEGORY FILTERING ---
  const filterTabs = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projCountBadge = document.getElementById('projCountBadge');

  if (filterTabs.length > 0 && projectCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        if (this.classList.contains('act')) return;

        filterTabs.forEach(t => t.classList.remove('act'));
        this.classList.add('act');

        const filter = this.getAttribute('data-filter');
        let visibleCount = 0;

        projectCards.forEach(card => {
          const categories = (card.getAttribute('data-category') || '').split(' ');
          const matches = filter === 'all' || categories.includes(filter);

          if (matches) {
            visibleCount++;
            card.classList.remove('is-hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.classList.add('is-hidden');
          }
        });

        if (projCountBadge) {
          let label = '';
          if (filter === 'shopify') label = 'Shopify';
          else if (filter === 'wordpress') label = 'WooCommerce';
          else if (filter === 'conversion') label = 'Conversion';
          
          projCountBadge.textContent = `Showing ${visibleCount} ${label ? label + ' ' : ''}Projects · 2024–2026`;
        }
      });
    });
  }


  // --- 5. PROJECT DEEP-DIVE MODAL SYSTEM ---
  const projectDatabase = {
    'oversize-plus': {
      title: 'Oversize Plus',
      subtitle: 'Custom Apparel Brand • Shopify Liquid & Variant Customizer',
      badge: 'Custom Apparel',
      year: '2025–2026',
      image: 'https://raw.githubusercontent.com/beyubabi/beyubabi.github.io/main/oversized-plus.jpg',
      metrics: [
        { val: '+34%', lbl: 'Mobile Add-to-Cart' },
        { val: '0.9s', lbl: 'Catalog Paint Time' },
        { val: '100%', lbl: 'Custom Variant Flow' }
      ],
      challenge: 'The brand needed an engaging apparel customization experience where buyers could visually choose oversized silhouettes and fabrics without clunky separate product pages.',
      solution: 'Engineered custom Shopify Liquid templates with an interactive variant builder. Added sticky mobile buy buttons and instant color switching for frictionless purchasing.',
      tags: ['Shopify Liquid', 'Variant Builder', 'Mobile CRO', 'Custom CSS', 'Core Web Vitals'],
      liveUrl: 'https://oversizedplus.myshopify.com',
      liveText: 'Explore Store (Password: 1) ↗'
    },
    'fresh-juice': {
      title: 'Fresh Juice',
      subtitle: 'Portable Blenders • High-Converting DTC Funnel',
      badge: 'Single-Product Funnel',
      year: '2025',
      image: 'https://raw.githubusercontent.com/beyubabi/beyubabi.github.io/main/fresh-juice.jpg',
      metrics: [
        { val: '2-Tap', lbl: 'Mobile Checkout' },
        { val: '98/100', lbl: 'Lighthouse Score' },
        { val: '4.9★', lbl: 'Photo Social Proof' }
      ],
      challenge: 'High drop-offs on mobile ad traffic caused by slow video loading, buried product benefits, and confusing multi-step checkout forms.',
      solution: 'Re-architected into a streamlined high-velocity landing page. Integrated video modules with zero layout shift, synced Loox photo reviews for instant trust, and stripped checkout friction down to 2 taps.',
      tags: ['Shopify DTC', 'Loox Reviews', 'Fast Checkout', 'Speed Optimization', 'Mobile Conversion'],
      liveUrl: 'https://fresh-juice-7.myshopify.com',
      liveText: 'Explore Store (Password: 1) ↗'
    },
    'toko': {
      title: 'Toko (Dubai)',
      subtitle: '3D Printed Toys • Shopify Rebuild & UAE Logistics Setup',
      badge: 'UAE Contract',
      year: '2025',
      image: 'https://raw.githubusercontent.com/beyubabi/beyubabi.github.io/main/toko.jpg',
      metrics: [
        { val: '5.0★', lbl: 'Upwork Rating' },
        { val: '100%', lbl: 'UAE Currency & Shipping' },
        { val: '0 Errors', lbl: 'Delivered Early' }
      ],
      challenge: 'An international client needed an agency subcontractor to configure multi-tier 3D toy bundling and integrate localized UAE payment gateways and shipping rules.',
      solution: 'Delivered a clean Shopify rebuild with custom Liquid product bundling, automated delivery rate lookups for the Middle East, and passed all technical acceptance tests ahead of deadline.',
      tags: ['Shopify Liquid', 'Product Bundling', 'UAE Logistics', 'Currency Matrix', 'Upwork Verified'],
      liveUrl: '#proof',
      liveText: 'View Upwork Verified Review ↗'
    },
    'bayu-tech': {
      title: 'Bayu Tech',
      subtitle: 'Apple Gadgets E-Store • WordPress + WooCommerce Architecture',
      badge: 'WooCommerce',
      year: '2024–2025',
      image: 'https://raw.githubusercontent.com/beyubabi/beyubabi.github.io/main/bayu-tech.jpg',
      metrics: [
        { val: '250+', lbl: 'High-Ticket SKUs' },
        { val: 'Instant', lbl: 'Spec Filter Query' },
        { val: 'Automated', lbl: 'PDF Invoice Pipeline' }
      ],
      challenge: 'Managing heavy Apple product spec sheets, serial number tracking, variant storage capacities, and multi-tier pricing filters on a resource-constrained server.',
      solution: 'Customized WooCommerce core hooks, optimized MySQL database indexing for sub-second filter queries, built custom checkout styling, and implemented automated invoice generation.',
      tags: ['WordPress', 'WooCommerce', 'MySQL Optimization', 'Custom Checkout', 'PHP/JS'],
      liveUrl: 'https://beyutech.gt.tc/?i=3',
      liveText: 'Open Staging Demo (gt.tc) ↗'
    },
    'incredible-fiber': {
      title: 'Incredible Fiber',
      subtitle: 'Specialty Flour Brand • Wix → Shopify Replatform',
      badge: 'Wix Replatform',
      year: '2024–2025',
      image: 'https://raw.githubusercontent.com/beyubabi/beyubabi.github.io/main/incredible-fibre.jpg',
      metrics: [
        { val: '-45%', lbl: 'Mobile Page Weight' },
        { val: '100%', lbl: 'Weight Variants Preserved' },
        { val: '0', lbl: '404 Broken Links' }
      ],
      challenge: 'The client was locked into an unoptimized Wix store with sluggish mobile loading, messy multi-weight variant drop-downs, and disconnected recipe content.',
      solution: 'Migrated products and customer data onto Shopify. Standardized weight-based SKU matrices, rebuilt recipe content navigation, and reduced mobile load times by over 45%.',
      tags: ['Shopify Replatform', 'Weight Variants', 'Recipe Engine', 'SEO Slugs', 'Mobile UX'],
      liveUrl: 'https://incredible-fibre.myshopify.com',
      liveText: 'Explore Store (Password: 1) ↗'
    },
    'kuchewood': {
      title: 'Küchewood',
      subtitle: 'Eco Wooden Kitchenware • Shopify Theme Build',
      badge: 'Shopify Theme',
      year: '2024',
      image: 'https://raw.githubusercontent.com/beyubabi/beyubabi.github.io/main/kuchewood.jpg',
      metrics: [
        { val: '100%', lbl: 'Mobile Responsive' },
        { val: 'Clean', lbl: 'SEO Schema Markup' },
        { val: '1st', lbl: 'Milestone Build' }
      ],
      challenge: 'Creating an organic, tactile kitchenware storefront with structured department filters and clean mobile viewing.',
      solution: 'Engineered an organic kitchenware catalog layout with rich department filters, schema SEO markups, and fast responsive product cards.',
      tags: ['Shopify Theme', 'SEO Schema', 'Catalogue Layout', 'Clean Code'],
      liveUrl: 'https://kuchewood.myshopify.com',
      liveText: 'Explore Store (Password: 1) ↗'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const pmodalBadge = document.getElementById('pmodalBadge');
  const pmodalYear = document.getElementById('pmodalYear');
  const pmodalTitle = document.getElementById('pmodalTitle');
  const pmodalSubtitle = document.getElementById('pmodalSubtitle');
  const pmodalImg = document.getElementById('pmodalImg');
  const pmodalMetrics = document.getElementById('pmodalMetrics');
  const pmodalChallenge = document.getElementById('pmodalChallenge');
  const pmodalSolution = document.getElementById('pmodalSolution');
  const pmodalTags = document.getElementById('pmodalTags');
  const pmodalLiveBtn = document.getElementById('pmodalLiveBtn');
  const pmodalWhatsAppBtn = document.getElementById('pmodalWhatsAppBtn');

  window.openProjectModal = function (projectId) {
    const data = projectDatabase[projectId];
    if (!data || !projectModal) return;

    if (pmodalBadge) pmodalBadge.textContent = data.badge;
    if (pmodalYear) pmodalYear.textContent = data.year;
    if (pmodalTitle) pmodalTitle.textContent = data.title;
    if (pmodalSubtitle) pmodalSubtitle.textContent = data.subtitle;
    if (pmodalImg) {
      pmodalImg.src = data.image;
      pmodalImg.alt = `${data.title} Preview`;
    }

    if (pmodalMetrics) {
      pmodalMetrics.innerHTML = data.metrics.map(m => `
        <div class="pm-box">
          <div class="pm-val">${m.val}</div>
          <div class="pm-lbl">${m.lbl}</div>
        </div>
      `).join('');
    }

    if (pmodalChallenge) pmodalChallenge.textContent = data.challenge;
    if (pmodalSolution) pmodalSolution.textContent = data.solution;

    if (pmodalTags) {
      pmodalTags.innerHTML = data.tags.map(t => `<span>${t}</span>`).join('');
    }

    if (pmodalLiveBtn) {
      pmodalLiveBtn.href = data.liveUrl;
      pmodalLiveBtn.textContent = data.liveText;
    }

    if (pmodalWhatsAppBtn) {
      const waMsg = `Hi Bayode, I saw your case breakdown for "${data.title}" on your portfolio. I'd like to discuss a similar build for my store!`;
      pmodalWhatsAppBtn.href = `https://wa.me/2348126679348?text=${encodeURIComponent(waMsg)}`;
    }

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function () {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };


  // --- 6. INTERACTIVE ESTIMATOR ---
  const servicePills = document.querySelectorAll('.service-toggle-btn');
  const skuSliderGroup = document.getElementById('productCountGroup');
  const skuSlider = document.getElementById('productCountRange');
  const skuDisplayVal = document.getElementById('productCountVal');
  const platformChips = document.querySelectorAll('.plat-chip');
  const addonsGroup = document.getElementById('addonsGroup');
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
  
  const calcPriceEl = document.getElementById('calcPrice');
  const calcNairaEl = document.getElementById('calcNaira');
  const calcDetailsEl = document.getElementById('calcDetails');
  const whatsappBtn = document.getElementById('estimateWhatsAppBtn');

  const NAIRA_RATE = 1400;

  let activeService = 'migration';
  let basePrice = 650;
  let productCount = 100;
  let activePlatform = 'WooCommerce';

  // Service Selection
  servicePills.forEach(pill => {
    pill.addEventListener('click', function () {
      servicePills.forEach(p => p.classList.remove('act'));
      this.classList.add('act');
      
      activeService = this.getAttribute('data-service');
      basePrice = parseFloat(this.getAttribute('data-price'));

      if (activeService === 'audit') {
        if (skuSliderGroup) skuSliderGroup.style.display = 'none';
        if (addonsGroup) addonsGroup.style.display = 'none';
      } else {
        if (skuSliderGroup) skuSliderGroup.style.display = 'block';
        if (addonsGroup) addonsGroup.style.display = 'block';
      }

      calculateEstimate();
    });
  });

  // Platform Selection
  platformChips.forEach(chip => {
    chip.addEventListener('click', function () {
      platformChips.forEach(c => c.classList.remove('act'));
      this.classList.add('act');
      activePlatform = this.getAttribute('data-plat');
      calculateEstimate();
    });
  });

  // Slider Input
  if (skuSlider) {
    const paintSliderProgress = () => {
      const min = parseFloat(skuSlider.min) || 0;
      const max = parseFloat(skuSlider.max) || 1000;
      const pct = ((skuSlider.value - min) / (max - min)) * 100;
      skuSlider.style.setProperty('--range-progress', `${pct}%`);
    };

    ['input', 'change'].forEach(evt => {
      skuSlider.addEventListener(evt, function () {
        productCount = parseInt(this.value);
        if (skuDisplayVal) {
          skuDisplayVal.textContent = `${productCount} Products`;
        }
        paintSliderProgress();
        calculateEstimate();
      });
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

    if (activeService === 'migration') {
      detailsHTML += `<li>• Shopify Migration Rescue (Base up to 100 SKUs): $${basePrice}</li>`;
      if (productCount > 100) {
        const extraVolume = productCount - 100;
        const extraCharge = Math.ceil(extraVolume / 50) * 35;
        totalUSD += extraCharge;
        detailsHTML += `<li>• Catalog Volume Surcharge (${productCount} items): +$${extraCharge}</li>`;
      }
    } 
    else if (activeService === 'conversion') {
      detailsHTML += `<li>• Conversion Repair Sprint: $${basePrice} (1-Week Sprint)</li>`;
      if (productCount > 50) {
        const extraVolume = productCount - 50;
        const extraCharge = Math.ceil(extraVolume / 25) * 20;
        totalUSD += extraCharge;
        detailsHTML += `<li>• Extended Catalog Review (${productCount} items): +$${extraCharge}</li>`;
      }
    } 
    else if (activeService === 'audit') {
      detailsHTML += `<li>• Strategic Store Audit & 15-Min Video Teardown: $${basePrice}</li>`;
      detailsHTML += `<li>• 100% credited toward build if hired for fixes</li>`;
    }

    // Addons
    if (activeService !== 'audit') {
      addonCheckboxes.forEach(cb => {
        if (cb.checked) {
          const value = parseFloat(cb.value);
          totalUSD += value;
          
          let addonName = '';
          if (cb.id === 'addonImage') addonName = 'Batch Image 1:1 Canvas Framing';
          if (cb.id === 'addonSeo') addonName = 'Complete 301 URL SEO Redirection Map';
          if (cb.id === 'addonMerchant') addonName = 'Google Merchant Shopping Feed Sync';

          detailsHTML += `<li>• Add-on: ${addonName} (+$${value})</li>`;
        }
      });
    }

    const totalNaira = totalUSD * NAIRA_RATE;

    calcPriceEl.textContent = `$${totalUSD}`;
    calcNairaEl.textContent = `₦${totalNaira.toLocaleString()}`;
    calcDetailsEl.innerHTML = detailsHTML;

    // WhatsApp Message
    let serviceLabel = 'Shopify Migration Rescue';
    if (activeService === 'conversion') serviceLabel = 'Conversion Repair Sprint';
    else if (activeService === 'audit') serviceLabel = 'Strategic Store Audit ($120)';

    let messageText = `Hi Bayode, I need help with my e-commerce store.\n\n`;
    messageText += `*Service Requested:* ${serviceLabel}\n`;
    messageText += `*Current Platform:* ${activePlatform}\n`;
    if (activeService !== 'audit') {
      messageText += `*Estimated Products:* ${productCount} items\n`;
    }
    messageText += `*Estimated Scope Quote:* $${totalUSD} / ₦${totalNaira.toLocaleString()}\n\n`;
    messageText += `Let's discuss my project requirements!`;

    if (whatsappBtn) {
      whatsappBtn.href = `https://wa.me/2348126679348?text=${encodeURIComponent(messageText)}`;
    }
  }

  calculateEstimate();


  // --- 7. FAQ ACCORDION ---
  window.toggleFaqAccordion = function (buttonElement) {
    if (!buttonElement) return;

    const currentItem = buttonElement.closest('.faq-item');
    const isAlreadyOpen = currentItem.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('open');
      const btn = item.querySelector('.faq-toggle-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });

    if (!isAlreadyOpen) {
      currentItem.classList.add('open');
      buttonElement.setAttribute('aria-expanded', 'true');
    }
  };


  // --- 8. VIDEO MODAL ---
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

  videoModal?.addEventListener('click', function (e) {
    if (e.target === this) {
      closeVideoModal();
    }
  });

  // Global ESC Key Listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVideoModal();
      closeProjectModal();
      closeDrawer();
    }
  });


  // --- 9. NAVIGATION SCROLL & ACTIVE SECTION TRACKER ---
  const navHeader = document.querySelector('header');
  const backToTopBtn = document.getElementById('backToTop');
  const trackedSections = ['hero', 'case-study', 'services', 'estimator', 'projects', 'videos', 'stack', 'proof', 'faq', 'contact'];

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollPos = window.scrollY;

        if (navHeader) {
          if (scrollPos > 30) {
            navHeader.classList.add('scrolled');
          } else {
            navHeader.classList.remove('scrolled');
          }
        }

        if (backToTopBtn) {
          if (scrollPos > 300) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
        }

        const triggerLine = scrollPos + window.innerHeight * 0.35;
        let activeSectionId = '';

        trackedSections.forEach(sectionId => {
          const sectionEl = document.getElementById(sectionId);
          if (sectionEl) {
            if (triggerLine >= sectionEl.offsetTop) {
              activeSectionId = sectionId;
            }
          }
        });

        // Sync Desktop Nav
        document.querySelectorAll('.nav-links a[data-s]').forEach(a => {
          if (a.getAttribute('data-s') === activeSectionId) {
            a.classList.add('act');
          } else {
            a.classList.remove('act');
          }
        });

        // Sync Mobile Dock
        document.querySelectorAll('.mob-nav-dock .dock-item[data-s]').forEach(d => {
          if (d.getAttribute('data-s') === activeSectionId) {
            d.classList.add('act');
          } else {
            d.classList.remove('act');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // --- 10. INTERSECTION OBSERVER REVEALS ---
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -20px 0px'
  });

  document.querySelectorAll('.scroll-reveal, .reveal-item').forEach(target => {
    revealObserver.observe(target);
  });

})();
