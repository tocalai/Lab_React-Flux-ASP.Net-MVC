var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var request = require('superagent-bluebird-promise');
var Promise = require('bluebird');

var GETDATA_URL = 'getmapdata';
var UPLOADFILE_URL = 'upload';
var CHANGE_EVENT = 'change';

// SelectedImportTypeIdx
//RowIdx
var tmeplate = '{"RowIdx":0,"ImportList":[{"Name":"Competition","key":0},{"Name":"Participant","key":1}],"SelectedImportTypeIdx":0,"ProviderList":[{"ProviderID":11,"Name":"SportingSolutions","IsAllowLeagueSportTypeEditing":true,"IsSource":false,"TimeZoneAdjustment":-4,"IsOptionalExcludeMatchCreation":false,"IsUseTinyGet":false,"IsLogImportRawData":false,"ServicePingHostName":null,"ServicePingPort":null,"ServicePingUri":null,"key":11},{"ProviderID":10,"Name":"BetBrain","IsAllowLeagueSportTypeEditing":true,"IsSource":false,"TimeZoneAdjustment":-4,"IsOptionalExcludeMatchCreation":false,"IsUseTinyGet":false,"IsLogImportRawData":false,"ServicePingHostName":null,"ServicePingPort":null,"ServicePingUri":null,"key":10},{"ProviderID":8,"Name":"TXOdds","IsAllowLeagueSportTypeEditing":true,"IsSource":false,"TimeZoneAdjustment":-4,"IsOptionalExcludeMatchCreation":false,"IsUseTinyGet":false,"IsLogImportRawData":false,"ServicePingHostName":null,"ServicePingPort":null,"ServicePingUri":null,"key":8},{"ProviderID":5,"Name":"RBall","IsAllowLeagueSportTypeEditing":false,"IsSource":false,"TimeZoneAdjustment":-4,"IsOptionalExcludeMatchCreation":false,"IsUseTinyGet":false,"IsLogImportRawData":false,"ServicePingHostName":null,"ServicePingPort":null,"ServicePingUri":null,"key":5},{"ProviderID":4,"Name":"RTS","IsAllowLeagueSportTypeEditing":false,"IsSource":false,"TimeZoneAdjustment":-5,"IsOptionalExcludeMatchCreation":false,"IsUseTinyGet":false,"IsLogImportRawData":false,"ServicePingHostName":null,"ServicePingPort":null,"ServicePingUri":null,"key":4},{"ProviderID":3,"Name":"SoccerWay","IsAllowLeagueSportTypeEditing":false,"IsSource":false,"TimeZoneAdjustment":-12,"IsOptionalExcludeMatchCreation":false,"IsUseTinyGet":false,"IsLogImportRawData":false,"ServicePingHostName":null,"ServicePingPort":null,"ServicePingUri":null,"key":3},{"ProviderID":2,"Name":"SPBO","IsAllowLeagueSportTypeEditing":true,"IsSource":false,"TimeZoneAdjustment":-12,"IsOptionalExcludeMatchCreation":false,"IsUseTinyGet":false,"IsLogImportRawData":false,"ServicePingHostName":null,"ServicePingPort":null,"ServicePingUri":null,"key":2}],"SelectedProviderIdx":0,"ProviderSportTypeList":[{"ProviderSportTypeId":227,"ProvderId":11,"Name":"Cricket(Limited)","ECSportTypeId":17,"IsDefault":false,"IsExclude":false,"key":227,"ImportId":"Cricket"},{"ProviderSportTypeId":228,"ProvderId":11,"Name":"Cricket(FirstClass)","ECSportTypeId":17,"IsDefault":false,"IsExclude":false,"key":228,"ImportId":"TestCricket"},{"ProviderSportTypeId":229,"ProvderId":11,"Name":"RugbyLeague","ECSportTypeId":12,"IsDefault":false,"IsExclude":false,"key":229,"ImportId":"RugbyLeague"},{"ProviderSportTypeId":230,"ProvderId":11,"Name":"RugbyUnion","ECSportTypeId":12,"IsDefault":false,"IsExclude":false,"key":230,"ImportId":"RugbyUnion"},{"ProviderSportTypeId":231,"ProvderId":11,"Name":"Darts","ECSportTypeId":21,"IsDefault":false,"IsExclude":false,"key":231,"ImportId":"Darts"}],"SelectedProviderSportTypeIdx":0,"UploadFilePath":"","UploadStatus":"Upload File"}';

var targetFiles = [];
var mapTable = [];
var datas = [];

function copyData(src, dest) {
	src.forEach(function(target){
        dest.push(target);
	});
}

function getMapDataFromLocal() {
   //datas = JSON.parse(tmeplate);
   mapTable.push(JSON.parse(tmeplate));
   console.log("Get map data: " ,mapTable);
   //filterSportType(11, 0);
   $('#display').html("");

   MapStore.emitChange();
};


function getMapData() {
    $.ajax({
      	url: GETDATA_URL,
      	type: 'POST',
      	dataType: 'json',
      	success: function(src) {      		       	
        	datas = src.slice(0);
        	console.log("Get map data: " ,datas);
            //clone datas to map table array
            mapTable = JSON.parse(JSON.stringify(datas));
        	// filter the sport type list according the provider Id
			filterSportType(datas[0].ProviderList[0].ProviderID, 0);
			// bad practice
			 $('#display').html("");
      	}.bind(this),
      	error: function(xhr, status, err) {
        	console.error(GETDATA_URL, status, err.toString());
      	}.bind(this)
    });	
};

function filterSportType(providerId, rowIdx) {
   console.log("Provider Id: " ,providerId);
   var targetSportTypeList = datas[rowIdx].ProviderSportTypeList.filter(function(element) {return (element.ProvderId === providerId)});

   // rest the porvider sport type list
   mapTable[rowIdx].ProviderSportTypeList = [];
   mapTable[rowIdx].ProviderSportTypeList = targetSportTypeList.slice(0);
   mapTable[rowIdx].SelectedProviderSportTypeIdx = 0;
   console.log("Maptable: " ,mapTable);

   MapStore.emitChange();
};


function uploadFile(files) {
		var targets = files;
      	//var csrf = this.getStore(ApplicationStore).token;
      	var url = UPLOADFILE_URL;
      	console.log(url);
      	var requests = [];
      	var promise;
      	var self = this;
      	_.each(targets, function(target){

        if(!target.name || target.name.length == 0) return;

        promise = request
          .post(url)
          .field('name', target.name)
          .field('altText', target.altText)
          .field('caption', target.caption)
          .field('size', target.size)
          //.attach('image', target.file, target.file.name)
          .attach('file', target.file, target.file.name)
          .set('Accept', 'application/json')
          //.set('x-csrf-token', csrf)
          .on('progress', function(e) {
            console.log('Percentage done: ', e.percent);
            mapTable[target.index].UploadStatus = "Uploading..." + e.percent + "%";
            MapStore.emitChange();
          })
          .promise()
          .then(function(res){
            if(res.statusCode === 200) {
            	// upload complete
          		mapTable[target.index].UploadStatus = "Upload completed";
          		MapStore.emitChange();
            }
            console.log("Then res: ", res);
          })
          .catch(function(err){
          	console.log("target.index: ", target.index);
          	mapTable[target.index].UploadStatus = "Upload failed";
          	mapTable[target.index].UploadFilePath = "";
          	MapStore.emitChange();
          	console.log("Upload error: ", err);
          });
        requests.push(promise);
      });

      Promise
        .all(requests)
        .then(function(){
          console.log('all done');

        })
        .catch(function(e){
          console.log('done with errors:', e);
        });
};

function changeSelectTarget(info) {
  console.log("changeSelectTarget");
	switch(info.listId) {
		case MapStore.getImportListId():
		    mapTable[info.rowIdx].SelectedImportTypeIdx = info.selectedIdx;
			break;
		case MapStore.getProviderListId():
			   mapTable[info.rowIdx].SelectedProviderIdx = info.selectedIdx;
			// provider sport type list changed according the selected prvoider
            filterSportType(info.item.ProviderID, info.rowIdx);
		    break;
		case MapStore.getProviderSportTypeListId():
		    mapTable[info.rowIdx].SelectedProviderSportTypeIdx = info.selectedIdx;
		    break;    

	}
};

var MapStore = assign({},EventEmitter.prototype,{

	getMapItems: function(){
    console.log("Return map items: " ,mapTable);
		return mapTable;
	},

	emitChange: function(){
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback){
		this.on(CHANGE_EVENT,callback);
	},

	removeChangeListener: function(callback){
		this.removeListener(CHANGE_EVENT,callback);
	},

	getImportListId: function() {
       return 'ImportType';
	},

	getProviderListId: function() {
       return 'Provider';
	},

  getProviderSportTypeListId: function() {
       return 'ProviderSportType';
	},

  addRow: function() {
    console.log("addRow");
     var newRow = JSON.parse(tmeplate);
     mapTable.push(newRow);
     MapStore.emitChange();
  },

  deleteRow: function() {
     var message = "";
     var rowCnt = mapTable.length;
     if(rowCnt > 1) {
        mapTable.splice(rowCnt-1, 1);    
     }
     else {
        message = "Can not delete row, we should keep at least on row.";
     }

     MapStore.emitChange();

     return message;

  },

});

// constants
//const PROCSS_URL = 'process';
//const IMPORTTYPELISTID = 'ImportType';
//const PROIVDERLISTID = 'Provider';
//const PROVIDERSPORTTYPELIDTID = 'ProviderSportType';


AppDispatcher.register(function(action){
	switch(action.actionType){
		case "CreateStore":
          //getMapData();
          getMapDataFromLocal();
          MapStore.emitChange();
		    break;
		case "AddFile":
		    targetFiles.push(action.newFile);
		    console.log("File name: ", action.newFile.name);
		    // upload to server
		    uploadFile(targetFiles);
		    targetFiles = [];
		    //console.log("File index: ", action.newFile.index);		    
		    mapTable[action.newFile.index].UploadFilePath = action.newFile.name;
			MapStore.emitChange();
		    break;
		case "NewRow":
			break;
		case "SelectList":
			changeSelectTarget(action.info);
		    break;
		default:
	}
});

module.exports = MapStore;