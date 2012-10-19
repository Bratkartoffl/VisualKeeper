var counter=1;

function capturePhoto(){
	navigator.camera.getPicture(showPhoto,null,{sourceType:1,quality:60});
}
function init(){
	$('#newTask').bind('pagebeforeshow',resetNewTask);
	$('#newTask').bind('pageinit',initNewTask)
}
function initNewTask(){
	$('#cancelButton').bind('tap',cancelNewTask);
}
function cancelNewTask(){
	resetNewTask();
	$.mobile.changePage($('#home'));
}
function showPhoto(data){
	$('#taskPic').attr('src', data);
	
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
	$('#exPhoto1').attr('src',data)
	$('#extraPhotos').listview('refresh');
}
function resetNewTask(){
	counter=1;
	var s='';
	$('#extraPhotos').html(s).listview('refresh');
	console.log("inited");
}
function addPhotoSpace(){
	var list = $('#extraPhotos'),
		fieldName = "nameField"+counter,
		fieldDesc = "descField"+counter,
		photoDesc = "descPhoto"+counter,
		photoName = "namePhoto"+counter,
		photoId = "exPhoto"+counter,
		html = '<li data-role="fieldcontain" data-theme="a">';
	html += '<label for="'+fieldName+'">Photo Name</label>';
	html += '<input type="text" name="'+photoName+'" id="'+fieldName+'" />';
	html += '<label for="'+fieldDesc+'">Photo Desc.</label>';
	html += '<input type="text" name="'+photoDesc+'" id="'+fieldDesc+'" /><img id="' + photoId + '" src="camera.jpg" style="border-radius:5px; margin-left:8px; margin-top:7px;"></li>';
	
	list.append(html).listview("refresh");
	$('#newTaskContent').trigger("create");
	$('#'+photoId).bind('tap', captureAdditionalPhoto);
	counter++;
	
}
