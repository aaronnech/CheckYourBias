var React = require('react');
var Constants = require('../Constants');


/**
 * Component to select a stance on a five point scale.
 *
 * @author sonjakhan
 */
var StanceSelector = React.createClass({

    getInitialState : function() {
        return {
            value: this.props.value,
        };
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
        for (var i = -2; i < 3; i++) {
            var classes = "btn";
            if (i < 0) {
                classes += " disagree";
            } else if (i > 0) {
                classes += " agree";
            } else {
                classes += " neutral";
            }
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
            </div>
        );
    }
});

module.exports = StanceSelector;