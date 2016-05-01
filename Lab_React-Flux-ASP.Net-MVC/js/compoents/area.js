var React = require("react");
var MapTable = require("./table");
var MapStore = require("../stores/MapStore");
var MapAction = require("../actions/MapAction");

var DescriptionArea = React.createClass({
	render: function() {
        return (
           <h1>Choose the import type and provider setting with the target file(upload)
           </h1>
        );
	}
});

var DisplayArea = React.createClass({
	render: function() {
		return (
		   <MapTable items={this.props.items}/>
		);
	}
});

var ActionArea = React.createClass({
	render: function() {
		return (
		  	//<button onClick={MapAction.handleMapping}>Map</button>
		  	<div>
		  		<button onClick={MapAction.handleAddRow}>Add-Row</button>
		  		<button onClick={MapAction.handleDeleteRow}>Delete-Row</button>
		  	</div>
		);
	}
});

var ResultArea = React.createClass({
	render: function() {
    	var style = {
       		color: 'orange'
		};

		return (
		  	//<div id="Message" style={{color: 'orange'}}></div>
		  	<div id='display' style={style}></div>
		);
	}
});

var ProviderMapArea = React.createClass({

	changeHandler: function(){
		this.setState({items: MapStore.getMapItems()});
	},
  	
  	getInitialState: function() {
  		return {items: MapStore.getMapItems()};
  	},
  
    componentDidMount: function() {
        MapAction.showMessage("Please wait, >>>>>> loading data...");
        MapStore.addChangeListener(this.changeHandler);  
        MapAction.createStore();    	
    },

    componentWillUnmount: function(){
		MapStore.removeChangerListener(this.changeHandler);
	},

	//showMessage: function(information) {
    //    React.findDOMNode(this.refs.message).innerHTML = information;
	//},

	render: function() {
		return (
			<div>
		 		<DescriptionArea />
		 		<br />
		 		<DisplayArea items={this.state.items} />
		 		<br />
				<ActionArea />
				<br /><br /><br /><br />
				<ResultArea />
			</div>
		);
	}
});

module.exports = ProviderMapArea;			