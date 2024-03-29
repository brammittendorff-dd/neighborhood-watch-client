import React from 'react'
// import { Link } from 'react-router-dom'
import MainContext from '../../contexts/MainContext'
import { NavLink } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import TokenService from '../../services/token-service'
import IdleService from '../../services/idle-service'

class Nav extends React.Component {

  static contextType = MainContext

    handleLogoutClick = () => {
      // this.context.loggedOut()
      TokenService.clearAuthToken()
      TokenService.clearCallbackBeforeExpiry()
      IdleService.unRegisterIdleResets()
    }

    renderLogoutLink () {
      return (
        <header className='Nav__header'>
        <a href="#main-menu"
           id="main-menu-toggle"
           className="menu-toggle"
        >
          <span className="fa fa-bars" aria-hidden="true"></span>
        </a>         
        <h3 className='logo'>
            <NavLink to ='/'><i className="fas fa-home"></i>
                Neighborhood Watch
            </NavLink>
        </h3>
        
        <nav id="main-menu" className="main-menu" aria-label="Main menu">
          <a href="#main-menu-toggle"
             id="main-menu-close"
             className="menu-close"
          >
            <span className="fas fa-times" aria-hidden="true"></span>
          </a>
          <ul className='main__ul'>
            <li>
              <a href='/mem-profiles#main-menu-toggle'>Member Profiles</a>
            </li>
            <li>
              <a href='/my-profile#main-menu-toggle'>My Profile</a>
            </li>
            <li>
              <a href='/#main-menu-toggle' onClick={this.handleLogoutClick}>Logout</a>
            </li>
          </ul>
          <ul className='second__ul'>
            <li>
              <a href='/category/1#main-menu-toggle'>All Posts</a>
              {/* <NavLink
                  to={`/category/1#main-menu-toggle`}
              >
                All Posts
              </NavLink> */}
            </li>
            <li>
              <a href='/category/Crime and Alerts#main-menu-toggle'>Crime and Alerts</a>
              {/* <NavLink
                  to={`/category/Crime and Alerts#main-menu-toggle`}
              >
                Crime and Alerts
              </NavLink> */}
            </li>
            <li>
              <a href='/category/Upcoming Events#main-menu-toggle'>Upcoming Events</a>
              {/* <NavLink
                  to={`/category/Upcoming Events#main-menu-toggle`}
              >
                Upcoming Events
              </NavLink> */}
            </li>
            <li>
              <a href='/category/Lost and Found#main-menu-toggle'>Lost and Found</a>
              {/* <NavLink
                  to={`/category/Lost and Found#main-menu-toggle`}
              >
                Lost and Found
              </NavLink> */}
            </li>
          </ul>
          <div className='Nav__footer'>
            <Footer />
          </div>
        </nav>
        <a href="#main-menu-toggle"
           className="backdrop"
           tabIndex="-1"
           aria-hidden="true" hidden></a>
      </header> 
      )
    }

    renderLoginLink () {
      return (
        <header className='Nav__header'>
        <a href="#main-menu"
           id="main-menu-toggle"
           className="menu-toggle"
        >
          <span className="fa fa-bars" aria-hidden="true"></span>
        </a>         
        <h3 className='logo'>
            <NavLink to ='/'><i className="fas fa-home"></i>
                Neighborhood Watch
            </NavLink>
        </h3>
        
        <nav id="main-menu" className="main-menu" aria-label="Main menu">
          <a href="#main-menu-toggle"
             id="main-menu-close"
             className="menu-close"
          >
            <span className="fas fa-times" aria-hidden="true"></span>
          </a>
          <ul className='main__ul'>
            <li> 
                <a href='/register#main-menu-toggle'>Create an Account</a>
            </li>
            <li>
              <a href='/login#main-menu-toggle'>Login</a>
            </li>
          </ul>
          <div className='Nav__footer'>
            <Footer />
          </div>
        </nav>
        <a href="#main-menu-toggle"
           className="backdrop"
           tabIndex="-1"
           aria-hidden="true" hidden></a>
      </header> 
      )
    }



    render () {
        return (
          <section className='NavSection'>
            {TokenService.hasAuthToken() ? this.renderLogoutLink() : this.renderLoginLink()}
          </section>
        )
    }
}

export default Nav