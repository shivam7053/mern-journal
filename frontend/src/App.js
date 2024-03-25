import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Journal from './pages/Journal';
import ReviewEntries from './pages/ReviewEntries';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/Layout/PrivateRoute';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear token from local storage or cookie if needed
  };

  return (
    <Router>
      <Layout>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><Link to="/review">Review Entries</Link></li>
            {isAuthenticated ? (
              <li><button onClick={handleLogout}>Logout</button></li>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" render={(props) => <Login {...props} onLogin={handleLogin} />} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/journal" isAuthenticated={isAuthenticated} component={Journal} />
          <PrivateRoute path="/review" isAuthenticated={isAuthenticated} component={ReviewEntries} />
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
