import React, {useState} from 'react'
 import { supabase } from '../supabaseClient'
 import { Link } from 'react-router-dom'

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: ""
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
      try {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            }
          }
        })
        alert("Check your email for verifcation link")
      } catch (error) {
alert(error)
      }
     }

console.log(formData)
console.log(supabase)
return(
  
       <div className="loginPage">
       <h1 className="welcome">Welcome to</h1>
       <img src=".\src\images\3.png" width="300px" className="logoImage" />
    <form onSubmit={handleSubmit} className="loginForm">
    <label htmlFor="fullName">Full name</label>
      <input
      placeholder="Full name"
      name="fullName"
      onChange={handleChange}/>
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
      <button type="submit" className="loginButtons">Submit</button>
    </form>
   <p className='noAccount'> Already have an account? </p> <button className="loginButtons"><Link to='/'>Login</Link></button>
  </div>
)
}

export { SignUp }
