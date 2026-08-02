const params = new URLSearchParams(window.location.search);
const articleID = params.get('id');

fetch(`/static/documents/${articleID}/index.md`)
    .then(r => r.text()).then(md => {
        document.getElementById('content').innerHTML = marked.parse(md);
    }).catch(err => {
        console.error(err);
        window.location.href = '/404.html';
    });
