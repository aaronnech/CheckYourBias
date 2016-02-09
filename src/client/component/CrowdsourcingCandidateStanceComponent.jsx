var React = require('react');
var Constants = require('../Constants');

var Slider = require('material-ui/lib/slider');

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
                <Slider 
                    className="slider" 
                    candidate={this.props.candidate} 
                    value={this.props.value} 
                    onChange={this.handleUpdateSlider}
                />
            </div>
        );
    }
});

module.exports = CrowdsourcingCandidateStanceComponent;