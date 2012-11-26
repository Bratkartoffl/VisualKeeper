var photoCounter=1;

function capturePhoto(){
	navigator.camera.getPicture(showPhoto,null,{sourceType:1,quality:60,correctOrientation: true});
}
function init(){
	document.addEventListener('deviceready',deviceready, false);
}
function deviceready() {
	console.log("device is ready");
	Parse.initialize("c8HCVamYNDo1e6uzgwp81vybRFimX2vfEHgBNLrv", "ieQmtmB8jIhmgWRBPAp3Wzw4HEpnzHUIcRUM8yxK");
    TestObject = Parse.Object.extend("TestObject");

	$('#newTask').bind('pagebeforeshow',resetNewTask);
	$('#newTask').bind('pageinit',initNewTask);
	$('#editTaskButton').bind('tap',setToEditTask);
	$('#home').bind('pageinit',initHome);
	addNewListToDropdown('example','Example List');
	$('#listselect option[value="example"]').attr('selected', 'selected');
	$('#listselect').selectmenu();
	$('#addlPhotoLabel').bind('pageinit',addPhotoView);
}
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
	html += '</a><a id="editTaskButton" href="#newTask"><span>Edit Task</span></a></li>';
	tasklist = $('#taskList');
	tasklist.append(html).listview('refresh');
	tasklist.trigger("create");
}
function initHome(){
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
	$('#cancelButton').bind('tap',cancelNewTask);
	$('#acceptButton').bind('tap',acceptNewTask);
	setToNewTask();
}
function acceptNewTask(){
	var taskName = $("#nameField").val();
	var taskDesc = $("#descArea").val();
	var taskDate = $("#dateField").val();
	var taskTime = $("#")
	$.mobile.changePage($('#home'));
	var imgsrc = $('#taskPic').attr('src');
	console.log(imgsrc);
	if (taskName === "")
		newListViewTask(imgsrc,'example1','Example Task', 'An example task...', '10/19/12 6:30pm');
	else
		newListViewTask(imgsrc,,taskName,taskDesc, tas);
	var testObject = new TestObject();
    testObject.save({taskName:taskName,
    				 taskDesc:taskDesc,
    				 taskDue:taskDue});
}
function cancelNewTask(){
	resetNewTask();
	$.mobile.changePage($('#home'));
}
function showPhoto(data){
	var pic = $('#taskPic');
	pic.attr('src', data);
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
function resetNewTask(){
	photoCounter=1;
	var s='';
	$('#extraPhotos').html(s).listview('refresh');
}
function setToNewTask(){
	$('#editTaskHeading').html('New Task');
	console.log('making new task...');
}
function setToEditTask(taskid){
	$('#editTaskHeading').html('Edit Task');
	console.log('editing...');
}
function addPhotoSpace(){
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
function addNewListToDropdown(value, name){
	var html = '<option value="';
	html += value+'"> '+name+'</option>';
	$('#listselect').prepend(html).selectmenu('refresh',true);
	$('#homeheader').trigger("create");
}