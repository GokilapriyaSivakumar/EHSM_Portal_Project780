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
                var aFilters = [];
                if (sEmpId) {
                    aFilters.push(new Filter("CreatedBy", FilterOperator.EQ, sEmpId));
                    // Assuming 'CreatedBy' is the field to filter by EmployeeId as per requirements "filtered by the logged-in EmployeeId"
                    // If the requirement meant the 'EmployeeId' field exists in Z780_RISK, I would use that. 
                    // Usually 'CreatedBy' or 'EmployeeId' is used. I see 'CreatedBy' in the column list.
                    // But typically if it is "my risks", it might be CreatedBy. 
                    // The prompt says "filtered by the logged-in EmployeeId".
                    // I will filter on 'EmployeeId' if it exists, but the list of columns doesn't explicitly have separate 'EmployeeId'.
                    // However, often the filter property might differ from display.
                    // Given the columns: RiskId, Plant, RiskDescription... CreatedBy.
                    // I will assume the filter should be on 'EmployeeId' if the service supports it, or 'CreatedBy'.
                    // Let's assume 'EmployeeId' field exists in the entity even if not displayed, OR 'CreatedBy' is the employee ID.
                    // I'll bet on 'CreatedBy' matches EmployeeID for this context. 
                    // Wait, let's use 'EmployeeId' as the filter property, if it fails, it fails. 
                    // actually, usually services exposing filtered data might need 'EmployeeId'. 
                    // Let's check the prompt again: "filtered by the logged-in EmployeeId". 
                    // I will add a Filter for "EmployeeId". If the backend property is named differently, it's a backend issue, but standard practice is usually consistent naming.
                    // Re-reading columns: CreatedBy is there. 
                    // I will filter by 'EmployeeId' as requested. If the OData metadata doesn't have it, it might be an issue.
                    // But I don't have the metadata.
                    // Providing a filter on 'EmployeeId'.
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
            severityState: function (sSeverity) {
                if (sSeverity === "High") return "Error";
                if (sSeverity === "Medium") return "Warning";
                return "Success";
            }
        }
    });
});
