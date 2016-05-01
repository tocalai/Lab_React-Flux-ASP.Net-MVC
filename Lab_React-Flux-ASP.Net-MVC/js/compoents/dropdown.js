var React = require("react");

var MapStore = require("../stores/MapStore");

var Dropdown = React.createClass({
				getInitialState: function() {
					return {
						listVisible: false,
						display: "",
						//selectedIdx: 0
					};
				},
				
				select: function(item, index) {
					var self = this;
					this.props.selected = item;
					//this.setState({selectedIdx: index});
					if(this.props.onSelected){
						this.props.onSelected(item, this.props.rowIdx, index, this.props.listId);
					}
				},
				
				show: function() {
					this.setState({ listVisible: true });
					document.addEventListener("click", this.hide);
				},
				
				hide: function() {
					this.setState({ listVisible: false });
					document.removeEventListener("click", this.hide);
				},

				//getSelectedIndex: function() {
				//	return this.state.selectedIdx;
				//},
			
				render: function() {
					return <div className={"dropdown-container" + (this.state.listVisible ? " show" : "")}>
						<div className={"dropdown-display" + (this.state.listVisible ? " clicked": "")} onClick={this.show}>
							<span id={this.props.selected.key}>{this.props.selected.Name}</span>
							<i className="fa fa-angle-down"></i>
						</div>
						<div className="dropdown-list">
							<div>
								{this.renderListItems()}
							</div>
						</div>
					</div>;
				},
				
				renderListItems: function() {
					var items = [];
					for (var i = 0; i < this.props.list.length; i++) {
						var item = this.props.list[i];
						items.push(<div onClick={this.select.bind(null, item, i)}>
							<span id={item.key}>{item.Name}</span>
							<i className="fa fa-check"></i>
						</div>);
					}
					return items;
				}
			});

module.exports = Dropdown;			