var React = require('react');
var Cache = require('../../Cache');
var InternetConnectivity = require('../../InternetConnectivity');
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
     */
    getInitialState : function() {
        return {
            contentType: 1,
            candidateMap: {},
            content: "",
            categoriesList: JSON.parse(Cache.getCacheV(Constants.CACHE.CATEGORIES)),
            selectedCategories: [],
            sources: [],  // list of all sources that have already been added
            source: "",  // current source
            categoryErrorText: Constants.ERRORS.BLANK_LINE,
            sourceErrorText: Constants.ERRORS.BLANK_LINE,
            showErrorUnderlines: false,
            showSnackbar: false,
            snackbarMessage: "",
            hasSubmitted: false,  // should be true while request is being processed
        };
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
            selectedCategories: [],
            sources: [],
            source: "",
            categoryErrorText: Constants.ERRORS.BLANK_LINE,
            sourceErrorText: Constants.ERRORS.BLANK_LINE,
            showErrorUnderlines: false,
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
    handleUpdateCategory : function(event, index, value) {
        this.state.selectedCategories.push(this.state.categoriesList[value - 1])
        this.state.categoriesList.splice((value - 1), 1);
        this.setState({
            categoriesList: this.state.categoriesList,
            selectedCategories: this.state.selectedCategories,
            categoryErrorText: null,
        });
    },

    /**
     * Sets the source of the content to what the user typed
     */
    handleUpdateSource : function(event) {
        var source = event.target.value;

        this.setState({
            source: source,
        });
    },

    isValidSourceURL : function(source) {
        return source.match(Constants.URL_REG_EXP) !== null;
    },

    handleAddSource : function() {
        // Validate the content first
        if (this.isValidSourceURL(this.state.source)) {
            this.setState({
                sources: this.state.sources.concat([this.state.source]),
                source: "",
                sourceErrorText: null,
            });
        } else {
            this.setState({
                showSnackbar: true,
                snackbarMessage: "Please enter a valid URL.",
            });
        }
    },

    /**
     * Creates a new unapprovedIssue in Firebase
     */
    handleSubmit : function() {
        if (!InternetConnectivity.getCurrentConnection()) {
            // No internet connection
            this.setState({
                showSnackbar: true,
                snackbarMessage: "An internet connection is required to submit content.",
            });

            return;
        }

        if (!this.areRequiredFieldsComplete()) {
            this.setState({
                showErrorUnderlines: true,
            });

            return;
        } else {
            this.setState({
                showErrorUnderlines: false,
            });
        }

        var self = this;
        User.getUser(Cache.getCacheV(Constants.AUTH.UID), function(user) {
            Issue.initializeUnapprovedIssue(
                Constants.CONTENT_TYPES[self.state.contentType - 1],
                self.state.content,
                self.state.sources,
                self.state.candidateMap,
                user.id,
                self.state.selectedCategories,
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
        this.props.refresh();
    },

    hideSnackbar : function() {
        this.setState({
            showSnackbar: false,
        });
    },

    getErrorText : function(errorText) {
        return this.state.showErrorUnderlines ? errorText : '';
    },

    getSelectCategory : function() {
        var errorText = this.getErrorText(this.state.categoryErrorText);
        return ((this.state.categoriesList.length > 0) ? (
            <SelectField
                hintText={"Add Category"}
                onChange={this.handleUpdateCategory}
                errorText={errorText}>
                {this.state.categoriesList.map((function(c, i) {
                    return (
                        <MenuItem key={i} value={i + 1} primaryText={c} />
                    );
                }).bind(this))}
            </SelectField>
        ) : null);
    },

    getSelectedCategories : function() {
        result = []
        for (var category in this.state.selectedCategories) {
            result.push(
                <div key={category}>
                    {this.state.selectedCategories[category]}
                </div>
            );
        }
        return result;
    },

    onClickXSource : function(sourceIndex) {
        var self = this;
        return function() {
            self.state.sources.splice(sourceIndex, 1);
            self.setState({
                sources : self.state.sources,
            });
        };
    },

    getSources : function () {
        sources = []
        for (var source in this.state.sources) {
            sources.push(
                <div className="singleSource" key={source}>
                    <span onClick={this.onClickXSource(source)} className="closeXButton">X</span>
                    {this.state.sources[source]}
                </div>
            );
        }
        return (
            <div>
                {sources}
            </div>
        );
    },

    areRequiredFieldsComplete : function() {
        var sources = this.state.sources;
        if (this.state.source && this.isValidSourceURL(this.state.source)) {
            sources.push(this.state.source);

            this.setState({
                sources: sources,
                source: "",
                sourceErrorText: null,
            });
        } else if (this.state.sources.length === 0) {
            this.setState({
                showSnackbar: true,
                snackbarMessage: "Please enter a valid URL.",
            });
        }

        return (
            Boolean(this.state.content.length)
            && Boolean(Object.keys(this.state.candidateMap).length)
            && Boolean(sources.length)
            && Boolean(this.state.selectedCategories.length > 0)
            && !this.state.hasSubmitted
        );
    },

    render : function() {
        var formComponent = null;
        if (this.state.contentType === 1) {
            formComponent = <CrowdsourcingQuoteComponent
                ref="quoteComponent"
                handleCandidateMap={this.handleCandidateMap}
                handleContent={this.handleContent}
                getErrorText={this.getErrorText}
            />;
        } else if (this.state.contentType === 2) {
            formComponent = <CrowdsourcingGeneralComponent
                ref="generalComponent"
                handleCandidateMap={this.handleCandidateMap}
                handleContent={this.handleContent}
                getErrorText={this.getErrorText}
            />;
        }

        return (
            <Card className="submit-content">
                <CardText>
                    <div className="main-content">
                        <p>What is the type of content?</p>
                        <SelectField
                            value={this.state.contentType}
                            onChange={this.handleContentType}>
                            {Constants.CONTENT_TYPES.map((function(c, i) {
                                // need to start value at 1 instead of 0 for highlighting selected option
                                return (
                                    <MenuItem key={i} value={i + 1} primaryText={c} />
                                );
                            }).bind(this))}
                        </SelectField>
                        {formComponent}
                        <p>Source:</p>
                        {this.getSources()}
                        <TextField
                            value={this.state.source}
                            hintText="Link to reliable source"
                            multiLine={true}
                            onChange={this.handleUpdateSource}
                            errorText={this.getErrorText(this.state.sourceErrorText)}
                        />
                        <div>
                            <RaisedButton
                                label="Add Source"
                                onClick={this.handleAddSource}
                            />
                        </div>
                        <p>Category:</p>
                        {this.getSelectedCategories()}
                        {this.getSelectCategory()}
                        <div className="submit-button">
                            <RaisedButton
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