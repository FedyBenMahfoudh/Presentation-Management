(function () {
  'use strict';

  // ——— Données courbe Kübler-Ross (tooltip + rôle manager) ———
  const curveData = {
    choc: {
      tooltip: '"Ça ne marchera jamais", "C\'est une mode". Sidération, paralysie. Risque : blocage.',
      manager: 'Rassurer et informer. Donner des repères clairs (quoi, quand, pourquoi). Messages courts et répétés.'
    },
    deni: {
      tooltip: 'Refus de la réalité, minimisation. Risque : retard dans l’adaptation.',
      manager: 'Être clair sur le caractère non-négociable du changement, tout en montrant sa disponibilité pour accompagner.'
    },
    colere: {
      tooltip: '"On veut nous remplacer", "Je vais perdre mon temps". Frustration, opposition. Risque : résistance active.',
      manager: 'Accueillir la colère sans la prendre personnellement. Canaliser vers des solutions. Fixer des limites si besoin.'
    },
    depression: {
      tooltip: 'La vallée du désespoir : baisse de productivité et de motivation réelles.',
      manager: 'Maintenir le lien, proposer du soutien. Ne pas nier la difficulté ; reconnaître l’effort et les progrès.'
    },
    acceptation: {
      tooltip: 'On commence à explorer l’outil. Intégration progressive. Risque : rechute si non consolidé.',
      manager: 'Renforcer et célébrer les progrès. Ancrer les nouvelles pratiques et identifier les relais.'
    },
    engagement: {
      tooltip: 'L’outil devient la nouvelle norme. Engagement durable.',
      manager: 'Célébrer les victoires, partager les bonnes pratiques, éviter le retour en arrière.'
    }
  };

  // ——— Navigation : section active + scroll smooth ———
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveSection(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute('data-section') === id) {
        link.classList.add('nav-active');
      } else {
        link.classList.remove('nav-active');
      }
    });
  }

  const observerOptions = { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 };
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // Activer la première section au chargement
  if (sections.length) setActiveSection(sections[0].id);

  // ——— Thème clair / sombre (toggle) ———
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-toggle-icon');
  const themeLabel = document.getElementById('theme-toggle-label');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
    }
    if (themeLabel) {
      themeLabel.textContent = theme === 'light' ? 'Mode clair' : 'Mode sombre';
    }
  }

  (function initTheme() {
    const saved = window.localStorage.getItem('theme');
    const initial = saved === 'light' || saved === 'dark' ? saved : 'dark';
    applyTheme(initial);
  })();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      window.localStorage.setItem('theme', next);
    });
  }

  // ——— Scroll-reveal (toutes les variantes : .reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger) ———
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');
  const revealOptions = { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.08 };
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
      }
    });
  }, revealOptions);

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ——— Modale Sondage ———
  const modalSondage = document.getElementById('modal-sondage');
  const btnSondage = document.getElementById('btn-sondage');
  const closeSondage = document.getElementById('close-sondage');
  const sondageIframe = document.getElementById('sondage-iframe');

  function openModalSondage() {
    modalSondage.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Option : définir une URL par défaut pour l'iframe, ex. sondageIframe.src = 'https://...';
  }

  function closeModalSondage() {
    modalSondage.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (btnSondage) btnSondage.addEventListener('click', openModalSondage);
  if (closeSondage) closeSondage.addEventListener('click', closeModalSondage);
  modalSondage.querySelector('[data-close="modal-sondage"]').addEventListener('click', closeModalSondage);

  // ——— QR code : afficher l'image si elle existe (assets/qr-sondage.png) ———
  (function () {
    var img = document.getElementById('qr-image');
    var placeholder = document.getElementById('qr-placeholder');
    if (!img || !placeholder) return;
    var qrSrc = 'assets/qr-sondage.png';
    img.onload = function () {
      img.classList.remove('hidden');
      placeholder.querySelector('span').classList.add('hidden');
    };
    img.onerror = function () {
      img.classList.add('hidden');
      placeholder.querySelector('span').classList.remove('hidden');
    };
    img.src = qrSrc;
  })();

  // ——— Modale Rôle du manager (Courbe) ———
  const modalManager = document.getElementById('modal-manager');
  const modalManagerTitle = document.getElementById('modal-manager-title');
  const modalManagerBody = document.getElementById('modal-manager-body');
  const closeManager = document.getElementById('close-manager');

  const stageLabels = {
    choc: 'Choc',
    deni: 'Déni',
    colere: 'Colère',
    depression: 'Dépression',
    acceptation: 'Acceptation',
    engagement: 'Engagement'
  };

  function openManagerModal(stage) {
    const data = curveData[stage];
    if (!data) return;
    modalManagerTitle.textContent = 'Rôle du manager — ' + (stageLabels[stage] || stage);
    modalManagerBody.textContent = data.manager;
    modalManager.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeManagerModal() {
    modalManager.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (closeManager) closeManager.addEventListener('click', closeManagerModal);
  modalManager.querySelector('[data-close="modal-manager"]').addEventListener('click', closeManagerModal);

  // ——— Courbe : tooltips + clic modale ———
  const curveSvg = document.getElementById('curve-svg');
  const tooltip = document.getElementById('curve-tooltip');

  if (curveSvg && tooltip) {
    curveSvg.querySelectorAll('.curve-point').forEach(function (point) {
      const stage = point.getAttribute('data-stage');
      const data = curveData[stage];
      if (!data) return;

      point.addEventListener('mouseenter', function (e) {
        tooltip.textContent = data.tooltip;
        tooltip.classList.remove('hidden');
        var parent = tooltip.parentElement.getBoundingClientRect();
        tooltip.style.left = (e.clientX - parent.left + 12) + 'px';
        tooltip.style.top = (e.clientY - parent.top - 8) + 'px';
        tooltip.style.transform = 'translate(-50%, -100%)';
      });
      point.addEventListener('mouseleave', function () {
        tooltip.classList.add('hidden');
      });
      point.addEventListener('click', function (e) {
        e.stopPropagation();
        openManagerModal(stage);
      });
    });
  }

  // Reposition tooltip on mouse move over curve for better UX
  if (curveSvg && tooltip) {
    curveSvg.addEventListener('mousemove', function (e) {
      if (!tooltip.classList.contains('hidden')) {
        var parent = tooltip.parentElement.getBoundingClientRect();
        tooltip.style.left = (e.clientX - parent.left + 12) + 'px';
        tooltip.style.top = (e.clientY - parent.top - 8) + 'px';
        tooltip.style.transform = 'translate(-50%, -100%)';
      }
    });
  }

  // ——— ADKAR accordéon (un seul ouvert) ———
  const adkarBlocks = document.querySelectorAll('.adkar-block');
  adkarBlocks.forEach(function (block) {
    var trigger = block.querySelector('.adkar-trigger');
    var content = block.querySelector('.adkar-content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', function () {
      var isOpen = block.classList.contains('adkar-open');
      adkarBlocks.forEach(function (b) {
        b.classList.remove('adkar-open');
        b.querySelector('.adkar-content').classList.add('hidden');
      });
      if (!isOpen) {
        block.classList.add('adkar-open');
        content.classList.remove('hidden');
      }
    });
  });

  // ——— Échap pour fermer les modales ———
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!modalSondage.classList.contains('hidden')) closeModalSondage();
    else if (!modalManager.classList.contains('hidden')) closeManagerModal();
  });
})();
