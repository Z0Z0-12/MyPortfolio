var tabLinks = document.getElementsByClassName("tab-links")
var tabContents = document.getElementsByClassName("tab-contents")

function opentab(tabName, element){
    for (let tabLink of tabLinks){
        tabLink.classList.remove("active-link");
    }

    for (let tabContent of tabContents){
        tabContent.classList.remove("active-tab");
    }

    element.classList.add("active-link");
    setTimeout(function (){
        document.getElementById(tabName).classList.add("active-tab");
    }, 100)
}

var sidemenu = document.getElementById("sidemenu");

function openmenu(){
    sidemenu.style.right = "0";
}

function closemenu(){
    sidemenu.style.right = "-200px";
}
