function capturePhoto(){
	navigator.camera.getPicture(showPhoto,null,{sourceType:1,quality:60});
}

function showPhoto(data){
	var pic = $('#taskPic');
	pic.attr('src', data);
}

function addPhotoSpace(){
	console.log("photo added");
	var html = '<li style="height:128px;"><div class="ui-grid-b"><div class="ui-block-a" style="width:33%"><img src="camera.jpg" style="height:auto;width:30%"></div><div class="ui-block-b" style="width:33%"><label>Photo Name</label></br><label>Photo Desc.</label></div><div class="ui-block-c" style="width:33%"><input type="text" name="namePhoto1" id="nameField1" value="" /><input type="text" name="descPhoto1" id="descField1" value="" /></div></div></li>';
	$('#extraPhotos').append(html).listview('refresh');
}