import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { AppContainer } from './components/views/App/AppContainer'
import { store } from './store'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppContainer />
    </Provider>
  </React.StrictMode>,
)
