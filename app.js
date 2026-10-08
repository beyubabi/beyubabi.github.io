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
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(btn.getAttribute('data-t') === theme));
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
    mobMenuOpenBtn?.setAttribute('aria-expanded', 'true');
    mobDrawerCloseBtn?.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobDrawerOverlay) return;
    mobDrawerOverlay.classList.remove('open');
    mobDrawerOverlay.setAttribute('aria-hidden', 'true');
    mobMenuOpenBtn?.setAttribute('aria-expanded', 'false');
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
    filterTabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.classList.contains('act'))));
    filterTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        if (this.classList.contains('act')) return;

        filterTabs.forEach(t => {
          t.classList.remove('act');
          t.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('act');
        this.setAttribute('aria-pressed', 'true');

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
      image: 'oversized-plus.jpg',
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
      image: 'fresh-juice.jpg',
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
      image: 'toko.jpg',
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
      image: 'bayu-tech.jpg',
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
      image: 'incredible-fibre.jpg',
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
      image: 'kuchewood.jpg',
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
  const skuSlider = document.getElementById('productCountRange');
  const skuDisplayVal = document.getElementById('productCountVal');
  const platformGroup = document.getElementById('platformSelectGroup');
  const platformChips = document.querySelectorAll('.plat-chip');
  const addonsGroup = document.getElementById('addonsGroup');
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
  const buildGroup = document.getElementById('buildRequirementsGroup');
  const buildBrief = document.getElementById('buildBrief');
  const buildTimeline = document.getElementById('buildTimeline');
  const calcPriceEl = document.getElementById('calcPrice');
  const calcNairaEl = document.getElementById('calcNaira');
  const calcDetailsEl = document.getElementById('calcDetails');
  const calcEyebrow = document.getElementById('calcEyebrow');
  const whatsappBtn = document.getElementById('estimateWhatsAppBtn');
  const summaryCard = document.querySelector('.quote-summary-card');
  const initialService = document.querySelector('.service-toggle-btn.act');

  let activeService = initialService?.dataset.service || 'migration';
  let basePrice = Number(initialService?.dataset.price) || 650;
  let productCount = Number(skuSlider?.value) || 100;
  let migrationPlatform = document.querySelector('.plat-chip.act')?.dataset.plat || 'WooCommerce';

  function selectService(service) {
    const selected = [...servicePills].find(pill => pill.dataset.service === service);
    if (!selected) return;
    activeService = service;
    basePrice = Number(selected.dataset.price) || 0;
    servicePills.forEach(pill => {
      const isSelected = pill === selected;
      pill.classList.toggle('act', isSelected);
      pill.setAttribute('aria-pressed', String(isSelected));
    });
    if (buildGroup) buildGroup.hidden = service !== 'build';
    if (platformGroup) platformGroup.hidden = service !== 'migration';
    if (addonsGroup) addonsGroup.hidden = service === 'build';
    calculateEstimate();
  }

  servicePills.forEach(pill => {
    pill.addEventListener('click', () => selectService(pill.dataset.service));
  });
  document.querySelectorAll('[data-estimator-service]').forEach(link => {
    link.addEventListener('click', () => selectService(link.dataset.estimatorService));
  });
  platformChips.forEach(chip => {
    chip.addEventListener('click', () => {
      platformChips.forEach(item => item.classList.toggle('act', item === chip));
      migrationPlatform = chip.dataset.plat;
      calculateEstimate();
    });
  });

  if (skuSlider) {
    const paintSliderProgress = () => {
      const min = Number(skuSlider.min) || 1;
      const max = Number(skuSlider.max) || 1000;
      const pct = ((Number(skuSlider.value) - min) / (max - min)) * 100;
      skuSlider.style.setProperty('--range-progress', `${pct}%`);
    };
    ['input', 'change'].forEach(event => {
      skuSlider.addEventListener(event, () => {
        productCount = Number(skuSlider.value);
        if (skuDisplayVal) skuDisplayVal.textContent = `${productCount} ${productCount === 1 ? 'Product' : 'Products'}`;
        paintSliderProgress();
        calculateEstimate();
      });
    });
    paintSliderProgress();
  }
  addonCheckboxes.forEach(checkbox => checkbox.addEventListener('change', calculateEstimate));
  [buildBrief, buildTimeline].filter(Boolean).forEach(field => {
    field.addEventListener('input', calculateEstimate);
    field.addEventListener('change', calculateEstimate);
  });

  function calculateEstimate() {
    if (!calcPriceEl || !calcDetailsEl) return;
    const isBuild = activeService === 'build';
    const serviceLabel = isBuild ? 'Shopify Store Build' :
      activeService === 'migration' ? 'Shopify Migration' : 'Storefront Improvement Sprint';
    let totalUSD = basePrice;
    const details = [];
    if (summaryCard) summaryCard.classList.toggle('is-custom', isBuild);

    if (isBuild) {
      details.push('Complete Shopify setup, storefront and agreed launch scope.');
      details.push(`Planned catalogue: ${productCount} ${productCount === 1 ? 'product' : 'products'}.`);
      details.push('Final fee follows review of your pages, features and supplied assets.');
      details.push('Paid themes, apps and subscriptions are agreed separately.');
      calcPriceEl.textContent = 'Custom quote';
      if (calcEyebrow) calcEyebrow.textContent = 'New Store · Scope First';
    } else {
      if (activeService === 'migration') {
        details.push(`Shopify Migration (base up to 100 SKUs): $${basePrice}`);
        if (productCount > 100) {
          const charge = Math.ceil((productCount - 100) / 50) * 35;
          totalUSD += charge;
          details.push(`Catalogue volume (${productCount} items): +$${charge}`);
        }
      } else {
        details.push(`Storefront Improvement Sprint: $${basePrice}`);
        if (productCount > 50) {
          const charge = Math.ceil((productCount - 50) / 25) * 20;
          totalUSD += charge;
          details.push(`Extended catalogue review (${productCount} items): +$${charge}`);
        }
      }
      const addonNames = {
        addonImage: 'Batch image framing',
        addonSeo: 'Agreed URL redirect mapping',
        addonMerchant: 'Google Merchant feed setup'
      };
      addonCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) return;
        const charge = Number(checkbox.value);
        totalUSD += charge;
        details.push(`${addonNames[checkbox.id] || 'Scoped add-on'}: +$${charge}`);
      });
      calcPriceEl.textContent = `$${totalUSD}`;
      if (calcEyebrow) calcEyebrow.textContent = 'Indicative Scope Estimate';
    }
    if (calcNairaEl) calcNairaEl.textContent = 'Naira invoicing agreed when quoted';
    calcDetailsEl.replaceChildren(...details.map(text => {
      const item = document.createElement('li');
      item.textContent = `• ${text}`;
      return item;
    }));

    let message = `Hi Bayode, I’d like to discuss a store project.\n\n`;
    message += `Service requested: ${serviceLabel}\n`;
    if (isBuild) {
      message += `Platform: New Shopify store\n`;
    } else {
      message += `Current platform: ${activeService === 'migration' ? migrationPlatform : 'Shopify'}\n`;
    }
    message += `Estimated products: ${productCount}\n`;
    if (isBuild) {
      message += `Project brief: ${buildBrief?.value.trim() || 'To discuss'}\n`;
      message += `Preferred launch timing: ${buildTimeline?.value.trim() || 'Flexible / to discuss'}\n`;
      message += 'Pricing: Please prepare a custom quote after reviewing the scope.\n';
    } else {
      message += `Indicative scope estimate: $${totalUSD}\n`;
      message += `Included estimate items:\n${details.map(item => `- ${item}`).join('\n')}\n`;
    }
    message += '\nPlease confirm the final scope, timing, third-party costs and payment currency.';
    if (whatsappBtn) {
      whatsappBtn.href = `https://wa.me/2348126679348?text=${encodeURIComponent(message)}`;
      const label = whatsappBtn.querySelector('span');
      if (label) label.textContent = isBuild ? 'Request My Build Quote' : 'Discuss This Scope';
    }
  }

  selectService(activeService);


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

  // Keyboard parity for the existing custom project and video controls.
  document.querySelectorAll('[role="button"][tabindex="0"]').forEach(control => {
    control.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        control.click();
      }
    });
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
