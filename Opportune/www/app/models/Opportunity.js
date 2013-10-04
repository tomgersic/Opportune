/**
 * Opportunity Model
 **/
app.models.Opportunity = Force.SObject.extend({
    sobjectType: "Opportunity",
    fieldlist: function(method) { 
        return method == "read" 
            ? ["Id", "Name", "Amount", "StageName", "Owner.Name", "LastModifiedBy.Name", "LastModifiedDate"]
            : ["Id", "Name", "Amount", "StageName"];
    },
    cache: function() { return app.cache;},
    cacheForOriginals: function() { return app.cacheForOriginals;},
    cacheMode: function(method) {
        if (!app.offlineTracker.get("isOnline")) {
            return Force.CACHE_MODE.CACHE_ONLY;
        }
        else {
            return (method == "read" ? Force.CACHE_MODE.CACHE_FIRST : Force.CACHE_MODE.SERVER_FIRST);
        }
    }
});
