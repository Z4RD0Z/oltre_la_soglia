( function ()
{
  const page = document.body.dataset.page || 'about';
  const headerRoot = document.getElementById( 'site-header' );
  const footerRoot = document.getElementById( 'site-footer' );

  if ( headerRoot )
  {
    const headerMarkup = `
            <svg class="sigil" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#cdd1c2" stroke-width="0.6"/>
              <polygon points="50,12 85,80 15,80" fill="none" stroke="#cdd1c2" stroke-width="0.6"/>
              <circle cx="50" cy="58" r="7" fill="none" stroke="#cdd1c2" stroke-width="0.6"/>
            </svg>

            <header>
              <h1>Oltre la soglia</h1>
              <p>gruppo di lettura</p>
            </header>

            <nav>
              <a href="index.html" data-page="about">About</a>
              <a href="libri.html" data-page="books">Le nostre letture</a>
              <a href="archivio.html" data-page="archive">Archivio</a>

            </nav>
        `;

    headerRoot.innerHTML = headerMarkup;

    const activeLink = headerRoot.querySelector( `[data-page="${page}"]` );
    if ( activeLink )
    {
      activeLink.classList.add( 'active' );
    }
  }

  if ( footerRoot )
  {
    const currentPage = window.location.pathname.split( '/' ).pop() || 'index.html';
    const showLegalLink = currentPage !== 'termini-condizioni.html';

    const footerMarkup = `
            <footer>
  Fatto con <i class="fa fa-heart"></i> da <a href="https://github.com/Z4RD0Z">Z4RD0Z</a><br>
  © 2026 Oltre la soglia — tutte le soglie appartengono al loro custode<br>
  ${page === 'books'
        ? 'Copertine e riferimenti bibliografici via OpenLibrary<br>'
        : ''}
  ${showLegalLink
        ? '<a href="termini-condizioni.html">termini e condizioni</a>'
        : ''}
</footer>
        `;
    footerRoot.innerHTML = footerMarkup;
  }
} )();
