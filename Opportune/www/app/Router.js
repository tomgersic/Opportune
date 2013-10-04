app.Router = Backbone.StackRouter.extend({

    routes: {
        "": "list",
        "list": "list",
        "add": "addOpportunity",
        "edit/opportunities/:id": "editOpportunity",
        "sync":"sync"
    },

    /**
     * Set up the SmartStore Caches
     **/
    setupCaches: function() {
        // Cache for offline support
        app.cache = new Force.StoreCache("opportunities", [ {path:"Name", type:"string"} ]);

        // Cache for conflict detection 
        app.cacheForOriginals = new Force.StoreCache("original-opportunities");

        return $.when(app.cache.init(), app.cacheForOriginals.init());
    },

    /**
     * initialize the router
     **/
    initialize: function() {
        Backbone.Router.prototype.initialize.call(this);

        // Setup caches
        this.setupCaches();

        // Collection behind search screen
        app.searchResults = new app.models.OpportunityCollection();

        // Collection behind sync screen
        app.localOpportunities = new app.models.OpportunityCollection();
        app.localOpportunities.config = {type:"cache", cacheQuery: {queryType:"exact", indexPath:"__local__", matchKey:true, order:"ascending", pageSize:250}};

        // Initializing offline tracker 
        app.offlineTracker = new app.models.OfflineTracker({isOnline: true});

        // We keep a single instance of SearchPage, SyncPage and EditOpportunityPage
        app.searchPage = new app.views.SearchPage({model: app.searchResults});
        app.syncPage = new app.views.SyncPage({model: app.localOpportunities});
        app.editPage = new app.views.EditOpportunityPage();
    },

    /**
     * show the search page with results list
     **/
    list: function() {
        app.searchResults.fetch();
        // Show page right away - list will redraw when data comes in
        this.slidePage(app.searchPage); 
    },

    /**
     * show the Add Opportunity Page
     **/
    addOpportunity: function() {
        app.editPage.model = new app.models.Opportunity({Id: null});
        this.slidePage(app.editPage);
    },

    /**
     * Edit the Opportunity
     **/
    editOpportunity: function(id) {
        var that = this;
        var opportunity = new app.models.Opportunity({Id: id});
        opportunity.fetch({
            success: function(data) {
                app.editPage.model = opportunity;
                that.slidePage(app.editPage);
            },
            error: function() {
                alert("Failed to get record for edit");
            }
        });
    },

    /**
     * Show the Sync Page
     **/
    sync: function() {
        app.localOpportunities.fetch();
        // Show page right away - list will redraw when data comes in
        this.slidePage(app.syncPage);
    }
});