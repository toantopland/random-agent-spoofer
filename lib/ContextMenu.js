var cm = require("sdk/context-menu");
    PrefServ = require("./PrefServ"),
    Data = require("./Data"),
    Ras = require("./Ras"),
    labels = ["Disable RAS","Enable RAS"],
    parentMenu = null,
    menuItems = null,
    platformItems = null,
    timerItems = null; 


var toggle = cm.Item({
    image: Data.get("images/on.png"),
    label: labels[0],
    data: "toggle"
});

var def = cm.Item({
    label: "Default",
    image: Data.get("images/selected.png"),
    data: "default"
});

var rand = cm.Item({
    label: "Random All",
    image: Data.get("images/notselected.png"),
    data: "random"
});

var rand_desk = cm.Item({
    label: "Random Desktop",
    image: Data.get("images/notselected.png"),
    data: "random_desktop"
});

var rand_plat = cm.Menu({
    label: "Random Platform",
    image: Data.get("images/icon.png"),
    items: []
});

var timer = cm.Menu({
    label: "Timer",
    image: Data.get("images/timer.png"),
    items: [
        cm.Item({ image: Data.get("images/selected.png"), label: "No Timer", data: "none" }),
        cm.Item({ image: Data.get("images/notselected.png"), label: "Per Request", data: "request" }),
        cm.Item({ image: Data.get("images/notselected.png"), label: "Random", data: "randomTime" }),
        cm.Item({ image: Data.get("images/notselected.png"), label: "1 Min", data: "1" }),
        cm.Item({ image: Data.get("images/notselected.png"), label: "5 Mins", data: "5" }),
        cm.Item({ image: Data.get("images/notselected.png"), label: "10 Mins", data: "10" }),
        cm.Item({ image: Data.get("images/notselected.png"), label: "20 Mins", data: "20" }),
        cm.Item({ image: Data.get("images/notselected.png"), label: "30 Mins", data: "30" }),
        cm.Item({ image: Data.get("images/notselected.png"), label: "40 Mins", data: "40" }),
        cm.Item({ image: Data.get("images/notselected.png"), label: "50 Mins", data: "50" }),
        cm.Item({ image: Data.get("images/notselected.png"), label: "60 Mins", data: "60" })
      ]
});

var Menu = cm.Menu({
    label: "Random Agent Spoofer",
    image: Data.get("images/icon.png"),
    contentScriptFile: Data.get("js/itemSelection.js"),
    items: [toggle,cm.Separator(),def,rand,rand_desk,rand_plat,cm.Separator(),timer],
    onMessage:function (data){

        if (data === "toggle"){
            Ras.toggleAddonState();
        }else if (data === "default" || data === "random" || data.slice(0,7) === "random_"){
            PrefServ.setter("extensions.agentSpoof.uaChosen",data);
        }else{   //set time
            PrefServ.setter("extensions.agentSpoof.timeInterval",data);
        }
    }
});


exports.toggleIconAndLabel = function(){
    
    if(PrefServ.getter("extensions.agentSpoof.enabled") == true){
        
        toggle.image = Data.get("images/on.png");
        toggle.label = labels[0];
    
    }else{

        toggle.image = Data.get("images/off.png");
        toggle.label = labels[1];
    }
};

exports.setProfileIcons = function(profile){
    
    var items = rand_plat.items;
    items.push(def,rand,rand_desk);

    for (var i=0; i< items.length; i++){
        if(items[i].data === profile)
            items[i].image = Data.get("images/selected.png");
        else
            items[i].image = Data.get("images/notselected.png");
    }
};

exports.setTimerIcons = function(interval){

    for (var i=0; i< timer.items.length; i++){
        if(timer.items[i].data === interval)
            timer.items[i].image = Data.get("images/selected.png");
        else
            timer.items[i].image = Data.get("images/notselected.png");
    }
};

exports.setPlatformItems = function(items){

    for (var i =0; i< items.length; i++){
        rand_plat.addItem(cm.Item(items[i]));
    }


}; 

exports.showMenu = function(isShown){
    if (isShown === false){
        //remove RAS menu

        //backup menuitems and get parent reference menu
        parentMenu = Menu.parentMenu;
        menuItems = Menu.items;
        platformItems = rand_plat.items;
        timerItems = timer.items; 

        parentMenu.removeItem(Menu);

    }
    else if (isShown ===  true && menuItems !== null){
        //add RAS menu

        //restore menu and items
        parentMenu.addItem(Menu);
        Menu.items = menuItems;
        rand_plat.items = platformItems;
        timer.items = timerItems;

        //set values to null 
        menuItems = null;
        platformItems = null;
        timerItems = null;
        
    }
}

