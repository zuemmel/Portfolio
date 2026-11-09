const nav = document.querySelector('.top-nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section');
const projectPanels = document.querySelectorAll('.project-panel');
const projectDialog = document.querySelector('.project-dialog');
const dialogClose = document.querySelector('.project-dialog__close');
const dialogTitle = document.querySelector('#dialog-title');
const dialogMeta = document.querySelector('.project-dialog__meta');
const dialogDescription = document.querySelector('.project-dialog__description');
const dialogLink = document.querySelector('.project-dialog__link');
const dialogLinkLabel = document.querySelector('.project-dialog__link span');
const galleryImage = document.querySelector('.project-gallery__image');
const galleryPrevious = document.querySelector('.project-gallery__button--previous');
const galleryNext = document.querySelector('.project-gallery__button--next');
const galleryCounter = document.querySelector('.project-gallery__counter');
const galleryCaption = document.querySelector('.project-gallery__caption');
let galleryImages = [];
let galleryCaptions = [];
let galleryIndex = 0;

function moveNavDot(activeLink){
    if(!nav || !activeLink) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const dotX = linkRect.left - navRect.left + linkRect.width / 2 - 3;

    nav.style.setProperty('--dot-x', `${dotX}px`);
}

function setActiveNav(id){
    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);

    navLinks.forEach(link => link.classList.remove('active'));

    if(activeLink){
        activeLink.classList.add('active');
        moveNavDot(activeLink);
    }
}

function updateActiveSection(){
    let currentId = 'about';

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();

        if(rect.top <= window.innerHeight * 0.45){
            currentId = section.id;
        }
    });

    setActiveNav(currentId);
}

function updatePage(){
    const animationDistance = Math.max(420, window.innerHeight * 0.82);
    const rawProgress = Math.min(window.scrollY / animationDistance, 1);

    document.documentElement.style.setProperty('--imageOpacity', Math.max(0, 1 - rawProgress * 1.05));
    document.documentElement.style.setProperty('--arrowOpacity', Math.max(0, 1 - rawProgress * 5));

    updateActiveSection();
}

function updateGallery(){
    if(!galleryImage || galleryImages.length === 0) return;

    galleryImage.src = galleryImages[galleryIndex];
    galleryImage.alt = `${dialogTitle.textContent} — image ${galleryIndex + 1}`;
    galleryImage.parentElement.style.setProperty(
        '--gallery-image',
        `url(${JSON.stringify(galleryImages[galleryIndex])})`
    );
    galleryCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;

    const caption = galleryCaptions[galleryIndex]?.trim() || '';
    galleryCaption.textContent = caption;
    galleryCaption.hidden = !caption;

    const hasMultipleImages = galleryImages.length > 1;
    galleryPrevious.hidden = !hasMultipleImages;
    galleryNext.hidden = !hasMultipleImages;
}

function changeGalleryImage(direction){
    if(galleryImages.length < 2) return;

    galleryIndex = (galleryIndex + direction + galleryImages.length) % galleryImages.length;
    updateGallery();
}

function openProject(panel){
    if(!projectDialog || !panel) return;

    dialogTitle.textContent = panel.dataset.title || '';
    dialogMeta.textContent = panel.dataset.category || '';
    dialogDescription.textContent = panel.dataset.detail || '';

    if(panel.dataset.link){
        dialogLink.href = panel.dataset.link;
        dialogLinkLabel.textContent = panel.dataset.linkLabel || 'View project';
        dialogLink.hidden = false;
    } else {
        dialogLink.removeAttribute('href');
        dialogLink.hidden = true;
    }

    galleryImages = (panel.dataset.images || '').split('|').filter(Boolean);
    galleryCaptions = (panel.dataset.captions || '').split('|');
    galleryIndex = 0;
    updateGallery();
    projectDialog.showModal();
}

projectPanels.forEach(panel => {
    panel.addEventListener('click', () => openProject(panel));
    panel.addEventListener('keydown', event => {
        if(event.key === 'Enter' || event.key === ' '){
            event.preventDefault();
            openProject(panel);
        }
    });
});

dialogClose?.addEventListener('click', () => projectDialog.close());
galleryPrevious?.addEventListener('click', () => changeGalleryImage(-1));
galleryNext?.addEventListener('click', () => changeGalleryImage(1));

projectDialog?.addEventListener('keydown', event => {
    if(event.key === 'ArrowLeft') changeGalleryImage(-1);
    if(event.key === 'ArrowRight') changeGalleryImage(1);
});

projectDialog?.addEventListener('click', event => {
    if(event.target === projectDialog) projectDialog.close();
});


navLinks.forEach(link => {
    link.addEventListener('click', () => {
        moveNavDot(link);
    });
});

window.addEventListener('scroll', updatePage);

window.addEventListener('resize', () => {
    updatePage();
    moveNavDot(document.querySelector('.nav-link.active'));
});

updatePage();
moveNavDot(document.querySelector('.nav-link.active'));
