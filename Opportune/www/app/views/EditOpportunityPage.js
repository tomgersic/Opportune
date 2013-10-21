app.views.EditOpportunityPage = Backbone.View.extend({

    action: null,
    backAction: null,

    template: _.template($("#edit-opportunity-page").html()),

    events: {
        "click .button-prev": "goBack",
        "change": "change",
        "click .save": "save",
        "click .merge": "saveMerge",
        "click .overwrite": "saveOverwrite",
        "click .toggleDelete": "toggleDelete"
    },

    initialize: function() {
        this.offlineTogglerView = new app.views.OfflineToggler({model: app.offlineTracker});
        app.offlineTracker.on("change:isOnline", this.render, this);
    },

    render: function(eventName) {
        this.action = (null == this.model.id) ? "Add" : "Edit";
        if (this.action == "Add") { this.model.set({__local__: false, Name:"", Industry:"", Phone:"", LastModifiedDate:"", attributes : { type: "Opportunity"}}); }
        this.backAction = app.router.getLastPage() || "#";
        $(this.el).html(this.template(_.extend({action: this.action}, this.model.toJSON())));
        this.offlineTogglerView.setElement($("#offlineStatus", this.el)).render();
        var online = app.offlineTracker.get("isOnline");
        $(".merge", this.el).hide();
        $(".overwrite", this.el).hide();

        if (this.action == "Add") {
            $(".toggleDelete", this.el).hide();
        }
        else {
            var deleted = this.model.get("__locally_deleted__");
            $(".toggleDelete", this.el).html(deleted?"Undelete":"Delete");
        }
        return this;
    },

    change: function(evt) {
        // apply change to model
        var target = event.target;
        this.model.set(target.name, target.value);
        $("#opportunity" + target.name + "Error", this.el).hide();
    },

    goBack: function(event) {
        app.router.navigate(this.backAction, {trigger:true});
    },

    showFieldError: function(field, message, error) {
        var errorEl = $("#opportunity" + field + "Error", this.el);
        errorEl.addClass(error ? "count-negative" : "count-other");
        errorEl.html(message);
        errorEl.show();
    },

    handleError: function(error) {
        var that = this;
        if (error.type === "RestError") {
            _.each(error.details, function(detail) {
                if (detail.fields == null || detail.fields.length == 0) { alert(detail.message); }
                else {_.each(detail.fields, function(field) {that.showFieldError(field, detail.message);});}
            });
        }
        else if (error.type == "ConflictError") {
            _.each(error.remoteChanges, function(field) {
                var conflict = error.conflictingChanges.indexOf(field) >=0;
                that.showFieldError(field, "Server: " +  error.theirs[field], conflict);
            });
            $(".merge", this.el).show();
            $(".overwrite", this.el).show();
        }
    },

    getSaveOptions: function(mergeMode, cacheMode) {
        var that = this;
        return {
            cacheMode: cacheMode,
            mergeMode: mergeMode,
            success: function() { app.router.navigate(that.backAction, {trigger:true}); },
            error: function(data, err, options) { 
                that.handleError(new Force.Error(err)); 
                console.log(err);
            }
        };
    },

    save: function() {
        this.model.save(null, this.getSaveOptions(Force.MERGE_MODE.MERGE_FAIL_IF_CHANGED));
    },

    saveMerge: function() {
        this.model.save(null, this.getSaveOptions(Force.MERGE_MODE.MERGE_ACCEPT_YOURS));
    },

    saveOverwrite: function() {
        this.model.save(null, this.getSaveOptions(Force.MERGE_MODE.OVERWRITE));
    },

    toggleDelete: function() {
        if (this.model.get("__locally_deleted__")) {
            this.model.set("__locally_deleted__", false);
            this.model.save(null, this.getSaveOptions(null, Force.CACHE_MODE.CACHE_ONLY));
        }
        else {
            this.model.destroy({
                success: function(data) {
                    app.router.navigate("#", {trigger:true});
                },
                error: function(data, err, options) {
                    var error = new Force.Error(err);
                    alert("Failed to delete opportunity: " + (error.type === "RestError" ? error.details[0].message : "Remote change detected - delete aborted"));
                }
            });
        }
    }
});
