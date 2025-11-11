// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded!");

  // ===== NAVIGATION =====
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });
  }

  // ===== NAVBAR SCROLL EFFECT =====
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.padding = "2px 0";
        navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
      } else {
        navbar.style.padding = "20px 2px 0 0";
        navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
      }
    }
  });

  // ===== PROJECT FILTERING =====
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Get filter value
      const filterValue = button.getAttribute("data-filter");

      // Filter projects
      projectCards.forEach((card) => {
        if (
          filterValue === "all" ||
          card.getAttribute("data-category") === filterValue
        ) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // ===== FORM SUBMISSION =====
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      // Basic form validation
      if (name && email && subject && message) {
        alert("Thank you for your message! I will get back to you soon.");
        contactForm.reset();
      } else {
        alert("Please fill in all fields.");
      }
    });
  }

  // ===== SMOOTH SCROLLING =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLinksItems = document.querySelectorAll(".nav-links a");

    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop - 100) {
        current = section.getAttribute("id");
      }
    });

    navLinksItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // ===== THREE.JS FLOWING PARTICLES =====
  const flowingCanvas = document.getElementById("flowingCanvas");

  if (flowingCanvas && typeof THREE !== "undefined") {
    let scene, camera, renderer, particles;
    let particlePositions = [];
    const particleCount = 40;

    function initThreeJS() {
      // Scene setup
      scene = new THREE.Scene();

      // Camera setup
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 50;

      // Renderer setup
      renderer = new THREE.WebGLRenderer({
        canvas: flowingCanvas,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      // Create particles
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Random positions
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = (Math.random() - 0.5) * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 50;

        // Store initial positions for scroll effect
        particlePositions.push({
          x: positions[i3],
          y: positions[i3 + 1],
          z: positions[i3 + 2],
          speedX: (Math.random() - 0.5) * 0.02,
          speedY: (Math.random() - 0.5) * 0.02,
          scrollSpeed: 0.02 + Math.random() * 0.03,
        });

        // Purple/Pink gradient colors
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
          colors[i3] = 0.42; // R (108/255)
          colors[i3 + 1] = 0.36; // G (92/255)
          colors[i3 + 2] = 0.91; // B (231/255)
        } else if (colorChoice < 0.66) {
          colors[i3] = 0.99; // R
          colors[i3 + 1] = 0.47; // G
          colors[i3 + 2] = 0.66; // B
        } else {
          colors[i3] = 0.64; // R
          colors[i3 + 1] = 0.61; // G
          colors[i3 + 2] = 1.0; // B
        }

        // Random sizes
        sizes[i] = Math.random() * 3 + 1;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      // Particle material
      const material = new THREE.PointsMaterial({
        size: 2,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Handle window resize
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      animate();
    }

    let scrollY = 0;

    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;
    });

    function animate() {
      requestAnimationFrame(animate);

      if (particles) {
        const positions = particles.geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const particle = particlePositions[i];

          // Gentle floating animation
          positions[i3] += particle.speedX;
          positions[i3 + 1] += particle.speedY;

          // Scroll effect - particles move down as you scroll
          positions[i3 + 1] += scrollY * particle.scrollSpeed * 0.01;

          // Boundary check - reset particles that go too far
          if (positions[i3 + 1] < -50) {
            positions[i3 + 1] = 50;
          }
          if (positions[i3 + 1] > 50 + scrollY * 0.1) {
            positions[i3 + 1] = -50;
          }
          if (positions[i3] < -50) {
            positions[i3] = 50;
          }
          if (positions[i3] > 50) {
            positions[i3] = -50;
          }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.rotation.y += 0.0005;
      }

      renderer.render(scene, camera);
    }

    initThreeJS();
  }

  // ===== PROJECT VIDEO HOVER EFFECT =====
  const projectImages = document.querySelectorAll(".project-image");

  projectImages.forEach((imageContainer) => {
    const video = imageContainer.querySelector(".project-video");

    if (video) {
      imageContainer.addEventListener("mouseenter", () => {
        video.currentTime = 0; // Start from beginning
        video.play().catch((error) => {
          console.log("Video play failed:", error);
        });
      });

      imageContainer.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0; // Reset to beginning
      });
    }
  });

  // ===== PROJECT CARDS SCROLL ANIMATION =====
  console.log("Setting up project card animations...");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3,
  };

  const animateOnIntersect = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log("Card entering view, adding animate-in class");
        entry.target.classList.remove("animate-out");
        entry.target.classList.add("animate-in");
      } else {
        console.log("Card leaving view, adding animate-out class");
        entry.target.classList.remove("animate-in");
        entry.target.classList.add("animate-out");
      }
    });
  };

  const scrollObserver = new IntersectionObserver(
    animateOnIntersect,
    observerOptions
  );

  // Observe project cards
  const cards = document.querySelectorAll(".project-card");
  console.log("Found project cards:", cards.length);

  cards.forEach((card, index) => {
    console.log("Setting up animation for card", index);
    card.classList.add("scroll-animate");
    scrollObserver.observe(card);
  });

  // ===== OTHER ELEMENTS ANIMATION =====
  const otherElements = document.querySelectorAll(
    ".skill-category, .about-content, .contact-container"
  );

  otherElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  const simpleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  otherElements.forEach((element) => {
    simpleObserver.observe(element);
  });

  // ===== CURSOR TRAIL CANVAS =====
  const canvas = document.getElementById("trailCanvas");

  if (canvas) {
    const ctx = canvas.getContext("2d");

    let trail = [];
    const maxTrailLength = 20;
    const segmentDistance = 10;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update canvas size on window resize
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Function to create a new segment of the trail
    function addSegment(x, y) {
      trail.push({ x: x, y: y, alpha: 1 });
      if (trail.length > maxTrailLength) trail.shift();
    }

    // Draw the trail on the canvas
    function drawTrail() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < trail.length; i++) {
        let segment = trail[i];
        ctx.beginPath();
        ctx.arc(segment.x, segment.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108, 92, 231, ${segment.alpha})`;
        ctx.fill();
        segment.alpha -= 0.02;
      }
    }

    // Update the trail and animation frame
    function updateTrail() {
      const mouseX = mousePos.x;
      const mouseY = mousePos.y;

      if (
        trail.length === 0 ||
        Math.abs(mouseX - trail[trail.length - 1].x) > segmentDistance ||
        Math.abs(mouseY - trail[trail.length - 1].y) > segmentDistance
      ) {
        addSegment(mouseX, mouseY);
      }

      drawTrail();
      requestAnimationFrame(updateTrail);
    }

    // Track mouse position
    let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    canvas.addEventListener("mousemove", (e) => {
      mousePos = { x: e.clientX, y: e.clientY };
    });

    updateTrail();
  }

  // ===== LOCO ROCO INSPIRED MOUSE TRAIL EFFECT =====
  let mouseTrailBubbles = [];
  let lastMousePos = { x: 0, y: 0 };
  let mouseMoveThrottle = 0;

  // Loco Roco color palette
  const locoRocoColors = [
    "#FFD700", // Golden yellow
    "#FF69B4", // Hot pink
    "#00CED1", // Dark turquoise
    "#FF6347", // Tomato red
    "#98FB98", // Pale green
    "#DDA0DD", // Plum
    "#F0E68C", // Khaki
    "#87CEEB", // Sky blue
    "#FFA07A", // Light salmon
    "#20B2AA", // Light sea green
  ];

  function createTrailBubble(x, y) {
    const bubble = document.createElement("div");
    bubble.className = "trail-bubble";

    // Random size between 8-20px
    const size = Math.random() * 12 + 8;

    // Random color from Loco Roco palette
    const color =
      locoRocoColors[Math.floor(Math.random() * locoRocoColors.length)];

    // Random offset for natural movement
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;

    bubble.style.width = size + "px";
    bubble.style.height = size + "px";
    bubble.style.left = x + offsetX + "px";
    bubble.style.top = y + offsetY + "px";
    bubble.style.background = `radial-gradient(circle at 30% 30%, ${color}, ${color}dd)`;
    bubble.style.boxShadow = `0 0 ${size / 2}px ${color}66, inset 0 0 ${
      size / 4
    }px rgba(255,255,255,0.3)`;

    document.body.appendChild(bubble);

    // Store bubble reference
    mouseTrailBubbles.push(bubble);

    // Remove bubble after animation completes (1 second)
    setTimeout(() => {
      if (bubble.parentNode) {
        bubble.parentNode.removeChild(bubble);
      }
      // Remove from array
      const index = mouseTrailBubbles.indexOf(bubble);
      if (index > -1) {
        mouseTrailBubbles.splice(index, 1);
      }
    }, 1000);
  }

  // Mouse move event listener for trail effect
  document.addEventListener("mousemove", (e) => {
    const currentTime = Date.now();

    // Throttle bubble creation to prevent too many bubbles
    if (currentTime - mouseMoveThrottle > 50) {
      // Create bubble every 50ms max
      const distance = Math.sqrt(
        Math.pow(e.clientX - lastMousePos.x, 2) +
          Math.pow(e.clientY - lastMousePos.y, 2)
      );

      // Only create bubble if mouse moved enough distance
      if (distance > 10) {
        createTrailBubble(e.clientX, e.clientY);
        lastMousePos = { x: e.clientX, y: e.clientY };
        mouseMoveThrottle = currentTime;
      }
    }
  });

  // Clean up any remaining bubbles on page unload
  window.addEventListener("beforeunload", () => {
    mouseTrailBubbles.forEach((bubble) => {
      if (bubble.parentNode) {
        bubble.parentNode.removeChild(bubble);
      }
    });
    mouseTrailBubbles = [];
  });
});
