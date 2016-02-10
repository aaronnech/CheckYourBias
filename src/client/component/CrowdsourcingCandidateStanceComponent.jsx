var React = require('react');
var Constants = require('../Constants');

var Slider = require('material-ui/lib/slider');
var StanceSelector = require('./StanceSelector.jsx');

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
                <p className="candidateLabel">{this.props.candidate}</p>
                <StanceSelector 
                    candidate={this.props.candidate} 
                    handleUpdateSlider={this.handleUpdateSlider} 
                    value={this.props.value}
                />
            </div>
        );
    }
});

module.exports = CrowdsourcingCandidateStanceComponent;