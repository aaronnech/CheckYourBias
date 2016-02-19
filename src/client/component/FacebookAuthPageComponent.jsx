var React = require('react');
var Auth = require('../Auth');

var FacebookAuthPageComponent = React.createClass({
    getInitialState : function() {
        return {
            errorText : ''
        };
    },

    onSignIn : function() {
        var self = this;
        self.setState({errorText: 'Loading...'});
        Auth.authFacebook(function(success, err) {
            if (success) {
                self.props.onSuccess();
                self.setState({errorText: 'Authenticated!'});
            } else {
                self.setState({errorText: 'Error: ' + err});
            }
        });
    },

    render : function() {
        return (
            <div className='indentSides'>
                <img
                    className='fbLogo'
                    onClick={this.onSignIn}
                    src="img/sign-in-facebook.png"
                />
                {this.state.errorText}
            </div>
        )
	}
});

module.exports = FacebookAuthPageComponent;