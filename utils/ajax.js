export const getScript = src => {
  return new Promise((resolve, reject) => {
    const exists = document.querySelector(`script[src='${src}']`);
    if (exists) {
      exists.remove();
    }

    const script = document.createElement("script");
    document.body.appendChild(script);
    script.onload = resolve;
    script.onerror = reject;
    script.async = true;
    script.src = src;
  });
};
