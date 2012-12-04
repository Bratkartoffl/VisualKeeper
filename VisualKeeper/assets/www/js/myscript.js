var photoCounter=1;
var CurrentUser;
var UserObject;
var picNum;
var datepickerinfo = new Object();


//////////////////////////////////////////
//   INITIALIZATION
//////////////////////////////////////////
function deviceReady() {
	
	//////////////////////////////////////////
	//   PARSE INIT
	//////////////////////////////////////////
	Parse.initialize("yNTwoqpiw9bABPUWs5IgvqI3DdTEWMgaOvSLoNIM", "pnoupPXYoWczbF3HMcMlwfreJaoHFDmYHGow2eA7");
	TaskObject = Parse.Object.extend("TaskObject");
	ListObject = Parse.Object.extend("ListObject");
	console.log("device is ready");


	//////////////////////////////////////////
	//   TOGGLE
	//////////////////////////////////////////
	$(function() {
		$("#emailReset").toggle(
		function() {
			$("#hiddenDiv").css({"visibility":"visible",
	 			  					      "display":"inline"});
		},
		function(){
			$("#hiddenDiv").css({"visibility":"hidden",
	 			  			       "display":"none"});
		});
	});

	
	//////////////////////////////////////////
	//   BEFORE PAGE SHOWS BINDS
	//////////////////////////////////////////
    $('#newTask').bind('pagebeforeshow',resetNewTask);
	$('#dateTimeDialog').bind('pagebeforeshow',function(){
		$('#onceOptions').show();
		$('#dailyOptions').hide();
		$('#weekOptions').hide();
		$('#datePickerAccept').bind('tap', getDateTimeInfo);
	});
	$('#register').bind('pagebeforeshow',CLEARFORM);
	$('#login').bind('pagebeforeshow',CLEARFORM);
	$('#listselect').bind('change',function(){
		pullList();
	});
	$('#home').bind('pagebeforeshow',function(){
		pullList();
	});


	//////////////////////////////////////////
	//   CLICK BINDS
	//////////////////////////////////////////
	$('#editAcceptButton').bind('click',submitEdits);
	$('#testButton').bind('click',function(){
		return populateViewTask('0Edd6s8Ugw');
	});
	$('#vEditButton').bind('click',setToEditTask);
	$('#newListAccept').bind('click',function(){
		var name = $('#listnameinput').val();
		console.log('list name: '+name);
		$("#listnameinput").val('');
		addListToParse(name,name);
		
		history.back();
		return false;
	});
	$('#new').bind('tap',function(){
		$('#newtasklink').click();
	});

	//////////////////////////////////////////
	//   SET FREQUENCY RADIO
	//////////////////////////////////////////
	$('input[name="taskfrequency"]').bind('change',function(){
		var selection = $("input[name='taskfrequency']:checked").val(),
			once = $('#onceOptions'),
			daily = $('#dailyOptions'),
			weekly = $('#weekOptions');
		if(selection == 'once'){
			once.show();
			daily.hide();
			weekly.hide();
		}
		else if(selection == 'daily'){
			once.hide();
			daily.show();
			weekly.hide();
		}
		else if(selection == 'weekly'){
			once.hide();
			daily.hide();
			weekly.show();
		}
	});

	
	$('#newTask').bind('pageinit',initNewTask);

	//////////////////////////////////////////
	//  RESET LOG STATUS
	//////////////////////////////////////////
	$("#login").live('pageshow',function(){
		$("#logstatus").html("");
	});

	//////////////////////////////////////////
	// LOAD ON PAGE INIT
	//////////////////////////////////////////
	$('#home').bind('pageinit',initHome);
	$('#addlPhotoLabel').bind('pageinit',addPhotoView);
}
function init(){
	
	console.log('init started');

	//////////////////////////////////////////
	// CHECK IF MATCH DEVICE
	//////////////////////////////////////////
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", deviceReady, false);
        console.log('on phone');
    } else {

	    //////////////////////////////////////////
	    // ELSE BROWSER
	    //////////////////////////////////////////
    	console.log('on browser');
        deviceReady();
    }
}


//////////////////////////////////////////
//  TASK STUFF - LISTVIEW
//////////////////////////////////////////
function newListViewTask(img, id, name, desc, datetime, objId) {


	//////////////////////////////////////////
	// CREATE LIST VIEW REPRESENTATION OF TASK
	//////////////////////////////////////////
	if(objId == undefined) {
		objId = 'zzzzzzz';
	}
	var html = '<li><a class ="task" data-task = "'+objId+'" href="#viewTask"><img id="';
	html += id;
	html += '" src="';
	html += img;
	html += '" style="height:auto;width:auto;border-radius:5px;">';
	html += '<h1>';
	html += name;
	html += '</h1>';
	html += '<p>';
	html += desc;
	html += '</br>';
	html += datetime;
	html += '</p>';
	html += '</a><a id="editTaskButton" data-icon="delete">Delete</a></li>';
	tasklist = $('#taskList');
	tasklist.append(html).listview('refresh');
	tasklist.trigger("create");
}
function populateViewTask(taskId){
	var query = new Parse.Query(TaskObject);
	query.equalTo('objectId',taskId);
	query.find({
		success: function(results){
			var name = results[0].attributes.taskName,
				desc = results[0].attributes.taskDesc,
				freq,
				datetime = results[0].attributes.taskTime,
				user = results[0].attributes.creator, 
				time,
				date,
				imURL;
			imURL = makeImgURL(user,taskId,1);
			freq = datetime.freq;
			if(freq == 'taskOnce'){
				freq='Once';
			}
			else if(freq=='taskDaily'){
				freq='Daily';
				$('#vTaskDate').hide();
			}
			else{
				freq='Weekly'
				$('#vTaskDate').hide();
			}

			date = datetime.date;
			time = datetime.time;
			$('#vtaskID').html(results[0].id);
			$('#vTaskPic').attr('src',imURL);
			$('#vTaskName').html(name);
			$('#vDescBox').html(desc);
			$('#vTaskFreq').html('<b>Frequency: </b>'+freq);
			$('#vTaskTime').html('<b>Time: </b>'+time);
			$('#vTaskDate').html('<b>Date: </b>'+date);

		},
		error: function(error){
			console.log('error retrieving data from server');
		}
	});
}
function clearTaskListView() {
	//////////////////////////////////////////
	// CLEAR TASK LIST VIEW
	//////////////////////////////////////////
	$('#taskList').html('');
}
function cancelNewTask(){
	resetNewTask();
	resetDateTimeDialog();
	$.mobile.changePage($('#home'));
}
function resetNewTask(){
	photoCounter=1;
	var s='';
	resetDateTimeDialog();
	$('#extraPhotos').html(s).listview('refresh');
}
function setToNewTask(){
	//$('#editTaskHeading').html('New Task');
	console.log('making new task...');
}


//////////////////////////////////////////
// TASK STUFF - LISTDROPDOWN
//////////////////////////////////////////
function addNewListToDropdown(value, name) {

	var html = '<option value="';
	html += value+'"> '+name+'</option>';
	$('#listselect').prepend(html);
	$('#listselect option[value="'+value+'"]').attr('selected', 'selected');
	$('option:selected').each(function(idx, elem){
			$(elem).removeAttr('selected');
		});
		$('#listselect option[value="'+name+'"]').attr('selected', 'selected');
	$('#listselect').selectmenu('refresh',true);
	$('#homeheader').trigger("create");
}


//////////////////////////////////////////
//	EDIT TASK
//////////////////////////////////////////
function setToEditTask(taskid){
	$('#editTaskHeading').html('Edit Task');

	var user = Parse.User.current(),
		query = new Parse.Query(TaskObject),
		tid = $('#vtaskID').html();

	query.equalTo('objectId',tid);
	query.find({
		success: function(results){
			var task = results[0],
				imgurl = makeImgURL(user,taskid,1);
			setupEdit(imgurl, task.attributes.taskName, task.attributes.taskDesc, task.attributes.taskTime, task.id);
			console.log('editing...');
		},
		error: function(){
			console.log('error getting info for edit');
		}
	});
}
function submitEdits(){
	var tid = $('#editTaskId').html(),
		query = new Parse.Query(TaskObject);

	query.get(tid,{
		success: function(task){
			var taskName = $("#enameField").val();
			var taskDesc = $("#edescArea").val();
			task.set('taskName',taskName);
			task.set('taskDesc',taskDesc);
			task.set('taskTime',datepickerinfo);
			console.log('saving: '+taskName+" "+taskDesc);
			task.save();
			console.log('saved');
			$.mobile.changePage('#home');
		},
		error: function(){
			console.log('error setting up edit submission')
		}
	});
}


//////////////////////////////////////////
//	SCHEDULE SUMMARY
//////////////////////////////////////////
function populateScheduleSummary(weekTasks){
	var html="", i;
	for(i=0;i<weekTasks.length;i++){
		html += "<li><a href='#viewTask'><h1>";
		html += weekTasks[i].tName + ' id: '+weekTasks[i].tId;
		html += "</h1></a></li>";
	}
}


//////////////////////////////////////////
// DATE/TIME
//////////////////////////////////////////
function resetDateTimeDialog(){
	$('.dialoginput').each(function(idx, elem){
		var cur = $(elem);
		if(cur.attr('checked')=='checked' && cur.attr(''))
			cur.removeAttr('checked');
		if(cur.attr('type')=='date' || cur.attr('type') =='time')
			cur.val('');
	});
}
function setupDateTime(datetime){

	if(datetime.freq=='taskOnce'){
		console.log(datetime.time);
		$('#oDate').val(datetime.date);
		$('#oTime').val(datetime.time);
	}
	else if(datetime.freq=='taskDaily'){
		$('#dTime').val(datetime.time);
	}
	else if(dateObj.freq=='taskWeekly'){
		var i=0;
		$('#wTime').val(datetime.time);
		while(datetime['day'+i]){
			$('input.daycheck[id="'+datetime['day'+i]+'"]').attr('checked','checked');
			i++;
		}
	}
}
function getDateTimeInfo(){
	var freq = $('input.dtfreq:checked').attr('id');
		console.log(freq);
		datepickerinfo.freq = freq;
		if(freq=='taskOnce'){
			datepickerinfo.date = $('#oDate').val();
			datepickerinfo.time = $('#oTime').val();
		}
		else if(freq=='taskDaily'){
			datepickerinfo.time = $('#dTime').val();
		}
		else if(freq=='taskWeekly'){
			datepickerinfo.time = $('#wTime').val();
			datepickerinfo.days = new Array('no','no','no','no','no','no','no','no');
			$('input.daycheck:checked').each(function(idx, elem){
				datepickerinfo.day[idx]=$(elem).attr('id');
			});
		}
	//return datepickerinfo;
}


//////////////////////////////////////////
// PARSE STUFF - HOME
//////////////////////////////////////////
function initHome(){
	console.log('initing home');
	loadLists();
	//loadfromParse();
	//pullList();
	addNewListToDropdown('default','Default List');
	$('#listselect option[value="default"]').attr('selected', 'selected');
	$('#listselect').selectmenu();
}
function loadHome() {setTimeout( function(){ window.location = "#home"; }, 1000 );}

function loadLists(){
	var listObject = new ListObject(),
		query = new Parse.Query(ListObject),
		user = Parse.User.current();

	query.equalTo('user',user.id);
	query.find({
		success: function(lists){
			console.log('lists found: '+lists.length);
			for(var i=0;i<lists.length;i++){
				var list = lists[i];
				addNewListToDropdown(list.attributes.name,list.attributes.value);
			}
			
		},
		error: function(list, error){
			console.log('error finding lists');
		}
	});
}
function pullList(){
	var list = $('#listselect > option:selected').val(),
		user = Parse.User.current(),
		query = new Parse.Query(TaskObject);
	clearTaskListView();
	query.equalTo('creator',user);
	query.equalTo('listName',list);
	query.find({
		success: function(tasks){
			for(var i=0;i<tasks.length;i++){
				var task = tasks[i];
				console.log('task: '+task.id);
				var imgsrc = makeImgURL(user,task.id,1),
					dtime = task.attributes.taskTime;
				newListViewTask(imgsrc, task.id,task.attributes.taskName,task.attributes.taskDesc,dtime.time+" on "+dtime.date,task.id);
			}
			$('.task').each(function(idx, elem){
				$(elem).bind('click',function(){
					var taskid = $(elem).data('task');
					populateViewTask(taskid);
				});
			});
		},
		error: function(tasks, err){
			console.log('error pulling list');
		}
	});
}


//////////////////////////////////////////
// PARSE STUFF - USER
//////////////////////////////////////////
function register(){
	$("#regstatus").html("").removeClass("errorDiv");

	//get values
    var username = $("#username").val();
    var password = $("#password").val();
    var email = $("#email").val();

    //do some basic validation here

    if(username === "") {
    	$("#usernameerror").css("color","red");
    	$("#usernameerror").css("visibility","visible");
    }else
    	$("#usernameerror").css("visibility","hidden");

    if(password === "") {
    	$("#passworderror").css("color","red");
    	$("#passworderror").css("visibility","visible");
    }else
    	$("#passworderror").css("visibility","hidden");

    if(email === "") {
    	$("#emailerror").css("color","red");
    	$("#emailerror").css("visibility","visible");

	} else
		$("#emailerror").css("visibility","hidden");
    
    //try to register with Parse and see if it works.
    var user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);


    user.signUp(null, {
        success:function(user) {
            CurrentUser = user;
            alert("Successful Registration!!");
            $.get("http://www.abeltsanchez.com/services/makeNewUser.php?id="+CurrentUser.id);
        	
            $.mobile.changePage("./index.html#login");

        },
        error:function(user, error) {
            console.log("ERROR!");
            console.dir(error);
        }
    });
}
function logOut() {
	console.log("Logout");
	Parse.User.logOut();
	CurrentUser="";
	UserObject="";
	 $.mobile.changePage("#login");
}
function login(){

    //////////////////////////////////////////
    // GET VALS
    //////////////////////////////////////////
    var username = $("#usernamelogin").val();
    var password = $("#passwordlogin").val();

    //////////////////////////////////////////
    //  BASIC VALIDATION
    //////////////////////////////////////////
    if(username === ""){
    	$("#loginuser").css({"color":"red",
    		                 "visibility":"visible"});
    } else
		$("#loginuser").css("visibility","hidden");

    if(password === ""){
    	$("#loginpass").css({"color":"red",
    						 "visibility":"visible",});
    } else
    	$("#loginpass").css("visibility","hidden");

	//////////////////////////////////////////
    //  LOGIN
    //////////////////////////////////////////
    Parse.User.logIn(username, password, {
        success:function(user) {
            CurrentUser = user;
            $("#logstatus").css({"color":"green",
        						 "text-align":"center"});
            $("#logstatus").html("<b>Logging in...</b>");
            $("#loggedIn").html("Tasks for "+CurrentUser.get("username"));
            loadHome();
        },
        error:function(user, error) {
        	$("#logstatus").css({"color":"red",
        						 "text-align":"center"});
        	$("#logstatus").html("<p><b>Unsuccessful Login!</b>\nPlease retry or register</p>").fadeIn().show("slow");
            console.log("ERROR!");    
            $.mobile.changePage("#login");
        }
    });
}
function CLEARFORM(){
	$('.preloginput').each(function(idx, elem){
		$(elem).val('');
	});
}
function loadfromParse() {

	var UserObject = Parse.User.current(),
		imgsrc = $('#taskPic').attr('src');

	var query = new Parse.Query(TaskObject);
	var userid = UserObject.id;
	var dtime;
	query.equalTo('creator',UserObject);
	query.find({
	 	success:function(results){
			console.log('num results: '+results.length);
	 		for(var i=0,len=results.length; i<len; i++){
	 			var result=results[i];
	 		  	dtime = result.attributes.taskTime;
	 		  	if(result.attributes.listName == 'default'){
	 		  		newListViewTask(imgsrc,result.id,result.attributes.taskName,result.attributes.taskDesc,dtime.time+" on "+dtime.date, result.id);
	 		  	}
	 		  	else if(result.attributes.listName!=undefined){
	 		  	}
	 		}
	 	},
	 	error: function(error){
	 		console.log("Error: "+error.code+" "+error.message)
	 	}
	 });
}
function addListToParse(value, name){
	var list = new ListObject();
	var UserObject = Parse.User.current();
	var query = new Parse.Query(ListObject);
	query.equalTo('name',name);
	query.find({
		success: function(results){
			if(results.length>0){
				alert('That list already exists');
			}
			else{
				list.save({
					value:value,
					name:name,
					user:UserObject.id
				}, {
					success: function(listobj){
						console.log('success');
						addNewListToDropdown(value,name);
					},
					error: function(listobj, error){
						console.log('error on saving list: '+error.code);
					}
				});
			}

		},
		error: function(){
			console.log('error finding lists');

		}
	});
}
function initNewTask(){
	picNum = 0;
	$('#cancelButton').bind('tap',cancelNewTask);
	$('#acceptButton').bind('tap',acceptNewTask);
	setToNewTask();
	console.log('init in new task');
}
function acceptNewTask(){

	var taskName = $("#nameField").val();
	var taskDesc = $("#descArea").val();
	if(taskName ===""){

	}

	$.mobile.changePage($('#home'));
	var dateObj = datepickerinfo,// = getDateTimeInfo(),
		datetime,
		freq;
	var imgsrc = $('#taskPic').attr('src');
	if (taskName === "")
		newListViewTask(imgsrc,'example1','Example Task', 'An example task...', '10/19/12 6:30pm', 'zzzzzzz');
	else{
		if(dateObj.freq=='taskOnce'){
			datetime = dateObj.date + " at " + dateObj.time;
			freq= 'Once';
		}
		else if(dateObj.freq=='taskDaily'){
			datetime = dateObj.time;
			freq = 'Daily';
		}
		else if(dateObj.freq=='taskWeekly'){
			datetime = {days:dateObj.days, time: dateObj.time};
			freq = 'Weekly';
		}
		if(typeof(datetime)=='Object'){
			newListViewTask(imgsrc,'img', taskName,taskDesc, datetime.time, freq);	
		}
		else{
			newListViewTask(imgsrc,'img', taskName,taskDesc, datetime, freq);	
		}
		console.log("Here is "+picNum);
		var listname = $('#listselect > option:selected').attr('value');
		console.log(listname);
		var taskObject = new TaskObject();
		taskObject.save({
			taskName:taskName,
			taskDesc:taskDesc,
			taskTime:dateObj,
			creator:CurrentUser,
			picCounter:picNum,
			listName:listname
		},{
			success: function(tO){
				console.log('success! id: '+ tO.id);
				uploadPhoto(imgsrc,CurrentUser.id,tO.id,1);
		 	},
		 	error: function(tO, error){
		 		console.log('error saving');
		 	}
		});
		
		resetDateTimeDialog();
	}	
}
function sendRes(){
    var email = $("#passwordResetEmail").val();

    if(email === "") {
    	return;
	}
    Parse.User.requestPasswordReset(email, {
        success:function() {
            alert("Reset instructions emailed to you.");
        },
        error:function(error) {
            alert(error.message);
        }
    });
}


//////////////////////////////////////////
// PIC STUFF
//////////////////////////////////////////
function uploadPhoto(imageURI, id, tid, pid){
	var options = new FileUploadOptions(),
		params = new Object();
	options.fileKey="file";
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType="image/jpeg";
	console.log(options.fileName);
	
	params.uid = id;
    
 
    params.taskid=tid;

    params.photoid=pid;
    
    options.params=params;
    options.chunkedMode = false;

    var ft = new FileTransfer();
    ft.upload(imageURI, "http://www.abeltsanchez.com/services/upload.php?uid="+id+"&tid="+tid+"&pid="+pid, function(){console.log('success');}, function(err){console.log('failure error code: '+err.code);}, options);
}
function addPhotoSpace(){
	picNum++;
	var list = $('#extraPhotos'),
		fieldName = "nameField"+photoCounter,
		fieldDesc = "descField"+photoCounter,
		photoDesc = "descPhoto"+photoCounter,
		photoName = "namePhoto"+photoCounter,
		photoId = "exPhoto"+photoCounter,
		html = '<li data-role="fieldcontain" data-theme="a">';
	html += '<label for="'+fieldName+'">Photo Name</label>';
	html += '<input type="text" name="'+photoName+'" id="'+fieldName+'" />';
	html += '<label for="'+fieldDesc+'">Photo Desc.</label>';
	html += '<input type="text" name="'+photoDesc+'" id="'+fieldDesc+'" /><img id="' + photoId + '" src="camera.jpg" style="border-radius:5px; margin-left:8px; margin-top:7px;"></li>';
	
	list.append(html).listview("refresh");
	$('#newTaskContent').trigger("create");
	$('#'+photoId).bind('tap', captureAdditionalPhoto);
	photoCounter++;
}
function addPhotoView(){
	var photonum =1;
	var html = '<li data-theme="a">',
		list = $('#addlPhotos')
		fieldName = "nameField"+photonum,
		fieldDesc = "descField"+photonum,
		photoDesc = "descPhoto"+photonum,
		photoName = "namePhoto"+photonum,
		photoId = "exPhoto"+photonum;
	html += '<h4>Photo Name</h4>';
	html += '<div data-role="fieldcontain">';
	html += '<label for="'+fieldDesc+'">Photo Description</label>';
	html += '<textarea id="'+fieldDesc+'" disabled="disabled">Some text...</textarea>';
	html += '</div>';
	html += '<img id="'+photoId+'" src="camera.jpg" style="border-radius:5px; margin-left:8px; margin-top:7px;"></li>';

	list.append(html).listview('refresh');
	$('#viewTaskContent').trigger("create");
	console.log('photo view added');
}
function capturePhoto(){
	console.log(picNum);
	navigator.camera.getPicture(showPhoto,photoFail,{
												destinationType : Camera.DestinationType.FILE_URI, 
 												sourceType : Camera.PictureSourceType.CAMERA, 
  												allowEdit : true,
  												encodingType: Camera.EncodingType.JPEG,
  												quality:30});
}
function showPhoto(data){
	picNum++;
	var pic = $('#taskPic');
	pic.attr('src', data);
}
function photoFail() {
	if(picNum <= 1){
		picNum = 0;
	}else{
		picNum--; 
	}
}
function captureAdditionalPhoto(e){
	var im=$(e.target);
	navigator.camera.getPicture(generateSuccess(im),null,{sourceType:1,quality:60});
}
function generateSuccess(image){
	return function(data){
		image.attr('src',data);
	}
}
function makeImgURL(user,taskid,photoid){
	var server = 'http://abeltsanchez.com/user_images/',
		folderName = user.id+'/',
		imageName = taskid+photoid+'.jpg',
		imageURL;

		imageURL = server+folderName+imageName;
		console.log('image is: '+imageURL);
		return imageURL;
}
function addPhoto(data){
	$('#exPhoto1').attr('src',data);
	$('#extraPhotos').listview('refresh');
}
function setupEdit(imgURL, name, desc, datetime, tid){
	$('#etaskPic').attr('src',imgURL);
	$('#enameField').val(name);
	$('#edescArea').val(desc);
	console.log(tid);
	$('#editTaskId').html(tid);
	console.log('about to set up date time');
	setupDateTime(datetime);
}
