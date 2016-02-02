var React = require('react');
var Constant = require('../Constant');

var RateViewpointsComponent = require('./RateViewpointsComponent.jsx');
var UserProfileComponent = require('./UserProfileComponent.jsx');

var AppComponent = React.createClass({
    getInitialState : function() {
      return {
          currentScreen : Constant.SCREEN.HOME
      };
    },
    
    onSelectPage : function(page) {
       this.setState({
           currentScreen : page  
       });
    },

    handleClick : function() {
    	this.onSelectPage(Constant.SCREEN.RATE_VIEWPOINTS);
    },

    onSelectUserProfile : function() {
      this.onSelectPage(Constant.SCREEN.USER_PROFILE);
    },

    render : function() {
        return (
          <div id="app">
              <div className={this.state.currentScreen == Constant.SCREEN.HOME ? 'show' : 'hide'}>
                 <p onClick={this.handleClick}>Home Screen!</p>

                 <p>This is my first React app.</p>

                 <p onClick={this.onSelectUserProfile}>Profile Page</p>
              </div>
              <div className={this.state.currentScreen == Constant.SCREEN.RATE_VIEWPOINTS ? 'show' : 'hide'}>
              	<RateViewpointsComponent />
              </div>
              <div className={this.state.currentScreen == Constant.SCREEN.USER_PROFILE ? 'show' : 'hide'}>
                <UserProfileComponent />
              </div>
          </div>
        );
	}
});

module.exports = AppComponent;