// Simple mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".menu-btn");
  const links = document.querySelector(".nav-links");
  if (btn && links) {
    btn.addEventListener("click", () => {
      btn.classList.toggle("open");
      links.classList.toggle("open");
    });
  }

  // Mark active nav link based on current page
  const pathname = location.pathname;
  const isCurrentInvestor = pathname.includes("investors.html") || pathname.includes("/investor/");

  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href) {
      const isInvestorHref = href.includes("investors.html") || href.includes("investor/");
      
      if (isInvestorHref) {
        if (isCurrentInvestor && !a.closest(".dropdown")) {
          a.classList.add("active");
        } else {
          a.classList.remove("active");
        }
      } else {
        const cleanPath = (p) => p.split("#")[0].replace(/\/$/, "").split("/").pop() || "index.html";
        const hrefPage = cleanPath(href);
        const currentPage = cleanPath(pathname);
        
        if (hrefPage === currentPage && !isCurrentInvestor) {
          a.classList.add("active");
        } else {
          a.classList.remove("active");
        }
      }
    }
  });

  // Mobile dropdown toggle
  document.querySelectorAll(".has-dropdown > a").forEach((parentLink) => {
    parentLink.addEventListener("click", (e) => {
      if (window.innerWidth <= 820) {
        const parentLi = parentLink.parentElement;
        const isOpen = parentLi.classList.contains("active-mobile");
        
        // Close other mobile dropdowns
        document.querySelectorAll(".has-dropdown").forEach((li) => {
          if (li !== parentLi) li.classList.remove("active-mobile");
        });

        if (!isOpen) {
          e.preventDefault(); // Prevent navigating on first click
          parentLi.classList.add("active-mobile");
        }
      }
    });
  });

  // Contact form (front-end only demo)
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.querySelector("#form-status");
      status.textContent = "Thanks! Your message has been received. We'll get back to you soon.";
      status.style.color = "var(--green-dark)";
      form.reset();
    });
  }

  // Investors page tab switching & routing
  const tabLinks = document.querySelectorAll(".investor-nav-link");
  const tabPanels = document.querySelectorAll(".tab-panel");

  // Map route slug to the tab id
  const routeToTabMap = {
    "board-of-directors": "board-of-directors",
    "committee-board": "committee-board",
    "financial-results": "financial-results",
    "shareholding-pattern": "shareholding-pattern",
    "group-subsidiaries": "group-subsidiaries",
    "corporate-policies": "corporate-policies",
    "annual-report": "annual-report",
    "ipo": "initial-public-offering",
    "initial-public-offering": "initial-public-offering",
    "investor-grievances": "investor-grievances",
  };

  // Map tab id to route slug for url construction
  const tabToRouteMap = {
    "board-of-directors": "board-of-directors",
    "committee-board": "committee-board",
    "financial-results": "financial-results",
    "shareholding-pattern": "shareholding-pattern",
    "group-subsidiaries": "group-subsidiaries",
    "corporate-policies": "corporate-policies",
    "annual-report": "annual-report",
    "initial-public-offering": "ipo", // default route to /investor/ipo/
    "investor-grievances": "investor-grievances",
  };

  const switchTab = (tabId, updateUrl = true) => {
    const targetLink = document.querySelector(`.investor-nav-link[data-tab="${tabId}"]`);
    const targetPanel = document.getElementById(tabId);
    
    if (targetLink && targetPanel) {
      // Remove active class from all links and panels
      tabLinks.forEach((l) => l.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));

      // Add active class to clicked link and panel
      targetLink.classList.add("active");
      targetPanel.classList.add("active");

      // On mobile layout, scroll smoothly to the content panel
      if (window.innerWidth <= 900) {
        const contentArea = document.querySelector(".investor-content");
        if (contentArea) {
          contentArea.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      // Update URL to clean route without page reload
      if (updateUrl && window.history && history.pushState) {
        const routeSlug = tabToRouteMap[tabId] || tabId;
        const currentPath = window.location.pathname;
        let baseDir = "";
        
        if (currentPath.includes("/investor/")) {
          // If already inside /investor/<section>/
          baseDir = "../";
        } else {
          // If at root investors.html
          baseDir = "investor/";
        }
        
        const newPath = `${baseDir}${routeSlug}/`;
        history.pushState({ tabId: tabId }, "", newPath);
      }
    }
  };

  if (tabLinks.length > 0 && tabPanels.length > 0) {
    tabLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetTab = link.getAttribute("data-tab");
        if (targetTab) {
          // If the panel exists on this page, handle via client-side routing.
          // Otherwise, allow standard browser navigation to the clean URL.
          // Do not intercept if we are on a policy reader page (path contains /policies/).
          if (document.getElementById(targetTab) && !window.location.pathname.includes("/policies/")) {
            e.preventDefault();
            switchTab(targetTab);
          }
        }
      });
    });


    // Handle browser back/forward buttons (popstate)
    window.addEventListener("popstate", (e) => {
      if (e.state && e.state.tabId) {
        switchTab(e.state.tabId, false);
      } else {
        // Fallback: parse pathname
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        const lastPart = pathParts[pathParts.length - 1];
        const tabId = routeToTabMap[lastPart];
        if (tabId) {
          switchTab(tabId, false);
        } else if (window.location.hash) {
          const hash = window.location.hash.substring(1);
          const hashTabId = routeToTabMap[hash] || hash;
          switchTab(hashTabId, false);
        }
      }
    });

    // Intercept header dropdown links if clicked while already on an investor page
    document.querySelectorAll(".dropdown a").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        const currentPath = window.location.pathname;
        const isAlreadyOnInvestorPage = currentPath.includes("/investor/") || currentPath.includes("investors.html");
        
        if (isAlreadyOnInvestorPage && href && (href.includes("/investor/") || href.includes("investors.html"))) {
          // Find matching tab from path
          const pathParts = href.split("/").filter(Boolean);
          const slug = pathParts[pathParts.length - 1] || href.split("#")[1];
          const tabId = routeToTabMap[slug];
          if (tabId) {
            e.preventDefault();
            switchTab(tabId);
          }
        }
      });
    });
  }

  // URL Hash routing for legacy hash support and redirecting
  const handleHashRouting = () => {
    const hash = location.hash.substring(1);
    if (hash) {
      const tabId = routeToTabMap[hash] || hash;
      const targetButton = document.querySelector(`.investor-nav-link[data-tab="${tabId}"]`);
      if (targetButton) {
        switchTab(tabId, true);
        const targetSection = document.querySelector(".investor-layout");
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  // Run hash check on load
  const isInvestorPage = location.pathname.includes("investors.html") || location.pathname.includes("/investor/");
  if (isInvestorPage) {
    if (location.hash) {
      setTimeout(handleHashRouting, 150);
    }
    window.addEventListener("hashchange", handleHashRouting);
  }

  // Mobile Investor Sidebar Toggling
  const sidebar = document.querySelector(".investor-sidebar");
  const toggleBtn = document.querySelector(".investor-sidebar-toggle");
  const overlay = document.querySelector(".investor-overlay");
  const closeBtn = document.querySelector(".sidebar-close-mobile");

  if (sidebar && toggleBtn) {
    const openSidebar = () => {
      sidebar.classList.add("open");
      if (overlay) overlay.classList.add("active");
    };

    const closeSidebar = () => {
      sidebar.classList.remove("open");
      if (overlay) overlay.classList.remove("active");
    };

    toggleBtn.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    // Also close sidebar when any nav link inside it is clicked
    const sideLinks = sidebar.querySelectorAll(".investor-nav-link");
    sideLinks.forEach((link) => {
      link.addEventListener("click", closeSidebar);
    });
  }

  // Scroll Animations using IntersectionObserver
  const observerOptions = {
    threshold: 0.01,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    observer.observe(el);
  });

  // Sticky Header Scroll Effect
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Initialize Product Carousels (Horizontal Orientation with Infinite Loop Sliding)
  const initProductCarousels = () => {
    const carousels = document.querySelectorAll(".product-carousel:not(.single-image)");
    carousels.forEach((carousel) => {
      const track = carousel.querySelector(".carousel-track");
      const slides = carousel.querySelectorAll(".carousel-slide");
      const dots = carousel.querySelectorAll(".carousel-dot");
      const prevBtn = carousel.querySelector(".carousel-btn.prev");
      const nextBtn = carousel.querySelector(".carousel-btn.next");
      
      const L = slides.length;
      if (L <= 1) return;

      // Clone slides for infinite loop
      const firstClone = slides[0].cloneNode(true);
      const lastClone = slides[L - 1].cloneNode(true);

      firstClone.classList.add("carousel-clone");
      lastClone.classList.add("carousel-clone");

      // Append and prepend clones
      track.appendChild(firstClone);
      track.insertBefore(lastClone, slides[0]);

      let currentIndex = 1; // Displaying slide 1 initially (index 0 is the lastClone)
      let intervalId = null;
      let isTransitioning = false;
      const intervalDuration = 5000; // 5 seconds

      // Position track to show slide 1 initially without transition
      track.style.transform = `translateX(-100%)`;

      const goToSlide = (index, animate = true) => {
        if (isTransitioning && animate) return;

        if (animate) {
          isTransitioning = true;
          track.classList.add("transitioning");
        } else {
          track.classList.remove("transitioning");
          void track.offsetWidth; // Force reflow to disable transitions instantly
        }

        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update dots state based on active original slide
        let activeDotIndex = currentIndex - 1;
        if (activeDotIndex < 0) {
          activeDotIndex = L - 1;
        } else if (activeDotIndex >= L) {
          activeDotIndex = 0;
        }

        dots.forEach((dot, idx) => {
          if (idx === activeDotIndex) {
            dot.classList.add("active");
          } else {
            dot.classList.remove("active");
          }
        });
      };

      const nextSlide = () => {
        if (isTransitioning) return;
        goToSlide(currentIndex + 1);
      };

      const prevSlide = () => {
        if (isTransitioning) return;
        goToSlide(currentIndex - 1);
      };

      // Handle seamless snap after transition
      track.addEventListener("transitionend", () => {
        isTransitioning = false;
        track.classList.remove("transitioning");

        if (currentIndex === 0) {
          goToSlide(L, false);
        } else if (currentIndex === L + 1) {
          goToSlide(1, false);
        }
      });

      // Dot navigation
      dots.forEach((dot, index) => {
        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          if (isTransitioning) return;
          goToSlide(index + 1);
          stopAutoplay();
          startAutoplay();
        });
      });

      // Arrow navigation
      if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (isTransitioning) return;
          prevSlide();
          stopAutoplay();
          startAutoplay();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (isTransitioning) return;
          nextSlide();
          stopAutoplay();
          startAutoplay();
        });
      }

      const startAutoplay = () => {
        if (!intervalId) {
          intervalId = setInterval(nextSlide, intervalDuration);
        }
      };

      const stopAutoplay = () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      };

      // Pause/resume autoplay on hover
      carousel.addEventListener("mouseenter", stopAutoplay);
      carousel.addEventListener("mouseleave", startAutoplay);

      // Start initially
      startAutoplay();
    });
  };

  initProductCarousels();
});

