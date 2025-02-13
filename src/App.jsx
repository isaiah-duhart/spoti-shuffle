import { useNavigate } from "react-router-dom";
import './App.css'

function App() {

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `profile`; 
    navigate(path);
  }

  return (
    <>
      <h1>Ready to revolutionize your music listening experience?</h1>
      <button type="button" onClick={routeChange}>Connect To Spotify</button>
    </>
  )
}

export default App
