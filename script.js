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
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href) {
      const baseHref = href.split("#")[0];
      if (baseHref === path) a.classList.add("active");
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

  // Investors page tab switching
  const tabLinks = document.querySelectorAll(".investor-nav-link");
  const tabPanels = document.querySelectorAll(".tab-panel");

  if (tabLinks.length > 0 && tabPanels.length > 0) {
    tabLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Remove active class from all links and panels
        tabLinks.forEach((l) => l.classList.remove("active"));
        tabPanels.forEach((p) => p.classList.remove("active"));

        // Add active class to clicked link and corresponding panel
        link.classList.add("active");
        const targetTab = link.getAttribute("data-tab");
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) {
          targetPanel.classList.add("active");
        }

        // On mobile layout, scroll smoothly to the content panel
        if (window.innerWidth <= 900) {
          const contentArea = document.querySelector(".investor-content");
          if (contentArea) {
            contentArea.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });
  }

  // URL Hash routing for Investors page
  const handleHashRouting = () => {
    const hash = location.hash.substring(1); // e.g. "financial-results"
    if (hash) {
      const targetButton = document.querySelector(`.investor-nav-link[data-tab="${hash}"]`);
      if (targetButton) {
        // Trigger click event on the corresponding button
        targetButton.click();

        // Scroll to the investor content layout
        const targetSection = document.querySelector(".investor-layout");
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  // Run on page load
  if (location.pathname.includes("investors.html")) {
    setTimeout(handleHashRouting, 150); // slight delay for DOM load
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
    threshold: 0.1,
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

