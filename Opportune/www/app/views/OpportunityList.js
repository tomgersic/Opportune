app.views.OpportunityListView = Backbone.View.extend({

    listItemViews: [],

    initialize: function() {
        this.model.on("reset", this.render, this);
    },

    render: function(eventName) {
        _.each(this.listItemViews, function(itemView) { itemView.close(); });
        this.listItemViews = _.map(this.model.models, function(model) { return new app.views.OpportunityListItemView({model: model}); });
        $(this.el).append(_.map(this.listItemViews, function(itemView) { return itemView.render().el;} ));
        return this;
    }
});