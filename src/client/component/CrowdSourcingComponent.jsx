var React = require('react');
var Constants = require('../Constants');

var CrowdsourcingQuoteComponent = require('./CrowdsourcingQuoteComponent.jsx');
var CrowdsourcingGeneralComponent = require('./CrowdsourcingGeneralComponent.jsx');
var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardText = require('material-ui/lib/card/card-text');
var SelectField = require('material-ui/lib/select-field');
var MenuItem = require('material-ui/lib/menus/menu-item');
var TextField = require('material-ui/lib/text-field');
var RaisedButton = require('material-ui/lib/raised-button');

var CrowdsourcingComponent = React.createClass({

    getInitialState : function() {
        return {
            contentType: 1,
            formComponent: <CrowdsourcingQuoteComponent />,
            category: 1,
            source: null,
            sourceErrorText: Constants.ERRORS.REQUIRED,
        };
    },

    handleContentType : function(event, index, value) {
        var activeForm = null;
        switch(Constants.CONTENT_TYPES[index]) {
            case 'Direct Quote':
                activeForm = <CrowdsourcingQuoteComponent />
                break;
            case 'General Content':
                activeForm = <CrowdsourcingGeneralComponent />
                break;
        }

        this.setState({
            contentType: value,
            formComponent: activeForm,
        });
    },

    handleCategory : function(event, index, value) {
        this.setState({
            category: value,
        });
    },

    handleUpdateSource : function(event) {
        var source = event.target.value;
        var errorText = null;

        if (source.length == 0) {
            errorText = Constants.ERRORS.REQUIRED;
        }

        this.setState({
            source: source,
            sourceErrorText: errorText,
        })
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
                        <p>Source:</p>
                        <TextField
                            hintText="Link to reliable source"
                            errorText={this.state.sourceErrorText}
                            multiLine={true}
                            onChange={this.handleUpdateSource}
                        />
                        <p>Category:</p>
                        <SelectField value={this.state.category} onChange={this.handleCategory}>
                            {Constants.CATEGORIES.map((function(c, i) {
                                // need to start value at 1 instead of 0 for highlighting selected option
                                return (
                                    <MenuItem key={i} value={i + 1} primaryText={c} />
                                );
                            }).bind(this))}
                        </SelectField>
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