'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === (filterItems[i].dataset.category || '').toLowerCase().trim()) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// form submission handling: show a success message and reset the form
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // simple final validation
    if (!form.checkValidity()) return;
    // determine endpoint: prefer data-endpoint, then action (if not '#')
    const endpoint = form.dataset.endpoint || (form.getAttribute('action') && form.getAttribute('action') !== '#' ? form.getAttribute('action') : null);

    // collect form data
    const data = new FormData(form);

    const showSuccess = () => {
      const success = document.getElementById('contact-success');
      if (success) success.style.display = 'block'; else alert('Thanks — your message was sent.');
      form.reset();
      formBtn.setAttribute('disabled', '');
      setTimeout(() => { const name = document.getElementById('contact-name'); if (name) name.focus(); }, 300);
    };

    const showError = (msg) => {
      const err = document.getElementById('contact-error');
      if (err) { err.textContent = msg || 'Failed to send message. Please try again.'; err.style.display = 'block'; }
      else alert(msg || 'Failed to send message.');
    };

    if (endpoint) {
      // send POST request (FormData) — backend should accept form-encoded or multipart
      fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: {
          // let browser set Content-Type for FormData; do not set JSON here
        }
      }).then(resp => {
        if (resp.ok) showSuccess(); else return resp.text().then(t => { throw new Error(t || resp.statusText); });
      }).catch(err => {
        showError(err.message || 'Network error');
      });
    } else {
      // no endpoint configured — show local success
      showSuccess();
    }
  });

  // wire up close button for the success box
  const successClose = document.getElementById('contact-success-close');
  if (successClose) successClose.addEventListener('click', function () {
    const success = document.getElementById('contact-success');
    if (success) success.style.display = 'none';
  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}


// services image link previews
const serviceImgInputs = document.querySelectorAll('.service-img-input');
serviceImgInputs.forEach((input) => {
  const preview = input.parentElement.querySelector('.service-img-preview');
  // load saved value from localStorage if present
  const saved = localStorage.getItem(input.previousElementSibling ? input.previousElementSibling.textContent.trim() : input.placeholder);
  if (saved) {
    input.value = saved;
    preview.src = saved;
    preview.style.display = 'block';
  }

  input.addEventListener('input', function () {
    const url = this.value.trim();
    if (url) {
      preview.src = url;
      preview.style.display = 'block';
      // save by topic text (previous sibling span)
      const key = this.previousElementSibling ? this.previousElementSibling.textContent.trim() : this.placeholder;
      try { localStorage.setItem(key, url); } catch (e) {}
    } else {
      preview.src = '';
      preview.style.display = 'none';
    }
  });
});

// Populate tutorial cards from localStorage and attach edit handlers
const tutorialCards = document.querySelectorAll('.tutorial-card');
tutorialCards.forEach((card) => {
  const topic = card.dataset.topic;
  const img = card.querySelector('.tutorial-img');
  const stored = localStorage.getItem(topic);
  if (stored) {
    img.src = stored;
  } else {
    img.src = '';
    img.style.background = '#222';
  }

  const editBtn = card.querySelector('.edit-img-btn');
  editBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const current = localStorage.getItem(topic) || '';
    const url = prompt('Paste image URL for "' + topic + '"', current);
    if (url !== null) {
      const trimmed = url.trim();
      if (trimmed) {
        try { localStorage.setItem(topic, trimmed); } catch (err) {}
        img.src = trimmed;
      } else {
        localStorage.removeItem(topic);
        img.src = '';
      }
    }
  });
});