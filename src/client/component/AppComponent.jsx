var Constants = require('../Constants');
Constants.firebaseUrl = Constants.FIREBASE_URL;
var React = require('react');
var Auth = require('../Auth');
var Cache = require('../Cache');
var InternetConnectivity = require('../InternetConnectivity');
var Candidate = require('../../common/Candidate');
var Category = require('../../common/Category');

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
var Colors = require('material-ui/lib/styles/colors');

var FacebookAuthPageComponent = require('./FacebookAuthPageComponent.jsx');
var RateViewpointsComponent = require('./RateViewpointsComponent.jsx');
var PoliticalProfileComponent = require('./PoliticalProfileComponent.jsx');
var CrowdsourcingComponent = require('./crowdsourcing/CrowdsourcingComponent.jsx');
var CandidateRankingComponent = require('./CandidateRankingComponent.jsx');
var CYBIconComponent = require('./CYBIconComponent.jsx');

/**
 * This component controls the application's page views and delegates
 * to other components to take control of the screen and render
 */
var AppComponent = React.createClass({
    childContextTypes : {
        muiTheme: React.PropTypes.object,
    },

    getChildContext : function() {
        return {
            muiTheme: ThemeManager.getMuiTheme(Theme),
        };
    },

    /*
    * Sets the screen view to the given screen
    *
    * @param screen
    */
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
        InternetConnectivity.startConnectivity();
        Auth.isAuth((authed) => {
            if (!authed) {
                this.setState({active : Constants.SCREENS.FACEBOOK});
            }
            this.setState({loading: false});
        });
        Candidate.getAllCandidates(function(candidates) {
            var candidateCache = [];
            for (var candidate in candidates) {
                candidateCache.push(candidates[candidate].name);
            }
            Cache.setCacheKV(Constants.CACHE.CANDIDATES, JSON.stringify(candidateCache));
        });
        Category.getAllCategories(function(categories) {
            var categoryCache = [];
            for (var category in categories) {
                categoryCache.push(categories[category].categoryName);
            }
            Cache.setCacheKV(Constants.CACHE.CATEGORIES, JSON.stringify(categoryCache));
        });
    },

    /*
    * returns the initial state of the app based on the user login
    * and default screen settings
    */
    getInitialState : function() {
        return {
            active : Constants.SCREENS.RATE_VIEWPOINTS,
            history : [],
            loading : true,
        };
    },

    /*
    * helper used in navigating between pages in history
    */
    onPopHistory : function() {
        var stack = this.state.history;
        var screen = stack.pop();

        this.setState({history : stack});

        this.setScreenLater(screen, true)();
    },

    /*
    * logs user out of the application
    */
    logout : function() {
        Auth.deAuth();
        this.setScreenLater(Constants.SCREENS.FACEBOOK, true)();
    },

    /*
    * renders the view
    */
    render : function() {
        var screen = null;
        var title = 'Check Your Bias';
        var topMenu = (
            <IconMenu
                iconButtonElement={
                    <IconButton>
                        <MenuIcon />
                    </IconButton>
                }
                iconStyle={{
                    color: Colors.grey800,
                    fill: Colors.grey800
                }}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                <MenuItem
                    primaryText="Rate Viewpoints"
                    onClick={this.setScreenLater(Constants.SCREENS.RATE_VIEWPOINTS, true)}
                />
                <MenuItem
                    primaryText="Your Candidates"
                    onClick={this.setScreenLater(Constants.SCREENS.CANDIDATE_RANKING, true)}
                />
                <MenuItem
                    primaryText="Submit Content"
                    onClick={this.setScreenLater(Constants.SCREENS.CROWDSOURCING, true)}
                />
                <MenuItem
                    primaryText="Political Profile"
                    onClick={this.setScreenLater(Constants.SCREENS.POLITICAL_PROFILE, true)}
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
            case Constants.SCREENS.CANDIDATE_RANKING:
                screen =
                    <CandidateRankingComponent />;
                title = 'Your Candidates';
                break;
            case Constants.SCREENS.POLITICAL_PROFILE:
                screen =
                    <PoliticalProfileComponent />;
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
                    style={{
                        backgroundColor: Colors.grey100,
                    }}
                    titleStyle={{
                        color: Colors.grey800
                    }}
                />
                <div className='screen'>
                    {this.state.loading ? <CircularProgress size={1.5} /> : screen}
                </div>
            </div>
        );
    }
});

module.exports = AppComponent;