var React = require('react');
var Cache = require('../../Cache');
var Constants = require('../../Constants');
var Issue = require('../../../common/Issue');
var User = require('../../../common/User');

var CrowdsourcingQuoteComponent = require('./CrowdsourcingQuoteComponent.jsx');
var CrowdsourcingGeneralComponent = require('./CrowdsourcingGeneralComponent.jsx');
var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardText = require('material-ui/lib/card/card-text');
var SelectField = require('material-ui/lib/select-field');
var MenuItem = require('material-ui/lib/menus/menu-item');
var TextField = require('material-ui/lib/text-field');
var RaisedButton = require('material-ui/lib/raised-button');
var Snackbar = require('material-ui/lib/snackbar');

/**
 * Form for a user to submit content to the application. The form is dynamic and
 * changes form fields based on the type of content the user is submitting.
 *
 * @author sonjakhan
 */
var CrowdsourcingSubmitContentComponent = React.createClass({

    /**
     * contentType: The Constants.CONTENT_TYPE the user is submitting
     * formComponent: The component to show based on the selected contentType
     * category: The category from Constants.CATEGORIES the content belongs to
     * source: A string representing a url to the source of the content
     * sourceErrorText: The error text to show when there is an invalid source
     */
    getInitialState : function() {
        return {
            contentType: 1,
            candidateMap: {},
            content: "",
            formComponent: <CrowdsourcingQuoteComponent
                handleCandidateMap={this.handleCandidateMap}
                handleContent={this.handleContent}
            />,
            category: null,
            categoryName: "",
            source: "",
            sourceErrorText: Constants.ERRORS.REQUIRED,
            categoryErrorText: Constants.ERRORS.REQUIRED,
            showSnackbar: false,
            snackbarMessage: "",
            hasSubmitted: false,  // should be true while request is being processed
        };
    },

    /**
     * Sets the form to match the selected content type
     */
    handleContentType : function(event, index, value) {
        var activeForm = null;
        switch(Constants.CONTENT_TYPES[index]) {
            case 'Direct Quote':
                activeForm = <CrowdsourcingQuoteComponent
                    handleCandidateMap={this.handleCandidateMap}
                    handleContent={this.handleContent}
                />;
                break;
            case 'General Content':
                activeForm = <CrowdsourcingGeneralComponent
                    handleCandidateMap={this.handleCandidateMap}
                    handleContent={this.handleContent}
                />;

                break;
        }

        this.setState({
            contentType: value,
            formComponent: activeForm,
        });

        this.resetSavedFields();
    },

    resetAll : function() {
        this.resetSavedFields();
        this.setState({
            formComponent: <CrowdsourcingQuoteComponent
                handleCandidateMap={this.handleCandidateMap}
                handleContent={this.handleContent}
            />,
        });
    },

    resetSavedFields : function() {
        this.setState({
            candidateMap: {},
            content: "",
            category: null,
            categoryName: "",
            source: "",
            sourceErrorText: Constants.ERRORS.REQUIRED,
            categoryErrorText: Constants.ERRORS.REQUIRED
        });
    },

    /**
     * Updates the content that was set in the general content or quote tab
     */
    handleContent : function(content) {
        this.setState({content: content});
    },

    /**
     * Updates the candidate map that was set in the general content component
     */
    handleCandidateMap : function(candidateMap) {
        this.setState({candidateMap: candidateMap});
    },

    /**
     * Sets the category of the content to what the user selected
     */
    handleCategory : function(event, index, value) {
        this.setState({
            category: value,
            categoryName: Constants.CATEGORIES[value - 1],
            categoryErrorText: null
        });
    },

    /**
     * Sets the source of the content to what the user typed
     */
    handleUpdateSource : function(event) {
        var source = event.target.value;
        var errorText = null;

        if (source.length === 0) {
            errorText = Constants.ERRORS.REQUIRED;
        }

        this.setState({
            source: source,
            sourceErrorText: errorText,
        });
    },

    /**
     * Creates a new unapprovedIssue in Firebase
     */
    handleSubmit : function() {
        var self = this;
        User.getUser(Cache.getCacheV(Constants.AUTH.UID), function(user) {
            Issue.initializeUnapprovedIssue(
                Constants.CONTENT_TYPES[self.state.contentType - 1],
                self.state.content,
                self.state.source,
                self.state.candidateMap,
                user.id,
                self.state.category,
                function(error) { 
                    if (error === null) {  // success
                        self.setState({
                            hasSubmitted: false,
                            showSnackbar: true,
                            snackbarMessage: "Thank you for submitting new content",
                        });
                        self.resetAll();
                    } else {
                        self.setState({
                            hasSubmitted: false,
                            showSnackbar: true,
                            snackbarMessage: "There was an error. Please try again",
                        });
                    }
                }
            );
        });
    },

    hideSnackbar : function() {
        this.setState({
            showSnackbar: false,
        });
    },

    render : function() {
        return (
            <Card className="submit-content">
                <CardText>
                    <div className="main-content">
                        <p>What is the type of content?</p>
                        <SelectField
                            value={this.state.contentType}
                            onChange={this.handleContentType}
                        >
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
                            value={this.state.source}
                            hintText="Link to reliable source"
                            errorText={this.state.sourceErrorText}
                            multiLine={true}
                            onChange={this.handleUpdateSource}
                        />
                        <p>Category:</p>
                        <SelectField
                            value={this.state.category}
                            hintText={"Select Category"}
                            errorText={this.state.categoryErrorText}
                            onChange={this.handleCategory}>
                            {Constants.CATEGORIES.map((function(c, i) {
                                // need to start value at 1 instead of 0 for highlighting selected option
                                return (
                                    <MenuItem key={i} value={i + 1} primaryText={c} />
                                );
                            }).bind(this))}
                        </SelectField>
                        <div className="submit-button">
                            <RaisedButton
                                disabled={
                                    !Boolean(this.state.content.length)
                                    || !Boolean(Object.keys(this.state.candidateMap).length)
                                    || !Boolean(this.state.source.length)
                                    || !Boolean(this.state.categoryName.length)
                                    || this.state.hasSubmitted
                                }
                                label="Submit"
                                primary={true}
                                onClick={this.handleSubmit}
                            />
                        </div>
                        <Snackbar
                          open={this.state.showSnackbar}
                          message={this.state.snackbarMessage}
                          autoHideDuration={4000}
                          onRequestClose={this.hideSnackbar}
                        />
                    </div>
                </CardText>
            </Card>
        );
    }
});

module.exports = CrowdsourcingSubmitContentComponent;