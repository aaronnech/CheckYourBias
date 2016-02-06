var React = require('react');
var Constants = require('../Constants');

var Slider = require('material-ui/lib/slider');

var CrowdsourcingCandidateStanceComponent = React.createClass({

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