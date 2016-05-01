var AppDispatcher = require("../dispatcher/AppDispatcher");
var UUID = require('uuid');
var request = require('superagent-bluebird-promise');
var Promise = require('bluebird');
//var React = require("react");

var MapStore = require("../stores/MapStore");

function checkUploadFiles(store) {
	this.isValid = store.every(function(item) {		
		return item.UploadFilePath.trim().length > 0;
	});

	return this.isValid ;
};


var MapAction = {
    createStore: function() {
        AppDispatcher.dispatch({
			actionType: "CreateStore"
		});
    },

    showMessage: function(message) {
        $('#display').html(message);
    },

    onAddFile: function(res){

    	console.log("add file: ", res);
      	var newFile = {
      		id: UUID.v4(),
      		name:res.file.name,
      		size: res.file.size,
      		altText:'',
      		caption: '',
      		file:res.file,
      		//url:res.imageUrl,
      		index: res.index
    	};

    	console.log("Index: ", newFile.index);

      	AppDispatcher.dispatch({
			actionType: "AddFile",
			newFile: newFile
		});
	},

	onSelected: function(item, rowIdx, selectedIdx, listId) {

        console.log("on selected-item: ", item);
        console.log("on selected-rowIx: ", rowIdx);
        console.log("on selected-selectedIdx: ", selectedIdx);
        console.log("on selected-listId: ", listId);
        var info = {
			item: item,
			rowIdx: rowIdx,
			selectedIdx: selectedIdx,
			listId: listId
        };

		AppDispatcher.dispatch({
			actionType: "SelectList",
			info: info
		});
	},

	handleMapping: function() {
		MapAction.showMessage("");
		var store = MapStore.getMapItems();
		// check file upload path should not empty: maybe upload occurred error
		var valid = checkUploadFiles(store);
		console.log("IsValid: ", valid);
		if(!valid) {
			MapAction.showMessage("Target file(s) should upload indavance for further mapping process!!");
			return;
		}

		MapAction.showMessage("Please wait, >>>>>>>In processing...");

		$.ajax({
      		url: 'process',
      		type: 'POST',
      		data: JSON.stringify(store),
      		contentType: "application/json", 
      		dataType: 'html',
      		success: function(res) {      		       	
				MapAction.showMessage(res);
      		},
      		error: function(xhr, status, err) {
        		console.error('Mapping failed', status, err.toString());
      		}
    	});	
	},

  handleAddRow: function() {
     MapAction.showMessage("");
     MapStore.addRow();
  },

  handleDeleteRow: function() {
     MapAction.showMessage("");
     var message = MapStore.deleteRow();
     MapAction.showMessage(message);
  },

};



module.exports = MapAction;