import * as React from 'react';
import Avatar from 'react-avatar';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppConfig from 'config/config';
import Link from 'config/config-types';
import { GlobalState } from 'ducks/rootReducer';
import { getLoggedInUser } from 'ducks/user/reducer';
import { LoggedInUser, GetLoggedInUserRequest } from 'ducks/user/types';
import { logClick } from "ducks/utilMethods";

import './styles.scss';

// Props
interface StateFromProps {
  loggedInUser: LoggedInUser;
}

interface DispatchFromProps {
  getLoggedInUser: () => GetLoggedInUserRequest;
}

export type NavBarProps = StateFromProps & DispatchFromProps;

// State
interface NavBarState {
  loggedInUser: LoggedInUser;
}

export class NavBar extends React.Component<NavBarProps, NavBarState> {
  constructor(props) {
    super(props);

    this.state = {
      loggedInUser: this.props.loggedInUser,
    };
  }

  componentDidMount() {
    this.props.getLoggedInUser();
  }

  generateNavLinks(navLinks: LinkConfig) {
    return navLinks.map((link, index) => {
      if (link.use_router) {
        return <NavLink key={index} to={link.href} target={link.target} onClick={logClick}>{link.label}</NavLink>
      }
      return <a key={index} href={link.href} target={link.target} onClick={logClick}>{link.label}</a>
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="nav-bar">
            <div id="nav-bar-left" className="nav-bar-left">
              {
                AppConfig.logoPath &&
                <img id="logo-icon" className="logo-icon" src={AppConfig.logoPath} />
              }
              <Link to={`/`}>
                AMUNDSEN
              </Link>
            </div>
            <div id="nav-bar-right" className="nav-bar-right">
              {this.generateNavLinks(AppConfig.navLinks)}
              {
                // TODO PEOPLE - Add link to user profile
                this.state.loggedInUser &&
                  <Avatar name={this.state.loggedInUser.display_name} size={32} round={true} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    loggedInUser: state.user.loggedInUser,
  }
};

export const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getLoggedInUser }, dispatch);
};

export default withRouter(connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(NavBar));
