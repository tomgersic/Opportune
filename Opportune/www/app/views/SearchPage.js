/**
 * Search Page View
 **/
app.views.SearchPage = Backbone.View.extend({

    template: _.template($("#search-page").html()),

    events: {
        "keyup .search-key": "search"
    },

    initialize: function() {
        console.log("SearchPage Initialize");
        this.listView = new app.views.OpportunityListView({model: this.model});
        this.offlineTogglerView = new app.views.OfflineToggler({model: app.offlineTracker});
    },

    render: function(eventName) {
        console.log("SearchPage Render");
        $(this.el).html(this.template());
        $(".search-key", this.el).val(this.model.getCriteria());
        this.offlineTogglerView.setElement($("#offlineStatus", this.el)).render();
        this.listView.setElement($("ul", this.el)).render();
        return this;
    },

    search: function(event) {
        console.log("SearchPage Search");
        this.model.setCriteria($(".search-key", this.el).val());
        this.model.fetch();
    }
});
