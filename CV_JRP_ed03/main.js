
// Año actual en el footer
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('ano');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Modo oscuro / claro
  const btnTema = document.getElementById('toggleTema');
  if (btnTema) {
    btnTema.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('modo-claro');
      btnTema.setAttribute('aria-pressed', String(isLight));
      try { localStorage.setItem('modo-claro', isLight ? '1' : '0'); } catch {}
    });

    // Preferencia previa
    try {
      const pref = localStorage.getItem('modo-claro');
      if (pref === '1') {
        document.documentElement.classList.add('modo-claro');
        btnTema.setAttribute('aria-pressed', 'true');
      }
    } catch {}
  }

  // Navegación: abrir sección destino al hacer click
  document.querySelectorAll('a.goto[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href').slice(1);
      const acc = document.getElementById(id);
      if (acc && acc.tagName.toLowerCase() === 'details') {
        acc.open = true;
        // desplazamiento suave
        setTimeout(() => acc.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
      }
    });
  });

  // Enviar CV - diálogo
  const btnEnviar = document.getElementById('btnEnviar');
  const dialog = document.getElementById('emailDialog');
  const form = document.getElementById('emailForm');
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  const sendBtn = document.getElementById('sendCvBtn');

  const openDialog = () => {
    if (!dialog.open) {
      dialog.showModal();
      emailError.textContent = '';
      emailInput.value = '';
      emailInput.focus();
    }
  };
  const closeDialog = () => dialog.close();

  btnEnviar?.addEventListener('click', openDialog);
  dialog?.addEventListener('click', (e) => {
    // cerrar al click fuera del cuadro
    const rect = dialog.getBoundingClientRect();
    const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inside) dialog.close('backdrop');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);

  sendBtn?.addEventListener('click', () => {
    const email = (emailInput?.value || '').trim();
    if (!isValidEmail(email)) {
      emailError.textContent = 'Introduce un email válido.';
      emailInput?.focus();
      return;
    }
    emailError.textContent = '';

    // Enlace al PDF en el mismo directorio
    const pdfName = 'CVA_JESUS RODERO_JUN2025.pdf';
    const body = [
      'Hola,',
      '',
      'Te comparto mi CV. Puedes descargarlo desde este enlace (si navegas la versión local, asegúrate de tener el PDF junto a la página):',
      window.location.href.startsWith('http') 
        ? new URL(pdfName, window.location.href).href
        : pdfName,
      '',
      'Saludos,',
      'Jesús Rodero'
    ].join('%0A');

    const subject = 'CV de Jesús Rodero';
    const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;

    // cerrar el diálogo tras lanzar el correo
    setTimeout(closeDialog, 300);
  });

  // Accesibilidad extra: Enter en el input envía
  emailInput?.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      sendBtn?.click();
    }
  });
});
