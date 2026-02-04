      // Smooth scroll para navegación
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });

      // Animación de entrada en scroll
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      }, observerOptions);

      document
        .querySelectorAll(
          ".problem-card, .feature-card, .feature-item, .stat-item",
        )
        .forEach((el) => {
          el.style.opacity = "0";
          el.style.transform = "translateY(30px)";
          el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
          observer.observe(el);
        });

      // Form submission
      document.querySelector(".cta-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        alert(`¡Gracias! ${email} ha sido agregado a la lista de espera.`);
        e.target.reset();
      });
   