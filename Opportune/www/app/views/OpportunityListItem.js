/**
 * List Item View
 **/ 
app.views.OpportunityListItemView = Backbone.View.extend({
    tagName: "li",
    template: _.template($("#opportunity-list-item").html()),

    render: function(eventName) {
        var templateData = _.extend({__sync_failed__:false}, this.model.toJSON());
        $(this.el).html(this.template(templateData));
        return this;
    },

    close: function() {
        this.remove();
        this.off();
    }
});
