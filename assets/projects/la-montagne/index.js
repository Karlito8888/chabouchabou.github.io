document.addEventListener("DOMContentLoaded", () => {
  const adjustImageOnScroll = (picSelector) => {
    const pic = document.querySelector(picSelector);
    if (!pic) return; // Sortie anticipée si l'image est null

    let windowHeight = window.innerHeight;
    let elementTop = pic.getBoundingClientRect().top;
    let distanceFromBottom = windowHeight - elementTop;
    let startOpacity = 0;
    let startScale = 0.7;
    let startTransitionAt = -500;

    if (distanceFromBottom > startTransitionAt) {
      let progress =
        (distanceFromBottom - startTransitionAt) /
        (windowHeight - startTransitionAt);
      let opacity = Math.min(startOpacity + progress, 1);
      let scale = Math.min(startScale + progress * 0.5, 1); // Ajustez selon l'effet souhaité

      pic.style.opacity = opacity;
      pic.style.transform = `scale(${scale})`;
    }
  };

  window.addEventListener("scroll", () => {
    adjustImageOnScroll(".pic1");
    adjustImageOnScroll(".pic2");
    adjustImageOnScroll(".pic3");
  });
});
