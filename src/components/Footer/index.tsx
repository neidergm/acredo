import classnames from 'classnames'

const Footer = ({ className }: { className?: string }) => {
  return (
    <div className={classnames('text-center py-3', className)}>
      <small>Acredo &copy; {new Date().getFullYear()}</small>
    </div>
  )
}

export default Footer