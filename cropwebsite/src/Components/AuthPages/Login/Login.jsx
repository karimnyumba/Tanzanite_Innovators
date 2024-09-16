import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useMainContext } from '../../../ context';
const Login = ({ setToken, setUserId}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {handleSetUserData, handleSetToken} = useMainContext();

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('https://tyktyk.pythonanywhere.com/api/dj-rest-auth/login/', {
            username,
            password,
          });
          handleSetToken(response.data.key);
    
          const userResponse = await axios.get('https://tyktyk.pythonanywhere.com/api/user-details/', {
            headers: {
              'Authorization': `Token ${response.data.key}`
            }
          });
          handleSetUserData({id:userResponse.data.pk, username:userResponse.data.username});
          
    
          const role = userResponse.data.role;
    
          switch (role) {
            case 'farmer':
              navigate('/farmers/*');
              break;
            case 'buyer':
              navigate('/buyers/*');
              break;
            case 'extension_officer':
            default:
              navigate('/experts/*');
              break;
          }
    
          setError(null);
        } catch (err) {
          setError('Invalid username or password');
        }
      };

      const styles = {
        paragraph: {
            marginTop: '20px',
            fontSize: '14px',
          },
          link: {
            color: '#4CAF50',
          },
          error: {
            color: 'red',
          }
        };
   
    return (
        <div className="login-container">
            <h2>Log In to Your Account</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    placeholder="Enter your username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                />

                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required  
                />

                <button type="submit" className="btn dark-btn">Log In</button>
            </form>
            {error && <p style={styles.error}>{error}</p>}
      <p style={styles.paragraph}>Forgot your password? <a href="/forgotpassword" style={styles.link}>Reset it here</a></p>
      <p style={styles.paragraph}>Don't have an account? <a href="/signup" style={styles.link}>Sign Up</a></p>
      <p style={styles.paragraph}>Back to <a href="/" style={styles.link}>Home</a></p>
        </div>
    );
};

export default Login;
