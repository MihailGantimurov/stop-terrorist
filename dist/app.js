const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.header nav');
menuToggle.addEventListener('click',()=>{const opened=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!opened));menuToggle.setAttribute('aria-label',opened?'Открыть меню':'Закрыть меню');nav.classList.toggle('open',!opened)});
nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Открыть меню')}});
