sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, UIComponent, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("ehsm.controller.RiskAssessment", {
        onInit: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("RiskAssessment").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            var oSessionModel = this.getOwnerComponent().getModel("session");
            if (!oSessionModel || !oSessionModel.getProperty("/IsLoggedIn")) {
                UIComponent.getRouterFor(this).navTo("Login");
                return;
            }

            var sEmpId = oSessionModel.getProperty("/EmployeeId");
            var oTable = this.byId("riskTable");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                // No specific filter requested in the updated requirements.
                // Previous requirement asked for filtering by EmployeeId, but the new strict requirement list of fields 
                // does not include EmployeeId, and does not explicitly ask for filtering.
                // To avoid OData errors if 'EmployeeId' field doesn't exist, we will list all.
                // aFilters.push(new Filter("EmployeeId", FilterOperator.EQ, sEmpId)); 
            }
        },

        onNavBack: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("Dashboard");
        },

        formatter: {
            severityState: function (sSeverity) {
                if (sSeverity === "High") return "Error";
                if (sSeverity === "Medium") return "Warning";
                return "Success";
            }
        }
    });
});
