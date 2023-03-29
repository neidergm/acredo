import React from 'react'
import classnames from 'classnames'

const Footer = ({ className }: { className?: string }) => {
  return (
    <div className={classnames('text-center py-3', className)}>
      <small>Corporación Universitaria Rafael Núñez | Institución Universitaria | Vigilada Mineducación</small>
    </div>
  )
}

export default Footer