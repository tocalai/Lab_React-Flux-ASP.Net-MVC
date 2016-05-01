var React = require("react");
var DropDown = require("./dropdown");
var DropZone = require("./dropzone");
var MapAction = require("../actions/MapAction");
var MapStore = require("../stores/MapStore");

var MapRow = React.createClass({
    
	render: function() {
		return (
			<tr>
			   <td><DropDown list={this.props.item.ImportList} selected={this.props.item.ImportList[0]} listId={MapStore.getImportListId()} rowIdx={this.props.item.RowIdx} onSelected={MapAction.onSelected}/></td>
			   <td><DropDown list={this.props.item.ProviderList} selected={this.props.item.ProviderList[0]} listId={MapStore.getProviderListId()} rowIdx={this.props.item.RowIdx} onSelected={MapAction.onSelected}/></td>
	           <td><DropDown list={this.props.item.ProviderSportTypeList} selected={this.props.item.ProviderSportTypeList[0]} listId={MapStore.getProviderSportTypeListId()} rowIdx={this.props.item.RowIdx} onSelected={MapAction.onSelected}/></td>			   
	  	       <td>{this.props.item.UploadFilePath}</td>
	  	       <td>				
	  	       		<DropZone onDrop={MapAction.onAddFile} index={this.props.item.RowIdx}>
				   		<p><u>{this.props.item.UploadStatus}</u></p>
					</DropZone>
				</td>
         	</tr>
		);
	}
});

var MapTable = React.createClass({
	render: function() {
		var rows = [];
        this.props.items.forEach(function(item) {
           	rows.push(<MapRow item={item}/>)
        });
		return (
      		<table>
        		<thead>
          			<tr>
            			<th>Import Type</th>
            			<th>Provider Name</th>
            			<th>Provider Sport Type</th>            			
            			<th>File Name</th>
            			<th>Action</th>
          			</tr>
        		</thead>
        		<tbody>{rows}</tbody>
      		</table>
    	);
	}
});

module.exports = MapTable;	