var searchedBibs = [];
var searchBox;
var trs;
var lastSelectedRow;

document.addEventListener('DOMContentLoaded', function() {
	searchBox = document.getElementById("searchBox");
	document.getElementById("searchButton").addEventListener("click",fetchBibs);
	updateSearchTable();
});

function updateSearchTable(){
	if(searchedBibs.length > 0){
		while(table.rows.length > 0)
			table.deleteRow(0);

		for(var i=0; i<localBibs.length; i++){
			var row = table.insertRow(table.rows.length);
			row.insertCell(0).innerHTML = localBibs[i].getString("name");
			row.insertCell(1).innerHTML = localBibs[i].getString("type");
			row.insertCell(2).innerHTML = localBibs[i].getString("title");
			row.insertCell(3).innerHTML = localBibs[i].getString("author"); 
			row.insertCell(4).innerHTML = localBibs[i].getString("year");
		}
	}
	trs = document.getElementById("searchTable").getElementsByTagName("tr");
	for(var i = 1; i < trs.length; i++)
		trs[i].addEventListener('mousedown', rowClicked);
	lastSelectedRow = null;
}

function rowClicked(e){
	if(e.ctrlKey || e.metaKey){
		e.target.parentNode.className = e.target.parentNode.className == "selected" ? "" : "selected";
		lastSelectedRow = e.target.parentNode;
	}
	else if(e.shiftKey){
		curInd = e.target.parentNode.rowIndex;
		lstInd = lastSelectedRow ? lastSelectedRow.rowIndex : curInd;
		console.log(curInd + "   " + lstInd);
		for( var i = Math.min(curInd,lstInd); i < Math.max(curInd,lstInd)+1; i++ )
			trs[i].className = "selected";
		lastSelectedRow = e.target.parentNode;
	}
	else{
		var sel = e.target.parentNode.className;
		for(var i = 1; i < trs.length; i++)
			trs[i].className = "";
		if(sel != "selected")
			e.target.parentNode.className = "selected";
		lastSelectedRow = e.target.parentNode;
	}

}


function fetchBibs(){
	var url = "http://www.ams.org/mathscinet/search/publications.html?"
		+ "pg4=AUCN&s4="
		+ document.getElementsByName("author")[0].value
		+ "&pg5=TI&s5="
		+ document.getElementsByName("title")[0].value
		+ "&fmt=bibtex&extend=1";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onload = updateSearch;
	searchBox.innerHTML = Date() + ": please wait...";
	if(!xhr.send()){
		searchBox.innerHTML = Date() + ": Failed to retreive results";
	}
}

function updateSearch(e){
	console.log(this.responseText);
}
