import { Provider } from 'react-redux'
import './App.css'
import { Router } from './routes/Router'
import './styles/variable.css'
import { store } from './store/store'
import { Loader } from './components/common/Loader'
import { Toast } from './components/common/Toast'
function App() {
  return (
  
    <Provider store={store}>
      <Loader />
      <Toast />
      <Router />
    </Provider>
  )
}

export default App
