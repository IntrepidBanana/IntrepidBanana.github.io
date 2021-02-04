const articles = document.querySelectorAll("article");
articles.forEach(a=>{
    let img = a.querySelector("img");
    a.style.backgroundImage = `url(${img.src})`;
})