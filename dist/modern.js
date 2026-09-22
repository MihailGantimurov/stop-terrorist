'use strict';
const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.header nav');
function closeMenu(){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Открыть меню')}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const viewer=document.querySelector('#viewer');
const viewerContent=document.querySelector('#viewer-content');
const viewerTitle=document.querySelector('#viewer-title');
const viewerCaption=document.querySelector('#viewer-caption');
const prev=document.querySelector('#gallery-prev');
const next=document.querySelector('#gallery-next');
const error=document.querySelector('#video-error');
const heroVideo=document.querySelector('#hero-video');
const motionButton=document.querySelector('#motion-toggle');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let userPaused=reducedMotion.matches||Boolean(navigator.connection?.saveData);
let heroVisible=true;
function updateMotionButton(){const paused=heroVideo.paused;motionButton.setAttribute('aria-label',paused?'Включить фоновое видео':'Остановить фоновое видео');motionButton.setAttribute('aria-pressed',String(paused));motionButton.innerHTML=paused?'<span class="play-icon play-small" aria-hidden="true"></span><span>Включить</span>':'<span class="pause-icon" aria-hidden="true"></span><span>Пауза</span>'}
async function playHero(){if(!heroVideo.getAttribute('src')){heroVideo.src=heroVideo.dataset.src;heroVideo.load()}try{await heroVideo.play()}catch{}updateMotionButton()}
motionButton.addEventListener('click',()=>{userPaused=!heroVideo.paused;if(userPaused){heroVideo.pause();updateMotionButton()}else{playHero()}});
heroVideo.addEventListener('play',updateMotionButton);heroVideo.addEventListener('pause',updateMotionButton);
heroVideo.addEventListener('error',()=>{motionButton.hidden=true});
if('IntersectionObserver'in window){new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(!heroVisible)heroVideo.pause();else if(!userPaused&&!document.hidden&&!viewer.open)playHero()},{threshold:0.1}).observe(document.querySelector('.hero'))}else if(!userPaused){playHero()}
document.addEventListener('visibilitychange',()=>{if(document.hidden)heroVideo.pause();else if(heroVisible&&!userPaused&&!viewer.open)playHero()});
reducedMotion.addEventListener('change',e=>{if(e.matches){userPaused=true;heroVideo.pause();updateMotionButton()}});
updateMotionButton();
const gallery=[
 {src:'stage-song.webp',title:'Стоп Террорист на сцене',description:'Фото из архива проекта'},
 {src:'lia-tv.webp',title:'Лия Волянская в телевизионном эфире',description:'Кадр эфира Первого канала'},
 {src:'community.webp',title:'Жест который объединяет',description:'Совместное фото с участниками'},
 {src:'clip-walk.webp',title:'Стоп Террорист',description:'Постановочный кадр музыкального видео'},
 {src:'stop-hand.webp',title:'Открытая ладонь',description:'Кадр из музыкального клипа'},
 {src:'stage-white.webp',title:'Концертное выступление Лии',description:'Фото из личного архива Лии'},
 {src:'stage-stop.webp',title:'Песня и её главный жест',description:'Исполнение Стоп Террорист на сцене'},
 {src:'stage-sunset.webp',title:'Музыка как разговор о главном',description:'Фото концертного выступления'},
 {src:'stage-ceremony.webp',title:'На концертной сцене',description:'Кадр церемониального выступления из предоставленного архива'},
 {src:'clip-city.webp',title:'Ночной город',description:'Постановочная сцена музыкального клипа'},
 {src:'clip-team.webp',title:'Вместе в кадре',description:'Постановочная сцена музыкального клипа'},
 {src:'stop-glove.webp',title:'Общая позиция',description:'Жест стоп в музыкальном клипе'},
 {src:'clip-scene.webp',title:'Визуальная история клипа',description:'Постановочная сцена музыкального видео'}
];
const extraGallery=document.querySelector('#extra-gallery');
gallery.slice(4).forEach((item,i)=>{const button=document.createElement('button');button.className='photo-tile';button.dataset.gallery=String(i+4);button.setAttribute('aria-label','Открыть фото '+item.title);const img=document.createElement('img');img.src='assets/'+item.src;img.alt=item.title;img.loading='lazy';img.width=800;img.height=600;const caption=document.createElement('span');caption.textContent=item.title;button.append(img,caption);extraGallery.append(button)});
let activeIndex=0;
let viewerMode='photo';
let lastTrigger=null;
function showViewer(){heroVideo.pause();viewer.showModal();document.body.style.overflow='hidden';document.querySelector('#viewer-close').focus()}
function showPhoto(index){activeIndex=(index+gallery.length)%gallery.length;const item=gallery[activeIndex];viewerMode='photo';viewerContent.replaceChildren();viewerTitle.textContent=item.title;viewerCaption.textContent=`${activeIndex+1} / ${gallery.length} · ${item.description}`;const img=document.createElement('img');img.src='assets/'+item.src;img.alt=item.title;viewerContent.append(img);prev.hidden=false;next.hidden=false;error.hidden=true}
document.addEventListener('click',e=>{const photo=e.target.closest('[data-gallery]');if(photo){lastTrigger=photo;showPhoto(Number(photo.dataset.gallery));showViewer();return}const trigger=e.target.closest('[data-video]');if(!trigger)return;lastTrigger=trigger;viewerMode='video';viewerTitle.textContent=trigger.dataset.title;viewerCaption.textContent='Видео со звуком';prev.hidden=true;next.hidden=true;error.hidden=true;const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.poster=trigger.dataset.poster;video.src=trigger.dataset.video;video.setAttribute('aria-label',trigger.dataset.title);video.addEventListener('error',()=>{error.hidden=false});document.querySelector('#video-download').href=trigger.dataset.video;viewerContent.replaceChildren(video);showViewer();video.play().catch(()=>{})});
document.querySelector('#viewer-close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',e=>{if(e.target===viewer){const box=viewer.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)viewer.close()}});
viewer.addEventListener('close',()=>{const video=viewerContent.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load()}viewerContent.replaceChildren();document.body.style.overflow='';lastTrigger?.focus({preventScroll:true});if(heroVisible&&!userPaused&&!document.hidden)playHero()});
prev.addEventListener('click',()=>showPhoto(activeIndex-1));next.addEventListener('click',()=>showPhoto(activeIndex+1));
viewer.addEventListener('keydown',e=>{if(viewerMode==='photo'&&e.key==='ArrowLeft'){e.preventDefault();showPhoto(activeIndex-1)}if(viewerMode==='photo'&&e.key==='ArrowRight'){e.preventDefault();showPhoto(activeIndex+1)}});
document.querySelector('#year').textContent=String(new Date().getFullYear());
if(!reducedMotion.matches&&'IntersectionObserver'in window){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:0.05});document.querySelectorAll('.about-grid,.manifesto,.section-heading,.film-feature,.media-card,.press-note,.founder,.person,.digital-team').forEach(el=>{el.classList.add('reveal');observer.observe(el)})}
