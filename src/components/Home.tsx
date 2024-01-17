import React from 'react'

const Home = ({setPage}) => {
  return (
    <div>
        <button onClick={() => setPage('SignUp')}>Sign Up</button>
        <button onClick={() => setPage('Login')}>Login</button>
    </div>
  )
}

export default Home