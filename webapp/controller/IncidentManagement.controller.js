sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, UIComponent, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("ehsm.controller.IncidentManagement", {
        onInit: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("IncidentManagement").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            var oSessionModel = this.getOwnerComponent().getModel("session");
            if (!oSessionModel || !oSessionModel.getProperty("/IsLoggedIn")) {
                UIComponent.getRouterFor(this).navTo("Login");
                return;
            }

            var sEmpId = oSessionModel.getProperty("/EmployeeId");
            var oTable = this.byId("incidentTable");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                var aFilters = [];
                if (sEmpId) {
                    aFilters.push(new Filter("EmployeeId", FilterOperator.EQ, sEmpId));
                }
                oBinding.filter(aFilters);
            }
        },

        onNavBack: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("Dashboard");
        },

        formatter: {
            statusState: function (sStatus) {
                if (!sStatus) return "None";
                if (sStatus.toLowerCase() === "open") return "Error";
                if (sStatus.toLowerCase() === "closed") return "Success";
                if (sStatus.toLowerCase() === "in progress") return "Warning";
                return "None";
            }
        }
    });
});
