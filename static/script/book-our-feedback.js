const params = new URLSearchParams(window.location.search);
const bookID = params.get('id');
const bookName = params.get('name');

fetch(`/static/documents/${bookID}/index.md`)
    .then(r => r.text()).then(md => {
        document.getElementById('title').innerHTML = `<h2>I nostri pareri su: ${bookName}</h2>`;
        document.getElementById('content').innerHTML = marked.parse(md);
    }).catch(err => {
        console.error(err);
        window.location.href = '/404.html';
    });
