const addNote = document.querySelector(".add-note"),
popupBox = document.querySelector(".popup-box"),
popupTitle = document.querySelector("header p"),
noteContent = document.querySelector(".content"),
close = document.querySelector("header i"),
// showNote = document.querySelector("litag"),
showNoteContentBox = document.querySelector(".show-noteContentBox"),
showNoteTitle = document.querySelector(".note-header p"),
showNoteDescription = document.querySelector(".n-desc"),
showNoteDate = document.querySelector(".note-date li span"),
showNoteClose = document.querySelector(".note-header i"),
title = document.querySelector("input"),
description = document.querySelector("textarea"),
addBtn = document.querySelector("button");

const months = ["January", "February", "March", "April", "May",
                "June", "July", "August", "September", "October", "November", "December"];
//getting localstorage note; if exists and then parsing them to js object else parsing an empty array to notes
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, UpdateId;

addNote.addEventListener("click", ()=>{
    title.focus();  // focus() will make the cursor visible automatically
    popupBox.classList.add("show");
});

close.addEventListener("click", ()=>{
    isUpdate = false;
    title.value = "";
    description.value = "";
    popupTitle.innerText = "Add a Note";
    popupBox.classList.remove("show");
    noteContent.classList.remove("error");
});


function showNotes(){
    document.querySelectorAll(".note").forEach(note => note.remove());
    notes.forEach((note, index) => {
        console.log(note);
        let liTag =      `<li class="note">
                                <div class="pin-icon"><img src="img/pin_trsp1.png"></div>
                                <div class="details" onclick="showFullNote(${index})">
                                <p class="title">${note.title}</p>
                                </div>
                                <div class="date">
                                <span>${note.date}</span>
                                <div class="settings">
                                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                    <ul class="menu">
                                    <li onclick="editNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
                                    </ul>
                                </div>
                                </div>
                            </li>`;

        addNote.insertAdjacentHTML("afterend", liTag);
    });
}

showNotes();

function showFullNote(index) {
    const note = notes[index];
    if (showNoteContentBox && showNoteTitle && showNoteDescription) {
        showNoteTitle.innerText = note.title;
        showNoteDescription.innerText = note.description;
        showNoteDate.innerText = note.date;
        showNoteContentBox.classList.add("show");
    } else {
        console.error("showNoteContentBox or its child elements not found.");
    }
}

showNoteClose.addEventListener("click", () => {
    showNoteContentBox.classList.remove("show");
});




// showing menu ffor edit and delete
function showMenu(element){
    // console.log(element.parentElement);
    element.parentElement.classList.add("show");
    // touching doucment, it will hide menu button
    document.addEventListener("click", event => {
        if(event.target.tagName != "I" || event.target != element){
            element.parentElement.classList.remove("show");
        }
    });
}

function editNote(noteId, tlt, desc){
    console.log("Edited note with noteId: "+noteId+"\ntitle was: "+title+"\ndescription was: "+description);
    isUpdate = true;
    UpdateId = noteId;
    addNote.click();
    popupTitle.innerText = "Update Note";
    title.value = tlt;
    description.value = desc;
}

function deleteNote(noteId){
    // console.log("deleted note with noteId: ",noteId);
    notes.splice(noteId, 1); //removing selected note from array
    localStorage.setItem("notes", JSON.stringify(notes)); // saving notes to localStorage
    showNotes();
}


addBtn.addEventListener("click", e =>{
    e.preventDefault();
    let addNoteTitle = title.value,
    addNoteDescription = description.value;

    if(addNoteTitle || addNoteDescription){
        let dateObj = new Date();
        let month = months[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear();
    
        let noteInfo = {
            title: addNoteTitle, description: addNoteDescription,
            date: `${month} ${day}, ${year}`
        }

        console.log(addNoteTitle, addNoteDescription);
        console.log(month, day, year);
        console.log(noteInfo);

        if(!isUpdate){
            notes.push(noteInfo); //adding new note to notes
        }else{
            notes[UpdateId] = noteInfo;
        }
        
        
        // saving notes in localstorage
        localStorage.setItem("notes", JSON.stringify(notes));

        showNotes();
        //after adding, previous value should be cleared.
        title.value = "";
        description.value = "";

        // //popup box should be closed.
        // popupBox.classList.remove("show");

        // //if any error occured previously, it would also remove.
        // noteContent.classList.remove("error")
        close.click();
    }else{
        noteContent.classList.add("error");
        document.addEventListener("click", event=>{
            if(event.target.tagName == "INPUT" || event.target.tagName == "TEXTAREA"){
                noteContent.classList.remove("error");
            }
        })
    }
});