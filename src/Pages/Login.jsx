import React, { useState, useEffect } from 'react'
 import { supabase } from '../supabaseClient'
 import { Link, useNavigate } from 'react-router-dom'
 import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { PodcastCard }  from '../components/PodcastCard'

const Login = ({setToken}) => {
  const [podcastData, setPodcastData] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

  useEffect(() => {
    fetch('https://podcast-api.netlify.app/shows')
    .then(res => { 
        if (!res.ok) {
            throw new Error("Something is wrong")
        }
         return res.json()
    })
    .then(data => {
        const shuffledData = shuffleArray(data);
        const selectedData = shuffledData.slice(0, 10);
         setPodcastData(selectedData)
       
    })
}, [])

  const PodcastCarousel = ({ podcastData }) => {
    const handleClick = () => {
      alert("Please log in to view podcast content.")
      return navigate('/')
    }

    return (
        <div className="podcastCard" onClick={handleClick}>
            {podcastData.length > 0 ? (
                <Carousel autoplay={true} infiniteLoop useKeyboardArrows showThumbs={false}>
                    {podcastData.map(item => (
                        <PodcastCard
                            key={item.id}
                            {...item}
                        />
                    ))}
                </Carousel>
            ) : (
                <p>Loading podcasts...</p>
            )}
        </div>
    );
};

    let navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "", password: ""
    })

  function handleChange(event) {
       const { name, value, type, checked } = event.target
       setFormData(prevFormData => {
         return {
           ...prevFormData,
          [name]: type === "checkbox" ? checked: value
        }
       })
     }

     async function handleSubmit(event) {
      event.preventDefault()
      setIsLoggedIn(true)
      try {
       
const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })
        if (error) throw error
        setToken(data)
        navigate('/homepage')
      } catch (error) {
alert(error)
      }
     }

return(
  
     <div className="loginPage">
       <h1 className="welcome">Welcome to</h1>
       <img src=".\images\3.png" width="300px" className="logoImage" />
      <PodcastCarousel podcastData={podcastData} />
    <form onSubmit={handleSubmit} className="loginForm">
        <label htmlFor="email">Email</label>
      <input
      placeholder="Email"
      name="email"
      onChange={handleChange}/>
        <label htmlFor="password">Password</label>
      <input
      placeholder="Password"
      name="password"
      type="password"
      onChange={handleChange}/>
      <button type="submit" className="loginButtons">Login</button>
    </form>
  <p className='noAccount'>Don't have an account?</p> <button  className="loginButtons"><Link to='/signup'>Sign Up</Link></button>
  </div>
)
}

export { Login }
