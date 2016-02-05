var React = require('react');
var Constants = require('../Constants');

var CrowdsourcingQuoteComponent = require('./CrowdsourcingQuoteComponent.jsx');
var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardText = require('material-ui/lib/card/card-text');
var SelectField = require('material-ui/lib/select-field');
var MenuItem = require('material-ui/lib/menus/menu-item');
var RaisedButton = require('material-ui/lib/raised-button');

var CrowdsourcingComponent = React.createClass({

    getInitialState : function() {
        return {
            contentType: 1,
            formComponent: <CrowdsourcingQuoteComponent />,
        };
    },

    handleContentType : function(event, index, value) {
        var activeForm = null;
        switch(Constants.CONTENT_TYPES[index]) {
            case 'Direct Quote':
                activeForm = <CrowdsourcingQuoteComponent />
                break;
            // TODO (sonjakhan): implement General Content & Summary of Legislation Forms
        }

        this.setState({
            contentType: value,
            formComponent: activeForm,
        });
    },

    render : function() {
        return (
            <Card className="submit-content">
                <CardText>
                    <div className="main-content">
                        <p>What is the type of content?</p>
                        <SelectField value={this.state.contentType} onChange={this.handleContentType}>
                            {Constants.CONTENT_TYPES.map((function(c, i) {
                                // need to start value at 1 instead of 0 for highlighting selected option
                                return (
                                    <MenuItem key={i} value={i + 1} primaryText={c} />
                                );
                            }).bind(this))}
                        </SelectField>
                        {this.state.formComponent}
                        <div className="submit-button">
                            <RaisedButton label="Submit" primary={true} />
                        </div>
                    </div>
                </CardText>
            </Card>
        );
    }
});

module.exports = CrowdsourcingComponent;