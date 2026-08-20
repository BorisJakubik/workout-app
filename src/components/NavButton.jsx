import React from 'react'

export const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button className={active ? 'nav-active' : ''} onClick={onClick}>
    <Icon size={21} />
    <span>{label}</span>
  </button>
)
