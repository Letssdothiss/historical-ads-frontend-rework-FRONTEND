import { Link } from 'react-router-dom'
import MainLayout from '../../app/layout/MainLayout'
import { ROUTES } from '../../shared/constants/routes'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <MainLayout>
      <section className="not-found-page">
        <h1>404</h1>
        <h2>Sidan kunde inte hittas</h2>
        <p>Länken är felaktig eller har tagits bort.</p>
        <Link to={ROUTES.JOB_ADS} className="not-found-page__link">
          Tillbaka till sökningen
        </Link>
      </section>
    </MainLayout>
  )
}
