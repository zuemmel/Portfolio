const headliner = document.querySelector('.headliner');

window.addEventListener('scroll', () => {
    const progress = Math.min(window.scrollY / 180, 1);

    const moveY = progress * -18;
    const scale = 1 - progress * 0.7;

    headliner.style.transform = `translateY(calc(-50% + ${moveY}vh)) scale(${scale})`;

    document.documentElement.style.setProperty(
        '--imageOpacity',
        1 - progress
    );

    document.documentElement.style.setProperty(
        '--arrowOpacity',
        1 - progress * 4
    );

    const glassOpacity = progress * 0.12;
    const borderOpacity = progress * 0.10;

    headliner.style.background =
        `rgba(255,255,255,${glassOpacity})`;

    headliner.style.border =
        `1px solid rgba(255,255,255,${borderOpacity})`;

    headliner.style.boxShadow =
        `0 18px 60px rgba(0,0,0,${progress * 0.08})`;
});