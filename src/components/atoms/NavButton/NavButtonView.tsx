import React from 'react'
import type { NavButtonViewProps } from './NavButtonView.types'

export const NavButton = ({ icon: Icon, label, active, onClick }: NavButtonViewProps) => (
  <button className={active ? 'nav-active' : ''} onClick={onClick}>
    <Icon size={21} />
    <span>{label}</span>
  </button>
)
