var AuthAssistant=Class.create({
	
initialize: function(APIobj) {
    
this.authInfo={};
this.serviceAPI=APIobj;
this._handleAuthButton=this.handleAuthButton.bindAsEventListener(this);
this.serviceName=service;
    
},

setup: function() {
    this.controller.get("AuthStatus").innerHTML=$L("Fetching Authentication Token");
    this.spinnerModel= {
	spinning:  true,
	spinnerSize: 'Mojo.Widget.spinnerSmall'
	}; 
	this.controller.setupWidget('authSpinner', this.spinnerModel);
	this.authSpinner=this.controller.get('authSpinner');
        this.controller.instantiateChildWidgets(this.authSpinner.up());
        this.authSpinner.mojo.start();
       
    switch (this.serviceName){
        case 'picassa':
	     oauth={key: 'YOUR_KEY', secret: 'YOUR_SECRET', callback:"YOUR_CALLBACK"}
	     args={scope:"http://picasaweb.google.com/data/",xoauth_displayname:"APP_NAME"}
            this.oauth=new OAuth('google',oauth,args,this,this.handleOAuth.bind(this));
	    break
        case 'photobucket':
            oauth={key: 'YOUR_KEY', secret: 'YOUR_SECRET', callback:"YOUR_CALLBACK"}
	    args={format:'json'}
            this.oauth=new OAuth('photobucket',oauth,args,this,this.handleOAuth.bind(this));
    }

},

handleOAuth: function(o) {
    if (o.success) {
    switch(o.service) {
	case 'google':
	    this.authInfo.googleInfo={};
            this.authInfo.googleInfo.token=o.token;
            this.authInfo.googleInfo.secret=o.secret;
	    this.controller.stageController.popScene({ authenticated: true,service: o.service });
	    break
	case 'photobucket':
	    this.authInfo.pbInfo={};
            this.authInfo.pbInfo.token=o.token;
            this.authInfo.pbInfo.secret=o.secret;
	    this.controller.stageController.popScene({ authenticated: true,service: o.service });
	    break
    }
	    
    Mojo.Log.info('<<<<<<<Oauth Complete!!!')
    }
    else {
	this.handleError(o);
    }
    
    
},


handleError: function(o){
    //Not informative, add a dialog or something appropriate for your app
    Mojo.Log.error('<<<<<<Token Error>>>>>>')
    
},




activate: function(event) {
   this.controller.listen('authOK',Mojo.Event.tap,this._handleAuthButton)

},


deactivate: function(event) {
   this.controller.stopListening('authOK',Mojo.Event.tap,this._handleAuthButton)
   

},


cleanup: function(event) {
	
}

})