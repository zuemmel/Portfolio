const headliner = document.querySelector('.headliner');
const nav = document.querySelector('.top-nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section');

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

function updateHeadliner(){
    if(!headliner) return;

    const progress = Math.min(window.scrollY / 180, 1);
    const moveY = progress * -18;
    const scale = 1 - progress * 0.7;

    headliner.style.transform =
        `translateY(calc(-50% + ${moveY}vh)) scale(${scale})`;

    headliner.classList.toggle('scrolled', progress > 0.55);

    document.documentElement.style.setProperty('--imageOpacity', 1 - progress);
    document.documentElement.style.setProperty('--arrowOpacity', 1 - progress * 4);
}

function updatePage(){
    updateHeadliner();
    updateActiveSection();
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        moveNavDot(link);
    });
});

window.addEventListener('scroll', updatePage);

window.addEventListener('resize', () => {
    moveNavDot(document.querySelector('.nav-link.active'));
});

window.addEventListener('DOMContentLoaded', () => {
    updatePage();
    moveNavDot(document.querySelector('.nav-link.active'));
});