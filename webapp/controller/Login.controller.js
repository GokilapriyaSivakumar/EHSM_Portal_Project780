sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent"
], function (
    Controller,
    MessageToast,
    MessageBox,
    JSONModel,
    Filter,
    FilterOperator,
    UIComponent
) {
    "use strict";

    return Controller.extend("ehsm.controller.Login", {

        onInit: function () {
            var oComponent = this.getOwnerComponent();

            if (!oComponent.getModel("session")) {
                var oSessionModel = new JSONModel({
                    UserId: "",
                    IsLoggedIn: false
                });
                oComponent.setModel(oSessionModel, "session");
            }
        },

        onLogin: function () {
            var sUserId = this.byId("userIdInput").getValue();
            var sPassword = this.byId("passwordInput").getValue();

            if (!sUserId || !sPassword) {
                MessageToast.show("Please enter both User ID and Password");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            this.getView().setBusy(true);

            // ✅ USE CORRECT PROPERTY NAMES FROM METADATA
            var aFilters = [
                new Filter("user_id", FilterOperator.EQ, sUserId),
                new Filter("password", FilterOperator.EQ, sPassword)
            ];

            oModel.read("/Z780_LOGIN", {
                filters: aFilters,

                success: function (oData) {
                    this.getView().setBusy(false);

                    if (oData.results && oData.results.length > 0) {
                        var oUser = oData.results[0];

                        if (oUser.user_id) {
                            MessageToast.show("Login Successful");

                            // Store session
                            var oSessionModel = this.getOwnerComponent().getModel("session");
                            oSessionModel.setProperty("/UserId", oUser.user_id);
                            oSessionModel.setProperty("/IsLoggedIn", true);

                            // Navigate to Dashboard
                            UIComponent.getRouterFor(this).navTo("Dashboard");
                        } else {
                            MessageBox.error("Login failed: User not found");
                        }
                    } else {
                        MessageBox.error("Invalid User ID or Password");
                    }
                }.bind(this),

                error: function (oError) {
                    this.getView().setBusy(false);
                    MessageBox.error("Login failed due to backend error");
                }.bind(this)
            });
        }
    });
});
