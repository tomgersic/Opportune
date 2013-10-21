/**
 * Booked Button View
 **/
app.views.BookedButton = Backbone.View.extend({

    template: _.template($("#booked-button").html()),

    events: {
        "click": "booked"
    },

    initialize: function() {
        
    },

    render: function(eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    booked: function(event) {
        event.preventDefault();
        //alert("hi");
        

        navigator.smartstore.soupExists('opportunities',function(param){
            //alert('yes');
            //alert(param);
            console.log(param);
        },function(error){
            //alert('no');
            console.log(error);
            alert(error);
        });

        //this.example_registerSoup(); // Register a Soup
        //this.example_createRecord(); // Create a Record
        //this.example_queryAll(); // All Query Spec
        //this.example_queryExact(); // Exact Query Spec
        //this.example_queryLike(); // Like Query Spec
        this.example_querySmart(); // SMART Query Spec
    },

    //REGISTER A DUMMY SOUP FOR DEMO PURPOSES
    example_registerSoup: function() {
        var indexSpec = [
            {"path":"Id","type":"string"},
            {"path":"Name","type":"string"}
        ];

        navigator.smartstore.registerSoup('DEMO',indexSpec,function(param){
            console.log('Soup Created: '+param);
        },error);

    },

    //CREATE SOME DUMMY RECORDS
    example_createRecord: function() {
        var dummyRecords = [{
            "Name": "My Dummy Record",
            "Id": "123456789012345678",
            "Something": "Nothing"
        },{
            "Name": "Another Record",
            "Id": "876543210987654321",
            "Something": "Something Else"
        }];

        navigator.smartstore.upsertSoupEntriesWithExternalId('DEMO',dummyRecords, 'Id', function(){
            console.log("Upsert Success");        
        }, error);   
    },

    //QUERY ALL
    example_queryAll: function(){
        var querySpec = navigator.smartstore.buildAllQuerySpec("Id", null, 2000);
        
        navigator.smartstore.querySoup('DEMO',querySpec, function(cursor) { 
            console.log(cursor.currentPageOrderedEntries);
            //close the query cursor
            navigator.smartstore.closeCursor(cursor);
            //callback(records);
        },error);        
    },

    //QUERY EXACT
    example_queryExact: function(){
        var querySpec = navigator.smartstore.buildExactQuerySpec("Id", "876543210987654321", 2000);
        
        navigator.smartstore.querySoup('DEMO',querySpec, function(cursor) { 
            console.log(cursor.currentPageOrderedEntries);
            //close the query cursor
            navigator.smartstore.closeCursor(cursor);
            //callback(records);
        },error);        
    },

    //QUERY LIKE
    example_queryLike: function(){
        var querySpec = navigator.smartstore.buildLikeQuerySpec("Name", "%Dummy%", null, 2000);
        
        navigator.smartstore.querySoup('DEMO',querySpec, function(cursor) { 
            console.log(cursor.currentPageOrderedEntries);
            //close the query cursor
            navigator.smartstore.closeCursor(cursor);
            //callback(records);
        },error);        
    },
    
    //QUERY SMART
    example_querySmart: function(){
        var smartSQL = "SELECT {DEMO:Name} FROM {DEMO} WHERE {DEMO:Id} = '876543210987654321'";
        var querySpec = navigator.smartstore.buildSmartQuerySpec(smartSQL, 2000);
        
        navigator.smartstore.runSmartQuery(querySpec, function(cursor) {
            console.log(cursor.currentPageOrderedEntries);
            //close the query cursor
            navigator.smartstore.closeCursor(cursor);            
        });

    },

    error: function(err){
        console.log(err);
    }
});
