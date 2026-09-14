const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("open"));
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

const form = document.getElementById("leadForm");

if (form) {
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    formStatus.className = "form-status";
    formStatus.textContent = "Submitting your enquiry...";
    submitBtn.disabled = true;
    submitBtn.textContent = "SUBMITTING...";

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not submit the form.");
      }

      form.reset();
      formStatus.className = "form-status success";
      formStatus.textContent = "✓ Thanks! Your enquiry has been received. Karma Labs will review it shortly.";
    } catch (error) {
      formStatus.className = "form-status error";
      formStatus.textContent = "Something went wrong. Please try again or email Karma Labs.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "REQUEST MY QUORA PLAN →";
    }
  });
}
