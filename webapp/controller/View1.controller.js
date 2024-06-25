sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.sap.kt.ods.odataexample.controller.View1", {
            onInit: function () {
                var jsonProData = [];
                var oModelData = new sap.ui.model.json.JSONModel(jsonProData);
                this.getView().setModel(oModelData, "oModelDataPro");
                this.supId=1;
                this.supId1=11;
            },
            onPressList: function (oEvent) {
                var sPath = oEvent.getSource().getBindingContext().getObject().ID;
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView2", {
                    foodID: sPath
                });

            },
            onHandlePressCount: function (oEvent) {
                debugger
                var sPath1 = oEvent.getSource().getBindingContext().getObject().ID;
                var sArgs = "/Categories(" + sPath1 + ")/Products/$count";
                var oModel = this.getOwnerComponent().getModel();
                oModel.read(sArgs, {
                    success: function (oData) {

                        sap.m.MessageToast.show("products count in Categorie " + sPath1 + " is " + oData);
                    },
                    error: function (oError) {
                        sap.m.MessageToast.show("Something is error");
                    }
                })

            },
            onHandlePressOk: function () {
                var oinput = this.getView().byId("inputId").getValue();
                var oFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, oinput);
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/Products", {
                    filters: [oFilter],
                    success: function (oData1) {
                        console.log(oData1);
                        sap.m.MessageToast.show("The product Name is: " + oData1.results[0].Name);
                    },
                    error: function (oError) {
                        sap.m.MessageToast.show("Something is error");
                    }
                });
            },
            onHandlePressOk1: function () {
                var oView = this.getView();
                var oinput1 = this.getView().byId("inputId1").getValue();
                var oFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, oinput1)
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/Categories", {
                    urlParameters: { "$expand": "Products" }, 
                    filters: [oFilter],
                    success: function (oData2) {
                        // console.log(oData2);
                        oData2.results[0].Products = oData2.results[0].Products.sort((a, b) => {
                            return b.ID - a.ID
                        })
                        var oModel1 = new sap.ui.model.json.JSONModel(oData2.results[0].Products);
                        this.getView().setModel(oModel1, "modelData1");
                        if (!this.oDi) {
                            this.oDi = sap.ui.core.Fragment.load({
                                name: "com.sap.kt.ods.odataexample.fragment.products",
                                controller: this
                            }).then(function (oDi) {
                                this.oDi = oDi;
                                oView.addDependent(this.oDi);
                                this.oDi.open();
                            }.bind(this));
                        } else {
                            this.oDi.open();
                        }
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageToast.show("Something is error");
                    }.bind(this)
                });

            },
            onPressClose: function () {
                this.oDi.close();
            },
            onPressCat: function () {

                // var oModel=this.getOwnerComponent().getModel();
                // console.log(oModel);
                // oModel.bUseBatch=false;
                // var jsonData={
                //     "ID":oModel.constructor.length+1,
                //     "Name":"Mobile"
                // }
                // oModel.create("/Categories",jsonData,{
                //     success:function(oData){
                //         console.log(oData);
                //     },
                //     error:function(oError){
                //         console.log(oError);
                //     }
                // });
                var oView = this.getView();
                if (!this.oDialog) {
                    this.oDialog = sap.ui.core.Fragment.load({
                        name: "com.sap.kt.ods.odataexample.fragment.createdata",
                        controller: this
                    }).then(function (oDialog) {
                        this.oDialog = oDialog;
                        oView.addDependent(this.oDialog);
                        this.oDialog.open();
                        var len = this.getView().byId("list").getItems().length;
                        sap.ui.getCore().byId("inputId4").setValue(len);
                    }.bind(this));
                } else {
                    this.oDialog.open();
                    var len = this.getView().byId("list").getItems().length;
                    sap.ui.getCore().byId("inputId4").setValue(len);
                    sap.ui.getCore().byId("inputId3").setValue(" ");

                }
            },
            onPressSave3: function () {
                var oModel = this.getOwnerComponent().getModel();
                oModel.bUseBatch = false;
                var name = sap.ui.getCore().byId("inputId3").getValue();
                var len = this.getView().byId("list").getItems().length;

                //var len2=sap.ui.getCore().byId("inputId4").getValue();
                //   var omodel3=new sap.ui.model.json.JSONModel(len2);
                // this.getView().setModel(omodel3,"oModelData3")
                if(!name){
                    sap.ui.getCore().byId("inputId3").setValueState("Error");
                    sap.ui.getCore().byId("inputId3").setValueStateText("Enter the Name Of Cat");
                }else{
                sap.ui.getCore().byId("inputId3").setValueState("None");
                var jsonData = {
                    "ID": len,
                    "Name": name
                }
                oModel.create("/Categories", jsonData, {
                    success: function (oData) {
                        console.log(oData);
                        sap.m.MessageBox.success("Created successfully");
                        this.oDialog.close();
                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                        sap.m.MessageBox.error("Falied");
                    }
                });
                }
            },
            onPressClose3: function () {
                this.oDialog.close();
            },
            onHandlePressproduct: function () {
                var oView = this.getView();
                if (!this.oProducts) {
                    this.oProducts = sap.ui.core.Fragment.load({
                        name: "com.sap.kt.ods.odataexample.fragment.productexpand",
                        controller: this
                    }).then(function (oProducts) {
                        this.oProducts = oProducts;
                        oView.addDependent(this.oProducts);
                        this.oProducts.open();
                        var len = this.getView().byId("list").getItems().length;
                        sap.ui.getCore().byId("inputId6").setValue(len);
                    }.bind(this));
                } else {
                    this.oProducts.open();
                    this.getView().getModel("oModelDataPro").setData(" ");
                    var len = this.getView().byId("list").getItems().length;
                    sap.ui.getCore().byId("inputId6").setValue(len);
                    sap.ui.getCore().byId("inputId5").setValue(" ");
                }
            },
            onPressSave4: function () {

                var name = sap.ui.getCore().byId("inputId5").getValue();
                var len = this.getView().byId("list").getItems().length;
                var oJsonData = this.getView().getModel("oModelDataPro");
                // var oJsonData1 = oJsonData.getData().length;
                if(!name){
                    sap.ui.getCore().byId("inputId5").setValueState("Error");
                    sap.ui.getCore().byId("inputId5").setValueStateText("Enter the Name Of Cat");
                }
                else{
                sap.ui.getCore().byId("inputId5").setValueState("None");
                var jsonObject = []
                for (let i = 0; i <  oJsonData.getData().length; i++) {
                    var id = oJsonData.getData()[i].ID;
                    var name1 = oJsonData.getData()[i].Name;
                    var descrip = oJsonData.getData()[i].Description;
                    var price = oJsonData.getData()[i].Price;
                    var releaseDate = oJsonData.getData()[i].ReleaseDate;
                    var rating = oJsonData.getData()[i].Rating;
                    var osuppId=oJsonData.getData()[i].Supplier.ID;
                    var oSuppName=oJsonData.getData()[i].Supplier.Name;
                   // var osuppAddCity=sap.ui.getCore().byId("inputFragId10").getValue();
                    var osuppAddCity=oJsonData.getData()[i].Supplier.Address.City;
                    var osuppAddStreet=oJsonData.getData()[i].Supplier.Address.Street;
                    var osuppAddState=oJsonData.getData()[i].Supplier.Address.State;
                    var osuppAddZip=oJsonData.getData()[i].Supplier.Address.ZipCode;
                    var osuppAddcoun=oJsonData.getData()[i].Supplier.Address.Country;
                   
                    jsonObject.push({
                        "ID": id,
                        "Name": name1,
                        "Description": descrip,
                        "Price": price,
                        "ReleaseDate": releaseDate,
                        "Rating": parseInt(rating),
                        "Supplier":{
                            "ID":osuppId,
                            "Name":oSuppName,
                            "Address":{
                                "Street":osuppAddStreet,
                                "City":osuppAddCity,
                                "State":osuppAddState,
                                "ZipCode":osuppAddZip,
                                "Country":osuppAddcoun
                            }
                        }
                    })
                }
                var oModel = this.getOwnerComponent().getModel();
                oModel.bUseBatch = false;
                var jsonData1 = {
                    "ID": len,
                    "Name": name,
                    "Products": jsonObject
                }
                oModel.create("/Categories", jsonData1, {
                    success: function (oData) {
                        console.log(oData);
                        this.getOwnerComponent().getModel().refresh()
                        sap.m.MessageBox.success("Created successfully");
                        this.oProducts.close();
                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                        sap.m.MessageBox.error("Falied");
                    }
                });
                }
            },
            
            onPressADDProductFrag: function () {
                var oModelPro = this.getView().getModel("oModelDataPro");
                var oDataPro = oModelPro.getProperty("/");
                var len = this.getView().byId("list").getItems().length;
                
                var num=len*10+this.supId;
                this.supId++;

                var num2=len*100+this.supId1;
                this.supId1+=11;
                
                oDataPro.push({
                    "ID":num2,
                    "Name": "",
                    "Description": "",
                    "Price": "",
                    "ReleaseDate": "",
                    "Rating": "",
                    "Supplier":{
                        "ID":num,
                        "Name":"",
                        "Address":{
                            "Street":"",
                            "City":"",
                            "State":"",
                            "ZipCode":"",
                            "Country":""
                        }
                    }
                });
                oModelPro.refresh()
            },
            onPressClose4: function () {
                this.oProducts.close();
            },
            onPressDeleteview1:function(oEvent){
                // var valuePath=oEvent.getSource().getBindingContext().getObject().ID;
                var valuePath1=oEvent.getParameter("listItem").getBindingContext().getPath();
                //console.log(valuePath1);
                 var oModel = this.getOwnerComponent().getModel();
                 oModel.bUseBatch=false;
                 oModel.remove(valuePath1, {
                     success: function (oData1) {
                         console.log(oData1);
                         sap.m.MessageBox.success("Successfully Deleted");
                     },
                     error: function (oError) {
                         sap.m.MessageBox.error("Failed");
                     }
                 });
             },
             OnPressUpdateView1:function(oEvent){
                this.sPath=oEvent.getSource().getBindingContext().getPath();
                var oName=oEvent.getSource().getBindingContext().getObject().Name;
                var oView = this.getView();
                if (!this.oCat) {
                    this.oCat = sap.ui.core.Fragment.load({
                        name: "com.sap.kt.ods.odataexample.fragment.updatecat",
                        controller: this
                    }).then(function (oCat) {
                        this.oCat = oCat;
                        oView.addDependent(this.oCat);
                        this.oCat.open();
                        sap.ui.getCore().byId("upFragId").setValue(oName);
                    }.bind(this));
                } else {
                    this.oCat.open();
                    sap.ui.getCore().byId("upFragId").setValue(oName);
                }
             },
             onPressSaveUpdate:function(oEvent){
                var valuePath2=this.sPath;
                //console.log(valuePath2);
                 var oModel = this.getOwnerComponent().getModel();
                 oModel.bUseBatch=false;
                 var nam=sap.ui.getCore().byId("upFragId").getValue();
                 var data={
                    "Name":nam
                 }
                 oModel.update(valuePath2,data, {
                     success: function (oData2) {
                        // console.log(oData2);
                         sap.m.MessageBox.success("Successfully update");
                         this.oCat.close();
                        
                     }.bind(this),
                     error: function (oError) {
                         sap.m.MessageBox.error("Failed");
                     }
                 });
             }
        });
    });
