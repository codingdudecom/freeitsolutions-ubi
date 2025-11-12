function copyToClipboard(e) {
    /* Get the text field */
    var input = document.createElement("textarea");
    input.style.style = {position: 'absolute', left: '-9999px'};
    input.value = e.target["data-txt"];
    document.body.appendChild(input);
    /* Select the text field */
    input.select();
    input.setSelectionRange(0, 99999); /* For mobile devices */
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
  
    /* Alert the copied text */
    // alert("Copied the text: " + input.value);
    input.parentElement.removeChild(input);
  }

  String.prototype.capitalize = function() {
    return this.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  }

function htmlDecode(input){
  var e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

window.addEventListener('load', function() {
  const heroMediaContainer = document.getElementById('hero-media');
  if (heroMediaContainer) {
    const video = document.createElement('video');
    video.src = '/img/free-it-solutions.mp4';
    video.autoplay = true;
    video.loop = true;
    video.muted = true; // Important for autoplay
    video.width = 700;
    video.height = 500;
    video.className = 'd-block mx-lg-auto img-fluid'; // Keep the same classes for styling

    heroMediaContainer.innerHTML = ''; // Remove the image
    heroMediaContainer.appendChild(video);
  }
});


function fixForGithub(){
    (function() {
      // Only run on GitHub Pages
      if (!window.location.hostname.endsWith("github.io")) return;

      const repo = window.location.pathname.split('/')[1]; // first folder = repo name

      // Helper to fix elements with src or href attributes
      const fixPath = (selector, attr) => {
        document.querySelectorAll(selector).forEach(el => {
          const val = el.getAttribute(attr);
          if (val && val.startsWith('/')) {
            el.setAttribute(attr, `/${repo}${val}`);
          }
        });
      };

      // Fix CSS
      fixPath('link[rel="stylesheet"], link[rel="preload"][as="style"]', 'href');
      // Fix JS
      fixPath('script[src]', 'src');
      // Fix images
      fixPath('img[src]', 'src');
      //Fix video
      fixPath('video[src]', 'src');
    })();
}