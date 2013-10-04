/**
 * The OpportunityCollection Model
 **/
app.models.OpportunityCollection = Force.SObjectCollection.extend({
    model: app.models.Opportunity,
    fieldlist: ["Id", "Name", "Amount", "StageName", "Owner.Name", "LastModifiedBy.Name", "LastModifiedDate"],
    cache: function() { return app.cache},
    cacheForOriginals: function() { return app.cacheForOriginals;},

    getCriteria: function() {
        return this.key;
    },

    setCriteria: function(key) {
        this.key = key;
    },

    config: function() {
        // Offline: do a cache query
        if (!app.offlineTracker.get("isOnline")) {
            // Not using like query because it does a case-sensitive sort
            return {type:"cache", cacheQuery:{queryType:"smart", smartSql:"SELECT {opportunities:_soup} FROM {opportunities} WHERE {opportunities:Name} LIKE '" + (this.key == null ? "" : this.key) + "%' ORDER BY LOWER({opportunities:Name})", pageSize:250}};
        }
        // Online
        else {
            // First time: do a MRU query
            if (this.key == null) {
                return {type:"mru", sobjectType:"Opportunity", fieldlist: this.fieldlist, orderBy:"LastModifiedDate", orderDirection:"DESC"};
            }
            // Other times: do a SOQL query
            else {
                return {type:"soql", query:"SELECT " + this.fieldlist.join(",") + " FROM Opportunity WHERE Name like '" + this.key + "%' ORDER BY Name LIMIT 250"};
            }
        }
    }
});