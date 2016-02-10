var React = require('react');
var Constants = require('../Constants');

/**
 * Component to select a stance on a five point scale.
 *
 * @author sonjakhan
 */
var StanceSelector = React.createClass({

    /**
     * value: the current value of the selector, set to props.value if given
     */
    getInitialState : function() {
        return {
            value: this.props.value,
        };
    },

    /**
     * Creates an array of classnames for each stance
     */
    componentWillMount : function() {
        this.stanceClasses = Constants.STANCES.map((function(c, i) {
            return c.replace(/\s+/g, '-').toLowerCase();
        }).bind(this));
    },

    /**
     * Calls the given callback with the value the user selected
     */
    handleUpdate(value, event) {
        this.props.handleUpdateSlider(this.props.candidate, value);
        this.setState({
            value: value,
        });
    },

    /**
     * Returns the button components in the selector
     */
    getButtons : function() {
        result = [];
        for (var i = 0; i < this.stanceClasses.length; i++) {
            var classes = "btn";
            classes += " " + this.stanceClasses[i];
            if (this.state.value == i) {
                classes += " selected";
            }
            result.push(
                <label 
                    htmlFor="options" 
                    className={classes} 
                    onClick={this.handleUpdate.bind(this, i)} 
                    key={i}>
                    <input type="radio" name="options" autoComplete="off" />
                </label>
            );
        }
        return result;
    },

    render : function() {
        return (
            <div className="btn-group">
                {this.getButtons()}
                <div className="text-container">
                    <span className="disagree-text">Disagree</span>
                    <span className="agree-text">Agree</span>
                </div>
            </div>
        );
    }
});

module.exports = StanceSelector;