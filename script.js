var uid = new ShortUniqueId();
let addbtn = document.querySelector('.add-btn');
let modalCont = document.querySelector('.modal-cont');
let isModalPresent = false;
let priorityColorContArr = document.querySelectorAll('.priority-color');
let colorsArr = ["lightpink", "lightgreen", "lightblue", "black"];
let modalPriorityColor = colorsArr[colorsArr.length - 1]; //black
let textareaCont = document.querySelector('.textarea-cont');
let mainCont = document.querySelector('.main-cont');
const toolBoxColor = document.querySelectorAll('.color');
const removeBtn = document.querySelector('.remove-btn');
let isRemoveBtnClicked = false;



let ticketArr = [];

// to add and remove modal container
addbtn.addEventListener("click", function () {
    if (!isModalPresent) {
        modalCont.style.display = "flex";
    } else {
        modalCont.style.display = "none";
    }
    isModalPresent = !isModalPresent;
});
// to select a color by adding and removing active class from  modal container
priorityColorContArr.forEach(function (colorEle) {
    colorEle.addEventListener("click", function (e) {
        priorityColorContArr.forEach(function (colorEle) {
            colorEle.classList.remove("active");
        })
        e.currentTarget.classList.add("active");
        // colorEle.classList.add("active");
        modalPriorityColor = colorEle.classList[0];
    })
});

// On click of Enter in textarea must create a new ticket
modalCont.addEventListener("keydown", function (e) {
    if (!e.getModifierState("Shift") && e.key == "Enter") {
        createTicket(modalPriorityColor, textareaCont.value);
        textareaCont.value = "";
        modalCont.style.display = "none";
        isModalPresent = false;
        modalPriorityColor = colorsArr[colorsArr.length - 1];
        priorityColorContArr.forEach(function (colorEle) {
            colorEle.classList.remove("active");
        })
    }

})

//function to create a ticket
function createTicket(ticketColor, data, ticketID) {
    let id = ticketID || uid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${id}</div>
        <div class="task-area">${data}</div>
        <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>
    `
    mainCont.appendChild(ticketCont);
    handleRemoval(ticketCont, id);
    handleColor(ticketCont,id, data);
    handleLock(ticketCont,id);
    if (!ticketID) {
        ticketArr.push({ ticketColor, data, ticketID: id });
        localStorage.setItem("tickets", JSON.stringify(ticketArr));
    }
}

//get all tickets from local storage
if (localStorage.getItem('tickets')) {
    ticketArr = JSON.parse(localStorage.tickets);
    ticketArr.forEach(function (ticketObj) {
        createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketID);
    })
}

// on a click of a toolbox container color, only tickets of a particular type must be available
toolBoxColor.forEach(function (colorEle) {
    colorEle.addEventListener('click', function () {
        // console.log("clicked");
        let ticketsAvailable = document.querySelectorAll(".ticket-cont");
        let filteredColor = ticketArr.filter(function (ticketObj) {
            return ticketObj.ticketColor == colorEle.classList[0];
        })
        ticketsAvailable.forEach(function (ticket) {
            ticket.remove();
        })
        filteredColor.forEach(function (ticket) {
            createTicket(ticket.ticketColor, ticket.data, ticket.ticketID);
        })
    })

    // on double click of a color in toolbox container must display ticksts of all priority
    colorEle.addEventListener("dblclick", function () {
        let ticketsAvailable = document.querySelectorAll(".ticket-cont");
        ticketsAvailable.forEach(function (ticket) {
            ticket.remove();
        })

        ticketArr.forEach(function (ticketObj) {
            createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketID);
        })
    })
})
// remove button functionalities

removeBtn.addEventListener("click", function () {
    if (!isRemoveBtnClicked) {
        removeBtn.style.color = "red";
    } else {
        removeBtn.style.color = "#d1d8e0"
    }
    isRemoveBtnClicked = !isRemoveBtnClicked;
})

// handles the removal of a ticket we attach the event listener to the ticket when the ticket is created this will ensure that when we try to remove an element it has the required event listeneer attached

function handleRemoval(ticket, ticketId) {
    ticket.addEventListener("click", function () {
        if (isRemoveBtnClicked) {
            // console.log(e.currentTarget.innerText.split("\n")[0]);

            let idx = getIDX(ticketId);
            // console.log(idx);
            ticketArr.splice(idx, 1);
            ticket.remove();
            // console.log(ticketCont[i]);

            // console.log(ticketArr);
            localStorage.tickets = JSON.stringify(ticketArr);
        }
    })
}
// returns index of ticket inside local storage array 
function getIDX(id) {
    let idx = ticketArr.findIndex(function (ticketObj) {
        return ticketObj.ticketID == id;
    })
    return idx;
}

// change priority color of tickets

function handleColor(ticket,ticketID,data){
  ticket.children[0].addEventListener("click",function(){
    //   console.log("hi");
    let currColor = ticket.children[0].classList[1];
    let idxColor = colorsArr.indexOf(currColor);
    idxColor = (idxColor+1)%colorsArr.length;
    ticket.children[0].classList.remove(currColor);
    ticket.children[0].classList.add(colorsArr[idxColor]);
    console.log(ticketArr);
    let idx = getIDX(ticketID);
    ticketArr[idx].ticketColor = colorsArr[idxColor];
    // ticketArr.splice(idx,1,{ticketColor:colorsArr[idxColor],data,ticketID});
    console.log(ticketArr);
    localStorage.setItem("tickets",JSON.stringify(ticketArr));
  })
}
function handleLock(ticket, ticketID){
    let lockIcon = ticket.querySelector("i");
    let isLock = true;
    let taskArea = ticket.querySelector(".task-area");
    console.log(lockIcon.parentElement.parentElement);
    // console.log(lockIcon);
    lockIcon.addEventListener("click", function(){
        if(isLock){
        lockIcon.classList.remove("fa-lock");
        lockIcon.classList.add("fa-lock-open");
        taskArea.setAttribute("contenteditable","true");
        }else{
        lockIcon.classList.remove("fa-lock-open");
        lockIcon.classList.add("fa-lock");
        taskArea.setAttribute("contenteditable","false");
        let idx = getIDX(ticketID);
        console.log(ticketArr);
        ticketArr[idx].data = taskArea.innerText;
        localStorage.tickets = JSON.stringify(ticketArr);
        console.log(ticketArr);
        }
        isLock = !isLock;
    })
}