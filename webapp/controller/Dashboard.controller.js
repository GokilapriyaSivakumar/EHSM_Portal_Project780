sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function (Controller, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("ehsm.controller.Dashboard", {
        onInit: function () {
            // Optional: Check if logged in, else redirect to Login
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("Dashboard").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            var oSessionModel = this.getOwnerComponent().getModel("session");
            if (!oSessionModel || !oSessionModel.getProperty("/IsLoggedIn")) {
                // Not logged in, go back to login
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("Login");
            }
        },

        onPressRisk: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RiskAssessment");
        },

        onPressIncident: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("IncidentManagement");
        },

        onLogout: function () {
            var oSessionModel = this.getOwnerComponent().getModel("session");
            if (oSessionModel) {
                oSessionModel.setProperty("/IsLoggedIn", false);
                oSessionModel.setProperty("/UserId", "");
            }
            MessageToast.show("Logged out successfully");
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("Login");
        }
    });
});
