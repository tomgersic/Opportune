/**
 * Sync Page
 **/

app.views.SyncPage = Backbone.View.extend({

    template: _.template($("#sync-page").html()),

    events: {
        "click .button-prev": "goBack",
        "click .sync": "sync"
    },

    initialize: function() {
        var that = this;
        _.each(["reset","add","remove"], function(eventName) { that.model.on(eventName, that.render, that); });
        this.listView = new app.views.OpportunityListView({model: this.model});
    },

    render: function(eventName) {
        $(this.el).html(this.template(_.extend({countLocallyModified: this.model.length}, this.model.toJSON())));
        this.listView.setElement($("ul", this.el)).render();
        return this;
    },

    goBack: function(event) {
        if (this.model.length > 0) {
            // We are not done - going back offline before leaving screen
            app.offlineTracker.set("isOnline", false);
        }
        app.router.navigate("#", {trigger:true});
    },

    sync: function(event) {
        var that = this;
        if (this.model.length == 0 || this.model.at(0).get("__sync_failed__")) {
            // we push sync failures back to the end of the list - if we encounter one, it means we are done
            return;
        }
        else {
            var record = this.model.shift();

            var options = {
                mergeMode: Force.MERGE_MODE.MERGE_FAIL_IF_CHANGED,
                success: function() {
                    if (that.model.length == 0) {
                        app.router.navigate("#", {trigger:true});
                    }
                    else {
                        that.sync();
                    }
                },
                error: function() {
                    record = record.set("__sync_failed__", true);
                    that.model.push(record);
                    that.sync();
                }
            };

            return record.get("__locally_deleted__") ? record.destroy(options) : record.save(null, options);
        }
    }
});