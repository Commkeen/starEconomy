// import our modules
var nodeStatic 	= require( 'node-static' );	// used for serving static files
var http		= require( 'http' );		// default node http server
var port		= 5858;						// NOTE: this is the same port as specified in launch.json

// create our file server config
var binFiles = new nodeStatic.Server( 'bin', { 	// anything in the bin/ folder is served
	cache:0,								// no cache (only for testing)
	gzip:true								// gzip our assets
});
var srcFiles = new nodeStatic.Server( 'src',{
	cache:0,
	gzip:true
});

// create our basic server
http.createServer( function( request, response ) {
	request.addListener( 'end', function() {
		binFiles.serve( request, response, function(e, res) {
			if (e && (e.status === 404)) {
				srcFiles.serve(request,response);
			}
		}); // any url asked for, just try and serve the file from bin/
	}).resume();
}).listen( port );