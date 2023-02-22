import AddAlbum from './AddAlbum'
import Main from './Main'
import EditAlbum from './EditAlbum'
import Login from './login'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={ <Login/> } />
        <Route path='/addalbum' element={ <AddAlbum/> } />
        <Route path='/editalbum/:id' element={ <EditAlbum/> } />
        <Route path='/' element={ <Main/> } />
      </Routes>
    </>
  )
}

export default App
