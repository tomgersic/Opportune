/**
 * Offline Toggler View
 **/
app.views.OfflineToggler = Backbone.View.extend({

    template: _.template($("#offline-toggler").html()),

    events: {
        "click": "toggle"
    },

    initialize: function() {
        this.model.on("change:isOnline", this.render, this);
    },

    render: function(eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    toggle: function(event) {
        event.preventDefault();
        this.model.set("isOnline", !this.model.get("isOnline"))
        if (this.model.get("isOnline")) {
            app.router.navigate("#sync", {trigger:true});        
        }
    }
});
