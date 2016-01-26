var React = require('react');
var Constant = require('../Constant');

var RateViewpointsComponent = require('./RateViewpointsComponent.jsx');

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

    render : function() {
        return (
          <div id="app">
              <div className={this.state.currentScreen == Constant.SCREEN.HOME ? 'show' : 'hide'}>
                 <p onClick={this.handleClick}>Home Screen!</p>

                 <p>This is my first React app.</p>
              </div>
              <div className={this.state.currentScreen == Constant.SCREEN.RATE_VIEWPOINTS ? 'show' : 'hide'}>
              	<RateViewpointsComponent />
              </div>
          </div>
        );
	}
});

module.exports = AppComponent;