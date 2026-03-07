/* ============================================
   BST EKSPEDISI — Landing Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Preloader ----------
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        preloader.classList.add('hide');
      }, 400);
    });
    // Fallback
    setTimeout(function () {
      preloader.classList.add('hide');
    }, 2500);
  }

  // ---------- Navbar scroll effect ----------
  const navbar = document.querySelector('.navbar-main');
  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll();

  // ---------- Scroll-triggered animations (IntersectionObserver) ----------
  const animElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all
    animElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---------- Counter animation ----------
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      el.textContent = prefix + current.toLocaleString('id-ID') + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString('id-ID') + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu
        const navCollapse = document.querySelector('.navbar-collapse');
        if (navCollapse && navCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    });
  });

  // ---------- Back to Top button ----------
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Quick Quote Form validation ----------
  const quickForm = document.getElementById('quickQuoteForm');
  if (quickForm) {
    quickForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('qq-name').value.trim();
      const phone = document.getElementById('qq-phone').value.trim();
      if (!name || !phone) {
        showFormAlert(quickForm, 'Mohon lengkapi semua field.', 'danger');
        return;
      }
      if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
        showFormAlert(quickForm, 'Nomor telepon tidak valid.', 'danger');
        return;
      }
      // Send via WhatsApp
      const waMsg = encodeURIComponent(
        'Halo Tim BST Ekspedisi,\n\nSaya ingin mendapatkan penawaran harga.\n\nNama: ' + name + '\nNo. Telp: ' + phone + '\n\nMohon informasinya, terima kasih.'
      );
      window.open('https://api.whatsapp.com/send?phone=6281125161168&text=' + waMsg, '_blank');
      showFormAlert(quickForm, 'Terima kasih! Kami akan segera menghubungi Anda.', 'success');
      quickForm.reset();
    });
  }

  // ---------- Footer Lead Form ----------
  const footerForm = document.getElementById('footerLeadForm');
  if (footerForm) {
    footerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('fl-name').value.trim();
      const phone = document.getElementById('fl-phone').value.trim();
      const origin = document.getElementById('fl-origin').value.trim();
      const dest = document.getElementById('fl-dest').value.trim();
      const goods = document.getElementById('fl-goods').value.trim();
      const notes = document.getElementById('fl-notes').value.trim();

      if (!name || !phone) {
        showFormAlert(footerForm, 'Mohon lengkapi nama dan nomor telepon.', 'danger');
        return;
      }

      let waMsg = 'Halo Tim BST Ekspedisi,\n\nSaya ingin request penawaran harga:\n\nNama: ' + name + '\nNo. Telp: ' + phone;
      if (origin) waMsg += '\nAsal: ' + origin;
      if (dest) waMsg += '\nTujuan: ' + dest;
      if (goods) waMsg += '\nJenis Barang: ' + goods;
      if (notes) waMsg += '\nCatatan: ' + notes;
      waMsg += '\n\nMohon dibantu, terima kasih.';

      window.open('https://api.whatsapp.com/send?phone=6281125161168&text=' + encodeURIComponent(waMsg), '_blank');
      showFormAlert(footerForm, 'Terima kasih! Request Anda sudah terkirim.', 'success');
      footerForm.reset();
    });
  }

  function showFormAlert(form, message, type) {
    // Remove existing alerts
    const existing = form.querySelector('.form-alert');
    if (existing) existing.remove();

    const alert = document.createElement('div');
    alert.className = 'form-alert alert alert-' + type + ' mt-2 py-2 px-3';
    alert.style.fontSize = '.88rem';
    alert.style.borderRadius = '8px';
    alert.textContent = message;
    form.appendChild(alert);

    setTimeout(function () {
      alert.remove();
    }, 4000);
  }

  // ---------- Navbar active link on scroll ----------
  const sections = document.querySelectorAll('section[id]');
  function highlightNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(function (sec) {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector('.navbar-main a[href="#' + id + '"]');
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', highlightNav);

});
