var counter=1;

function capturePhoto(){
	navigator.camera.getPicture(showPhoto,null,{sourceType:1,quality:60});
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
function init(){
	counter=1;
}
function addPhotoSpace(){
	var fieldName = "nameField"+counter,
		fieldDesc = "descField"+counter,
		photoDesc = "descPhoto"+counter,
		photoName = "namePhoto"+counter,
		photoId = "exPhoto"+counter,
		html = '<li><img id="' + photoId + '" src="camera.jpg" >';
	html += '<label for="'+fieldName+'">Photo Name</label>';
	html += '<input type="text" name="'+photoName+'" id="'+fieldName+'" value="" /></br>';
	html += '<label for="'+fieldDesc+'">Photo Desc.</label>';
	html += '<input type="text" name="'+photoDesc+'" id="'+fieldDesc+'" value="" /></li>';
	$('#extraPhotos').append(html).listview('refresh');
	$(photoId).bind('tap', captureAdditionalPhoto);
	counter++;
}
