sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageToast, MessageBox, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("ehsm.controller.Login", {
        onInit: function () {
            // Keep session state in a global model or local to the app
            // We'll create a session model on the component if it doesn't exist
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
            var sUserId = this.getView().byId("userIdInput").getValue();
            var sPassword = this.getView().byId("passwordInput").getValue();

            if (!sUserId || !sPassword) {
                MessageToast.show("Please enter both User ID and Password.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();

            // Assuming Z780_LOGIN is an EntitySet we can Read with filters
            // Or typically a key based read if EmpId is the key. 
            // The prompt implies "calling GET ... validating field Status"
            // We will Try to use filters for authentication simulation if the backend supports it,
            // or we might need to construct a Key if it was /Z780_LOGIN('id'). 
            // Given "calling the GET OData service /Z780_LOGIN" usually implies the set.
            // We will use filters.

            var aFilters = [
                new Filter("user_id", FilterOperator.EQ, sUserId),
                new Filter("Password", FilterOperator.EQ, sPassword)
            ];

            this.getView().setBusy(true);

            oModel.read("/Z780_LOGIN", {
                filters: aFilters,
                success: function (oData) {
                    this.getView().setBusy(false);
                    // Validate based on presence of user_id in the returned data
                    var aResults = oData.results;
                    if (aResults && aResults.length > 0) {
                        var oUserData = aResults[0];
                        if (oUserData.user_id) { // Check for user_id presence
                            MessageToast.show("Login Successful");

                            // Store in session
                            var oSessionModel = this.getOwnerComponent().getModel("session");
                            oSessionModel.setProperty("/UserId", sUserId);
                            oSessionModel.setProperty("/IsLoggedIn", true);

                            // Navigate
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("Dashboard");
                        } else {
                            MessageBox.error("Login failed: User ID not found.");
                        }
                    } else {
                        MessageBox.error("Login failed: Invalid credentials or user not found.");
                    }
                }.bind(this),
                error: function (oError) {
                    this.getView().setBusy(false);
                    MessageBox.error("An error occurred during login. Please try again.");
                }.bind(this)
            });
        }
    });
});
