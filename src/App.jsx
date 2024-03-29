import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import  { FavoritesProvider }  from './components/FavComponents';
import { Favorites } from './components/Favorites';
import { AudioPlayer } from './components/Audioplayer';
import { SignUp } from './Pages';
import { Login } from './Pages';
import { Homepage } from './Pages';
import { SingleShow } from './Pages';


const App = () => {
  const [token, setToken] = useState(false)
  const [session, setSession] = useState(null)

  if(token) {
    sessionStorage.setItem('token', JSON.stringify(token))
  }

  useEffect(() => {
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'))
      setToken(data)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

//   function PrivateRoute({ children }) {
//     const { user: token } = useSelector(x => x.auth);
    
//     if (!token) {
//         // not logged in so redirect to login page with the return url
//         return <Navigate to="/login" state={{ from: history.location }} />
//     }

//     // authorized so return child components
//     return children;
// }

if(!token) {
  // alert("You need to be logged in to view this content.");
  <Navigate to="/"/>
}


  return (
    <div>
      <AudioPlayer/>
      <FavoritesProvider> {/* Always render the provider */}
        <Routes>
          <Route path={'/signup'} element={<SignUp/>}/>
          <Route path={'/'} element={<Login setToken={setToken}/>}/>
          {token && <Route path={'/homepage'} element={<Homepage token={token}/>}/>}
          {token && <Route path="/podcasts/:id" element={<SingleShow/>} />}
          <Route path="/favorites" element={<Favorites/>} />
        </Routes>
      </FavoritesProvider>
      <AudioPlayer />
      
    </div>
  )
}

export { App }
