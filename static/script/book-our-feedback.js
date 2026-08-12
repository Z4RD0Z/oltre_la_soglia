const params = new URLSearchParams(window.location.search);
const bookID = params.get('id');
const bookName = params.get('name');

fetch(`/static/documents/${bookID}/index.md`)
    .then(r => {
        if (!r.ok) throw new Error(r.status);
        return r.text();
    })
    .then(md => {
        document.getElementById('title').innerHTML =
            `<h2>I nostri pareri su: ${bookName}</h2>`;
        document.getElementById('content').innerHTML = marked.parse(md);
    })
    .catch(err => {
        console.log(err);
        if (err.message === '404') {
            document.getElementById('content').innerHTML = '<p>Non esistono ancora pareri per il libro selezionato.</p>';
        } else {
            document.getElementById('content').innerHTML = '<p>Si è verificato un errore nel caricamento del contenuto. Riprova più tardi.</p>';
        }
    });

