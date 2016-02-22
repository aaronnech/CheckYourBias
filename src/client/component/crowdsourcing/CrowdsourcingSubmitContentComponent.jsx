var React = require('react');
var Cache = require('../../Cache');
var Constants = require('../../Constants');
var Issue = require('../../../common/Issue');
var User = require('../../../common/User');
var Category = require('../../../common/Category');


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
            categoriesList: [],
            category: 0,
            source: "",
            sourceErrorText: Constants.ERRORS.REQUIRED,
            categoryErrorText: Constants.ERRORS.REQUIRED,
            showSnackbar: false,
            snackbarMessage: "",
            hasSubmitted: false,  // should be true while request is being processed
        };
    },

    createAllCategories : function(categories) {

        category_names = [];
        for (var category_index in categories) {
            var cat = categories[category_index];
            var name = cat.categoryName;
            category_names.push(<MenuItem value={parseInt(category_index) + 1} key={parseInt(category_index) + 1} primaryText={name}/>);
        }

        this.setState({
            categoriesList: category_names,
        });
    },

    componentDidMount : function() {
        Category.getAllCategories(this.createAllCategories);
    },

    /**
     * Sets the form to match the selected content type
     */
    handleContentType : function(event, index, value) {
        this.setState({
            contentType: value,
        });

        this.resetSavedFields();
    },

    /**
     * Resets the saved fields to be empty for more content to be submitted.
     */
    resetSavedFields : function() {
        var component = null;
        if (this.state.contentType === 1) {
            component = this.refs["quoteComponent"];
        } else if (this.state.contentType === 2) {
            component = this.refs["generalComponent"];
        }

        if (component) {
            component.resetToInitialState();
        }

        this.setState({
            candidateMap: {},
            content: "",
            category: 0,
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
                [self.state.source],
                self.state.candidateMap,
                user.id,
                [self.state.category - 1],
                function(error) {
                    if (error === null) {  // success
                        self.setState({
                            hasSubmitted: false,
                            showSnackbar: true,
                            snackbarMessage: "Thank you for submitting new content",
                        });
                        self.resetSavedFields();
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
        var formComponent = null;
        if (this.state.contentType === 1) {
            formComponent = <CrowdsourcingQuoteComponent
                ref="quoteComponent"
                handleCandidateMap={this.handleCandidateMap}
                handleContent={this.handleContent}
            />;
        } else if (this.state.contentType === 2) {
            formComponent = <CrowdsourcingGeneralComponent
                ref="generalComponent"
                handleCandidateMap={this.handleCandidateMap}
                handleContent={this.handleContent}
            />;
        }

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
                        {formComponent}
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
                            {this.state.categoriesList}
                        </SelectField>
                        <div className="submit-button">
                            <RaisedButton
                                disabled={
                                    !Boolean(this.state.content.length)
                                    || !Boolean(Object.keys(this.state.candidateMap).length)
                                    || !Boolean(this.state.source.length)
                                    || !Boolean(this.state.category > 0)
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