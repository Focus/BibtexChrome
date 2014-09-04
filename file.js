var fileInput;
var colNames = ["name", "type", "title", "author", "year"];
var table;
var fileName;
var edit = 0;
var localBibs = [];
document.addEventListener('DOMContentLoaded', function() {
	fileInput = document.getElementById("fileOpen");
	fileInput.addEventListener("change", readFile, false);
	table = document.getElementById("localTable");
	fileName = document.getElementById("filename");
	hookDivs();
});


function hookDivs(){
	var divs = document.getElementsByClassName("editDiv");
	for(var i = 0; i < divs.length; i++)
		divs[i].addEventListener('keyup', localEdit);
}

function readFile(e){
	var file = e.target.files[0];
	if(!file)
		return;
	fileName.innerHTML = file.name;
	edit = 0;
	var reader = new FileReader();
	reader.onload = updateLocalBibs;
	reader.readAsText(file);
}

function updateLocalBibs(e){
	var bibs = e.target.result.split("@");
	localBibs = [];
	for(var i=1; i < bibs.length; i++)
		localBibs.push(new Citation(bibs[i]));
	updateLocalTable();
}

function updateLocalTable(){
	while(table.rows.length > 1)
		table.deleteRow(1);

	for(var i=0; i<localBibs.length; i++){
		var row = table.insertRow(table.rows.length);
		row.insertCell(0).innerHTML = "<div contenteditable class='editDiv'>" + localBibs[i].getString("name") + "</div>";
		row.insertCell(1).innerHTML = "<div contenteditable class='editDiv'>" + localBibs[i].getString("type") + "</div>";
		row.insertCell(2).innerHTML = "<div contenteditable class='editDiv'>" + localBibs[i].getString("title") + "</div>";
		row.insertCell(3).innerHTML = "<div contenteditable class='editDiv'>" + localBibs[i].getString("author") + "</div>";
		row.insertCell(4).innerHTML = "<div contenteditable class='editDiv'>" + localBibs[i].getString("year") + "</div>";
	}

		var row = table.insertRow(table.rows.length);
		row.insertCell(0).innerHTML = "<div contenteditable class='editDiv'> </div>";
		row.insertCell(1).innerHTML = "<div contenteditable class='editDiv'> </div>";
		row.insertCell(2).innerHTML = "<div contenteditable class='editDiv'> </div>";
		row.insertCell(3).innerHTML = "<div contenteditable class='editDiv'> </div>";
		row.insertCell(4).innerHTML = "<div contenteditable class='editDiv'> </div>";

		hookDivs();
}

function localEdit(e){
	var row = e.target.parentNode.parentNode.rowIndex;
	var col = e.target.parentNode.cellIndex;
	if(row == table.rows.length - 1){
		var cite = new Citation();
		localBibs.push(cite);
		var row = table.insertRow(table.rows.length);
		row.insertCell(0).innerHTML = "<div contenteditable class='editDiv'> </div>";
		row.insertCell(1).innerHTML = "<div contenteditable class='editDiv'> </div>";
		row.insertCell(2).innerHTML = "<div contenteditable class='editDiv'> </div>";
		row.insertCell(3).innerHTML = "<div contenteditable class='editDiv'> </div>";
		row.insertCell(4).innerHTML = "<div contenteditable class='editDiv'> </div>";
		hookDivs();
	}
	else
		cite = localBibs[row-1];
	cite.replaceString(colNames[col],e.innerHTML);
	if(!edit){
		edit = 1;
		fileName.innerHTML += "*";
	}
}
