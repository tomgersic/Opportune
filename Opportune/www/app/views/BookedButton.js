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
        alert("hi");
        

        navigator.smartstore.soupExists('opportunities',function(param){
            alert('yes');
            alert(param);
        },function(error){
            alert('no');
            alert(error);
        });

        var querySpec = navigator.smartstore.buildAllQuerySpec("Id", null, 2000);
        
        navigator.smartstore.querySoup('opportunities',querySpec, function(cursor) { 
            /*var records = [];
            records = Util.LoadAllRecords(cursor,records);*/
            console.log(cursor.currentPageOrderedEntries);
            //close the query cursor
            navigator.smartstore.closeCursor(cursor);
            //callback(records);
        },error);
    }
});
