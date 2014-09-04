chrome.app.runtime.onLaunched.addListener(function (launchData) {
	var screenWidth = screen.availWidth;
	var screenHeight = screen.availHeight;
	chrome.app.window.create('main.html',{
		id: "BibtexImport",
		bounds: {
			width: screenWidth,
			height: screenHeight
		}
	});
});
