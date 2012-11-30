var photoCounter=1;
var CurrentUser;
var UserObject;
var picNum;
var datepickerinfo = new Object();

//   INITIALIZATION -------------------
function deviceReady() {
	Parse.initialize("yNTwoqpiw9bABPUWs5IgvqI3DdTEWMgaOvSLoNIM", "pnoupPXYoWczbF3HMcMlwfreJaoHFDmYHGow2eA7");
	TaskObject = Parse.Object.extend("TaskObject");
	console.log("device is ready");
    //loadfromParse();
    $('#newTask').bind('pagebeforeshow',resetNewTask);
	$('#dateTimeDialog').bind('pagebeforeshow',function(){
		$('#onceOptions').show();
		$('#dailyOptions').hide();
		$('#weekOptions').hide();
		$('#datePickerAccept').bind('tap', getDateTimeInfo);
	});
	$('#testButton').bind('click',function(){
		return populateViewTask('0Edd6s8Ugw');
	});
	$('#editTaskButton').bind('click',setToEditTask);
	$('#newListAccept').bind('click',function(){
		var name = $('#listnameinput').val();
		$("#listnameinput").val('');
		addNewListToDropdown(name,name);
		$('option:selected').each(function(idx, elem){
			$(elem).removeAttr('selected');
		});
		$('#listselect option[value="'+name+'"]').attr('selected', 'selected');
		history.back();
		return false;
	});
	$('#listselect').bind('change',function(){
		var selectedList = $('option:selected').val();
		if(selectedList == 'new')
		{
			$('#newListLink').click();
		}
	})
	$('#home').bind('pageinit',function(){
		addNewListToDropdown('example','Example List');
	});
	$('option:selected').each(function(idx, elem){
			$(elem).removeAttr('selected');
		});
	$('#new').bind('tap',function(){
		$('#newtasklink').click();
	});
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
	
	$('#home').bind('pageinit',initHome);
	// addNewListToDropdown('example','Example List');
	// $('#listselect option[value="example"]').attr('selected', 'selected');
	// $('#listselect').selectmenu();
	$('#addlPhotoLabel').bind('pageinit',addPhotoView);
}
function init(){
	console.log('init started');
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", deviceReady, false);
        console.log('on phone');
    } else {
    	console.log('on browser');
        deviceReady();
    }
}


//  TASKS  PAGES ------------------
function newListViewTask(img, id, name, desc, datetime){
	var html = '<li><a href="#viewTask"><img id="';
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
	html += '</a><a id="editTaskButton" href="#newTask">Edit Task</a></li>';
	tasklist = $('#taskList');
	tasklist.append(html).listview('refresh');
	tasklist.trigger("create");
	$('#editTaskButton').bind('tap',setToEditTask);
}
function addNewListToDropdown(value, name){
	var html = '<option value="';
	html += value+'"> '+name+'</option>';
	$('#listselect').prepend(html).selectmenu('refresh',true);
	$('#homeheader').trigger("create");
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
	$('#editTaskHeading').html('New Task');
	console.log('making new task...');
}


//	EDIT TASK--------------------------------
function setToEditTask(taskid){
	$('#editTaskHeading').html('Edit Task');
	setupEdit('http://192.168.2.7/user_images/blanco662/1101.jpg','Some Task','Here is some description stuff',{freq: 'taskOnce', date: '2012-11-10', time: '03:33'});
	console.log('editing...');
}
function populateViewTask(taskId){
	var query = new Parse.Query(TaskObject);
	query.equalTo('objectId',taskId);
	query.find({
		success: function(results){
			var name = results[0].attributes.taskName,
				desc = results[0].attributes.taskDesc,
				freq = results[0].attributes.taskFrequency,
				datetime = results[0].attributes.taskDateTime,
				user = results[0].attributes.creator, 
				time,
				date,
				imURL;
			imURL = makeImgURL(user,taskId,'main');

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
			$('#vTaskPic').attr('src',imURL);
			$('#vTaskName').append(name);
			$('#vDescBox').append(desc);
			$('#vTaskFreq').append(freq);
			$('#vTaskTime').append(time);
			$('#vTaskDate').append(date);

		},
		error: function(error){
			alert('error retrieving data from server');
		}
	});
}
function makeImgURL(user,taskid,photoid){
	var server = 'http://localhost/user_images/',
		folderName = user.id+'/',
		imageName = taskid+photoid+'.jpg',
		imageURL;

		imageURL = server+folderName+imageName;
		return imageURL;
}

//	SCHEDULE SUMMARY---------------------------
function populateScheduleSummary(weekTasks){
	var html="", i;
	for(i=0;i<weekTasks.length;i++){
		html += "<li><a href='#viewTask'><h1>";
		html += weekTasks[i].tName + ' id: '+weekTasks[i].tId;
		html += "</h1></a></li>";
	}
}


// DATE/TIME DIALOG-----------------------
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


// PARSE STUFF -----------------------------
function initHome(){
	console.log('initing home');
	//loadfromParse();
	addNewListToDropdown('example','Example List');
	$('#listselect option[value="example"]').attr('selected', 'selected');
	$('#listselect').selectmenu();
}
function register(){
	$("#regstatus").html("").removeClass("errorDiv");

	//get values
    var username = $("#username").val();
    var password = $("#password").val();
    var email = $("#email").val();

    //do some basic validation here
    var error = "";

    if(username === "") {
    	$("#usernameerror").css("color","red");
    	$("#usernameerror").css("visibility","visible");
    	error+="username error ";
    }else
    	$("#usernameerror").css("visibility","hidden");

    if(password === "") {
    	$("#passworderror").css("color","red");
    	$("#passworderror").css("visibility","visible");
    	error+="password error ";
    }else
    	$("#passworderror").css("visibility","hidden");

    if(email === "") {
    	$("#emailerror").css("color","red");
    	$("#emailerror").css("visibility","visible");
    	error+="email error ";

	} else
		$("#emailerror").css("visibility","hidden");

    if(error !== "") {
        $("#regstatus").html(error).addClass("errorDiv");
        $.mobile.changePage("#register");
        return;
    }else
    	$("#regstatus").html("<b>Registering user...</b>");
    //try to register with Parse and see if it works.
    var user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);


    user.signUp(null, {
        success:function(user) {
            CurrentUser = user;
            alert("Successful Registration!!")
          
            $.mobile.changePage("./index.html#login");

        },
        error:function(user, error) {
            console.log("ERROR!");
            console.dir(error);
        }
    });
}
function login(){

    $("#loginstatus").html("").removeClass("errorDiv");

    //get values
    var username = $("#usernamelogin").val();
    var password = $("#passwordlogin").val();

    var errors="";

    //do some basic validation here
    if(username === ""){
    	$("#loginuser").css("color","red");
    	$("#loginuser").css("visibility","visible");
    	errors +="userlogin "
    } else
		$("#loginuser").css("visibility","hidden");

    if(password === ""){
    	$("#loginpass").css("color","red");
    	$("#loginpass").css("visibility","visible");
    	errors += "passlogin "
    } else
    	$("#loginpass").css("visibility","hidden");

    Parse.User.logIn(username, password, {
        success:function(user) {
            CurrentUser = user;
             $("#loginstatus").html("<b>Logging in...</b>");
             $("#loggedIn").append(CurrentUser.get("username"));
             console.log("Successfule Login");
            $.mobile.changePage("#home");

        },
        error:function(user, error) {
            alert("Login Fail!!\nPlease Register");
            console.log("ERROR!");
            console.dir(error);
            
            $.mobile.changePage("#login");
        }
    });
}
function loadfromParse() {
	UserObject = Parse.User.current;
	var imgsrc = $('#taskPic').attr('src');
	var query = new Parse.Query(TaskObject);
	query.equalTo(UserObject,"creator");
	query.find({
	 	success:function(results){
	 		for(var i=0,len=results.length; i<len; i++){
	 		  	var result=results[i];
	 		  	newListViewTask(imgsrc,result.id,result.attributes.taskName,result.attributes.taskDesc,result.attributes.timeDue+" on "+result.attributes.dateDue);
	 		}
	 	},
	 	error: function(error){
	 		console.log("Error: "+error.code+" "+error.message)
	 	}
	 });
}
function populateScheduleSummary(weekTasks){
	var html="", i;
	for(i=0;i<weekTasks.length;i++){
		html += "<li><a href='#viewTask'><h1>";
		html += weekTasks[i].tName + ' id: '+weekTasks[i].tId;
		html += "</h1></a></li>";
	}
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
	$.mobile.changePage($('#home'));
	var dateObj = datepickerinfo,// = getDateTimeInfo(),
		datetime,
		freq;
	var imgsrc = $('#taskPic').attr('src');
	if (taskName === "")
		newListViewTask(imgsrc,'example1','Example Task', 'An example task...', '10/19/12 6:30pm');
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
		var taskObject = new TaskObject();
		taskObject.save({
			taskName:taskName,
			taskDesc:taskDesc,
			taskTime:dateObj,
			creator:CurrentUser,
			picCounter:picNum,
		},{
			success: function(tO){
				console.log('success! id: '+ tO.id);
				uploadPhoto(imgsrc,CurrentUser,tO.id,1);
		 	},
		 	error: function(tO, error){
		 		console.log('error saving');
		 	}
		});
		
		resetDateTimeDialog();
	}	
}


// PICTURE STUFF -------------------------
function uploadPhoto(imageURI, id, tid, pid){
	var options = new FileUploadOptions(),
		params = new Object();
	options.fileKey="file";
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType="text/plain";
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
  												quality:60});
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
function addPhoto(data){
	$('#exPhoto1').attr('src',data);
	$('#extraPhotos').listview('refresh');
}
function setupEdit(imgURL, name, desc, datetime){
	$('#taskPic').attr('src',imgURL);
	$('#nameField').val(name);
	$('#descArea').val(desc);
	console.log('about to set up date time');
	setupDateTime(datetime);
}
