const params = new URLSearchParams(window.location.search);
const bookID = params.get('id');
const bookName = params.get('name');

if (!bookID || !/^[a-zA-Z0-9_-]+$/.test(bookID)) {
    document.getElementById('content').innerHTML = '<p>Parametro non valido.</p>';
} else {
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
    fetch(`${basePath}/public/documents/${encodeURIComponent(bookID)}/index.md`).then(r => {
        if (!r.ok) throw new Error(r.status);
        return r.text();
    })
        .then(md => {
            const titleEl = document.getElementById('title');
            titleEl.innerHTML = '';
            const h2 = document.createElement('h2');
            h2.textContent = `I nostri pareri su: ${bookName}`;
            titleEl.appendChild(h2);

            document.getElementById('content').innerHTML = marked.parse(md);
        })
        .catch(err => {

            if (err.message === '404') {
                document.getElementById('content').innerHTML = '<p>Non esistono ancora pareri per il libro selezionato.</p>';
            } else {
                document.getElementById('content').innerHTML = '<p>Si è verificato un errore nel caricamento del contenuto. Riprova più tardi.</p>';
            }
        });
}