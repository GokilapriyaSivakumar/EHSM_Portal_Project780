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
                // No specific filter requested in updated requirements.
                // oBinding.filter(aFilters);
            }
        },

        onNavBack: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("Dashboard");
        },

        formatter: {
            statusState: function (sStatus) {
                if (!sStatus) return "None";
                if (sStatus === "OPEN") return "Error"; // Or Warning/Information depending on preference, usually Open incidents are bad/needs attention (Error or Warning). User said "highlighting... such as CLOSED or OPEN". I'll use Error for Open to be visible.
                if (sStatus === "CLOSED") return "Success";
                return "None";
            }
        }
    });
});
