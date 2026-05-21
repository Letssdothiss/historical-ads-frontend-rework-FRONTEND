import './ResultCount.css'

function ResultCount({ count }) {
  return (
    <p className="result-count">
      Totalt {count} annonser i valt geografiskt område under vald tidsperiod
    </p>
  )
}

export default ResultCount
