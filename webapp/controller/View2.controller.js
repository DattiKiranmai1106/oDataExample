sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.sap.kt.ods.odataexample.controller.View2", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteView2").attachMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function (oEvent) {
                var sArg = oEvent.getParameter("arguments").foodID;
                var oList = this.getView().byId("listId");
                var oTemplate = this.getView().byId("objectListItemId");

                var url = "/Categories("+sArg+")/Products";
                oList.bindItems(url, oTemplate);

            },

            
            handlePress:function(oEvent){
                var oView = this.getView();
                var sSelectProduct = oEvent.getSource().getBindingContext().getObject().ID;
                console.log(sSelectProduct);
                var sPath = "/Products(" + sSelectProduct +")/Supplier"
                var oModel = this.getOwnerComponent().getModel();
                oModel.read(sPath, {
                    success:function(oData) {
                      //  console.log(oData);
                        var oJsonModel = new sap.ui.model.json.JSONModel(oData);
                        this.getView().setModel(oJsonModel,"oJsonModel");

                    }.bind(this),
                    error:function(oError) {
                       // console.log(oError);
                    }.bind(this)
                });
                if (!this.oDialog) {
                    this.oDialog = sap.ui.core.Fragment.load({
                        name: "com.sap.kt.ods.odataexample.fragment.foodtable",
                        controller: this
                    }).then(function (oDialog) {
                        this.oDialog = oDialog;
                        oView.addDependent(this.oDialog);
                        this.oDialog.open();
                    }.bind(this));
                } else {
                    this.oDialog.open();
                }
            },
            onPressSave:function(){
                this.oDialog.close();
            },
            onPressnavButton: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView1");
            },
            onPressDeleteview2:function(oEvent){
               // var valuePath=oEvent.getSource().getBindingContext().getObject().ID;
               var valuePath=oEvent.getParameter("listItem").getBindingContext().getPath();
               console.log(valuePath);
                var oModel = this.getOwnerComponent().getModel();
                oModel.bUseBatch=false;
                oModel.remove(valuePath, {
                    success: function (oData1) {
                        console.log(oData1);
                        sap.m.MessageBox.success("Successfully Deleted");
                    },
                    error: function (oError) {
                        sap.m.MessageBox.error("Failed");
                    }
                });
            },
            OnPressUpdateView2:function(oEvent){
                this.sPath=oEvent.getSource().getBindingContext().getPath();
                var oName=oEvent.getSource().getBindingContext().getObject().Name;
                var oDesc=oEvent.getSource().getBindingContext().getObject().Description;
                var oPri=oEvent.getSource().getBindingContext().getObject().Price;
                var oDate=oEvent.getSource().getBindingContext().getObject().ReleaseDate;
                var oRat=oEvent.getSource().getBindingContext().getObject().Rating;
                var oView = this.getView();
                if (!this.oCat) {
                    this.oCat = sap.ui.core.Fragment.load({
                        name: "com.sap.kt.ods.odataexample.fragment.updateprodu",
                        controller: this
                    }).then(function (oCat) {
                        this.oCat = oCat;
                        oView.addDependent(this.oCat);
                        this.oCat.open();
                        sap.ui.getCore().byId("upFragName").setValue(oName);
                        sap.ui.getCore().byId("upFragDesc").setValue(oDesc);
                        sap.ui.getCore().byId("upFragPrice").setValue(oPri);
                        sap.ui.getCore().byId("upFragDate").setValue(oDate);
                        sap.ui.getCore().byId("upFragRat").setValue(oRat);
                    }.bind(this));
                } else {
                    this.oCat.open();
                    sap.ui.getCore().byId("upFragName").setValue(oName);
                    sap.ui.getCore().byId("upFragDesc").setValue(oDesc);
                    sap.ui.getCore().byId("upFragPrice").setValue(oPri);
                    sap.ui.getCore().byId("upFragDate").setValue(oDate);
                    sap.ui.getCore().byId("upFragRat").setValue(oRat);
                }
             },
             onPressSaveUpdateview2:function(oEvent){
                var valuePath1=this.sPath;
                var oModel1 = this.getOwnerComponent().getModel();
                var name=sap.ui.getCore().byId("upFragName").getValue();
                var desc=sap.ui.getCore().byId("upFragDesc").getValue();
                var price=sap.ui.getCore().byId("upFragPrice").getValue();
                var date=sap.ui.getCore().byId("upFragDate").getValue();
                var rating=sap.ui.getCore().byId("upFragRat").getValue();
                oModel1.bUseBatch=false;
                var data={
                    "Name":name,
                    "Description":desc,
                    "Price":price,
                    "ReleaseDate":date,
                    "Rating":rating
                }
                oModel1.update(valuePath1,data,{
                    success: function (oData2) {
                        console.log(oData2);
                        sap.m.MessageBox.success("Successfully ");
                        this.oCat.close();
                    }.bind(this),
                    error: function (oError1) {
                        sap.m.MessageBox.error("Failed");
                    }
                });
            }
        });
    });