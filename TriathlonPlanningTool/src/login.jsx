import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input } from 'antd';
import gsap from 'gsap';
import './login.css';


function LoginSignupPage(){
  const navigate = useNavigate();
  const [Mode, setMode] = useState('Login');
  
  return (
    <div className={`loginContainer`}>
      <h1 className='loginSignupTitle'>Triathlon Planning Tool</h1>
      {Mode === 'Login' ? (
        <Login setMode={setMode} Mode={Mode} navigate={navigate} />
        ) : (
        <Signup setMode={setMode} Mode={Mode} navigate={navigate} />
      )}
    </div>
  );
}

function Login({setMode, navigate}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  function submit(){
    console.log(username)
    console.log(password)
    var jsonData = {
      "username": username,
      "password": password
    }
    fetch('http://localhost:5000/login', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    })
    .then(res => res.json())
    .then((response) => {
      let token = JSON.stringify(response.token)
      
      if (token !== undefined) {
        localStorage.setItem('token', response.token);
        navigate('/');
      } else {
        setAlert(response.message);
      }
      return response;
    })
    .catch((error) => {
      console.log('Error:', error);
    });
  }

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }


  return (
    <Card title="Login" hoverable={true} className='SignupHolder' actions={[<Switchmode Mode={"Signup"} setMode={setMode}/>, <Button type="primary" onClick={submit}>Login</Button>]}>
      <Form>
          <Form.Item
          label="Username"
          name="username"
          >
            <Input value={username} onChange={handleUsernameChange}/>
          </Form.Item>
          
          <Form.Item
          label="Password"
          name="password"
          >
            <Input value={password} onChange={handlePasswordChange}/>
          </Form.Item>
      </Form>
    </Card>
  )
}

function Signup({setMode, navigate}) {
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  function submit(){
    console.log(username)
    console.log(password)
    var jsonData = {
      "username": username,
      "password": password
    }
    fetch('http://localhost:5000/signup', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    })
    .then(res => res.json())
    .then((response) => {
      let token = JSON.stringify(response.token)
      
      if (token !== undefined) {
        localStorage.setItem('token', response.token);
        navigate('/');
      } else {
        setAlert(response.message);
      }
      return response;
    })
    .catch((error) => {
      console.log('Error:', error);
    });
  }

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }


  return (
    <Card title="Signup" hoverable={true} className='SignupHolder' actions={[<Switchmode Mode={"Login"} setMode={setMode}/>, <Button type="primary" onClick={submit}>Signup</Button>]}>
      <Form>
          <Form.Item
          label="Username"
          name="username"
          >
            <Input value={username} onChange={handleUsernameChange}/>
          </Form.Item>
          
          <Form.Item
          label="Password"
          name="password"
          >
            <Input value={password} onChange={handlePasswordChange}/>
          </Form.Item>
          
          <Form.Item
          label="Confirm Password"
          name="Confirm Password"
          >
            <Input value={confirmPassword} onChange={handleConfirmPasswordChange}/>
          </Form.Item>
      </Form>
    </Card>
  )
}

function Switchmode({Mode, setMode}) {
  function changeMode (){
    Mode === "Login" ? ( setMode("Login")) : ( setMode("Signup"))
  }
  return (
    <>
      <Button type="default"  onClick={changeMode}>{Mode}</Button>
    </>
  )
}

export default LoginSignupPage