var React = require('react');
var Auth = require('../Auth');
var Cache = require('../Cache');
var Constants = require('../Constants');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var AppBar = require('material-ui/lib/app-bar');
var CircularProgress = require('material-ui/lib/circular-progress');
var IconButton = require('material-ui/lib/icon-button');
var ArrowBack = require('material-ui/lib/svg-icons/navigation/arrow-back');
var MenuIcon = require('material-ui/lib/svg-icons/navigation/menu');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var IconMenu = require('material-ui/lib/menus/icon-menu')
var MenuItem = require('material-ui/lib/menus/menu-item');
var Theme = require('../theme/Theme');

var FacebookAuthPageComponent = require('./FacebookAuthPageComponent.jsx');
var RateViewpointsComponent = require('./RateViewpointsComponent.jsx');
var UserProfileComponent = require('./UserProfileComponent.jsx');
var CrowdsourcingComponent = require('./CrowdSourcingComponent.jsx');
var CYBIconComponent = require('./CYBIconComponent.jsx');

var AppComponent = React.createClass({
    childContextTypes : {
        muiTheme: React.PropTypes.object,
    },

    getChildContext : function() {
        return {
            muiTheme: ThemeManager.getMuiTheme(Theme),
        };
    },

    setScreenLater : function(screen, ignoreHistory) {
        var self = this;
        return function() {
            var stack = self.state.history;
            if (!ignoreHistory) {
                stack.push(self.state.active);
            } else {
                stack = [];
            }

            self.setState({
                active : screen,
                history : stack,
            });
        };
    },

    componentWillMount : function() {
        // Any loading here...
        this.setState({loading: false});
    },

    getInitialState : function() {
        if (!Auth.isAuth()) {
            return {
                active : Constants.SCREENS.FACEBOOK,
                history : [],
                loading : true,
            };
        } else {
            return {
                active : Constants.SCREENS.RATE_VIEWPOINTS,
                history : [],
                loading : true,
            };
        }
    },

    onPopHistory : function() {
        var stack = this.state.history;
        var screen = stack.pop();

        this.setState({history : stack});

        this.setScreenLater(screen, true)();  
    },

    logout : function() {
        Auth.deAuth();
        this.setScreenLater(Constants.SCREENS.FACEBOOK, true)();
    },

    onSelectUserProfile : function() {
      this.onSelectPage(Constant.SCREEN.USER_PROFILE);
    },

    render : function() {
        var screen = null;
        var title = 'Check Your Bias';
        var topMenu = (
            <IconMenu
                iconButtonElement={
                    <IconButton><MenuIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                <MenuItem
                    primaryText="Submit Content"
                    onClick={this.setScreenLater(Constants.SCREENS.CROWDSOURCING)}
                />
                <MenuItem
                    primaryText="Political Profile"
                    onClick={this.setScreenLater(Constants.SCREENS.USER_PROFILE)}
                />
                <MenuItem primaryText="Logout" onClick={this.logout} />
            </IconMenu>
        );

        switch (this.state.active) {
            case Constants.SCREENS.FACEBOOK:
                screen =
                    <FacebookAuthPageComponent
                        onSuccess={this.setScreenLater(Constants.SCREENS.RATE_VIEWPOINTS, true)}
                    />;
                title = 'Login';
                topMenu = null;
                break;
            case Constants.SCREENS.RATE_VIEWPOINTS:
                screen =
                    <RateViewpointsComponent />;
                title = 'Rate Viewpoints';
                break;
            case Constants.SCREENS.CROWDSOURCING:
                screen =
                    <CrowdsourcingComponent />;
                title = 'Submit Content';
                break;
            case Constants.SCREENS.USER_PROFILE:
                screen =
                    <UserProfileComponent />;
                title = 'Political Profile';
                break;
        }

        var topIcon = this.state.history.length > 0
            ? <IconButton onClick={this.onPopHistory}><ArrowBack /></IconButton>
            : <CYBIconComponent />;

        return (
            <div id="app">
                <AppBar
                    iconElementLeft={topIcon}
                    iconElementRight={topMenu}
                    title={title}
                />
                <div className='screen'>
                    {this.state.loading ? <CircularProgress size={1.5} /> : screen}
                </div>
            </div>
        );
    }
});

module.exports = AppComponent;