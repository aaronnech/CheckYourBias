var React = require('react');
var Constants = require('../Constants');

var Slider = require('./SliderComponent.jsx');

/**
 * Component that groups a candidate and a stance slider
 *
 * @author sonjakhan
 */
var CrowdsourcingCandidateStanceComponent = React.createClass({

    /**
     * Calls the given callback with the value the user updated the slider to
     */
    handleUpdateSlider(event, value) {
        this.props.handleUpdateSlider(this.props.candidate, value);
    },

    render : function() {
        return (
            <div>
                <p>{this.props.candidate}</p>
                <Slider min={1} max={5} defaultValue={3} />
            </div>
        );
    }
});

module.exports = CrowdsourcingCandidateStanceComponent;