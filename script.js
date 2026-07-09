const screenButtons = document.querySelectorAll("[data-screen]");
const screens = document.querySelectorAll(".screen");
const backButton = document.getElementById("homeBackBtn");

function showScreen(screenId){

    screens.forEach(screen=>{
        screen.classList.remove("active");
    });

    document.getElementById(screenId).classList.add("active");

    if(screenId==="home"){
        document.body.classList.add("homeActive");
    }else{
        document.body.classList.remove("homeActive");
    }
}

screenButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        showScreen(button.dataset.screen);
    });
});

const accordionHeaders=document.querySelectorAll(".accordionHeader");

accordionHeaders.forEach(header=>{

    header.addEventListener("click",()=>{

        const item=header.parentElement;

        item.classList.toggle("open");

    });

});

showScreen("home");
