var React = require('react');
var Constant = require('../Constant');

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

    render : function() {
        return (
          <div id="app">
              <div className={this.state.currentScreen == Constant.SCREEN.HOME ? 'show' : 'hide'}>
                 <p>Home Screen!</p>
              </div>
          </div>
        );
	}
});

module.exports = AppComponent;