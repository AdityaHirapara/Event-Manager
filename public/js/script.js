

function openModal(id){
	document.getElementById(id).style.display='block';
}
function closeModal(id){
	document.getElementById(id).style.display='none';
}

function extend(id){
	let ele = document.getElementById(id);
	if(ele.style.display=='block'){
		ele.style.display='none';
	}
	else{
		ele.style.display='block';
	}
}

function navigation(){
	if(document.getElementById('navmenu').style.display=='block'){
		document.getElementById('navmenu').style.display='none';
	}
	else{
		document.getElementById('navmenu').style.display='block';
		nav=document.getElementById('navmenu');
	}
}