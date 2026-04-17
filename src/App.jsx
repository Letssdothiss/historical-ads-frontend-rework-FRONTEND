import './App.css'
import { DigiLogo } from '@designsystem-se/af-react'
import { LogoColor } from '@designsystem-se/af'

function App() {
  return (
    <>
      <section id="center">
        <div className="hero">
          <DigiLogo
            afOnlySymbol={false}
            afColor={LogoColor.SECONDARY}
          ></DigiLogo>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Dokumentation</h2>
          <ul>
            <li>
              <a
                href="https://github.com/Letssdothiss/historical-ads-frontend-rework-FRONTEND"
                target="_blank"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                Github Frontend Repo
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Letssdothiss/historical-ads-frontend-rework-BACKEND"
                target="_blank"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                Github Backend Repo
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Historical Ads</h2>
          <p>
            Här pågår ett studentprojekt där vi jobbar med att skapa en
            omarbetat version av den sida som finns för historiska
            platsannonser.
          </p>

          <ul>
            <li>
              <a
                href="https://historical-ads-frontend.jobtechdev.se/annonser"
                target="_blank"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                Befintlig sida här.
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
