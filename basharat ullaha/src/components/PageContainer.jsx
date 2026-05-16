export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`page-transition ${className}`}>
      {children}
    </div>
  )
}
