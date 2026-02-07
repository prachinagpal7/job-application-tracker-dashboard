const dataOfUser = localStorage.getItem('userStoredData')
if (!dataOfUser) {
    window.location.href = "/auth/auth.html";
}

const user = JSON.parse(dataOfUser);

const welcomeText = document.querySelector("#header-left p");
welcomeText.textContent = `Welcome, ${user.myName}!`;

const signOutBtn = document.getElementById("btn-outline");
signOutBtn.addEventListener("click", function(){
    localStorage.removeItem("userStoredData");
    window.location.href = "/auth/auth.html";
});

const openBtn = document.querySelector('#btn-primary');
const modall = document.querySelector("#applicationModal");
const cancelBtn = document.querySelector('#cancel-btn');
const crossBtn = document.querySelector('#closeModal');

openBtn.addEventListener('click', function(e){
    editIndex = null;
    document.querySelector('#modal-header h2').textContent = "Add New Application";
    addApp.reset();
    modall.classList.remove("hidden");
});

cancelBtn.addEventListener('click', function(e){
    modall.classList.add("hidden");
});

crossBtn.addEventListener('click', function(e){
    modall.classList.add("hidden");
});

const addApp = document.querySelector('#applicationForm');

function renderApplications(){
    const appList = document.querySelector('#applications-list');
    const mainSection = document.querySelector('#theMainSection');
    const user = JSON.parse(localStorage.getItem('userStoredData'));
    const noAppSection = document.querySelector('#no-app-section');

    mainSection.innerHTML = "";

    if (!user || !user.myApplications || user.myApplications.length === 0) {
        noAppSection.classList.remove("hide-empty-section");
        appList.classList.add("hide-list-section");
        return;
    }
    
    noAppSection.classList.add("hide-empty-section");
    appList.classList.remove("hide-list-section");

    user.myApplications.forEach(function(app, index) {

        const card = document.createElement("div");
        card.className = "application-card";
        card.dataset.index = index;

        card.innerHTML = `
            <div class="first-thing">
                <div>
                    <div><i class="fa-regular fa-building"></i> <span class="itsCompany">${app.myCompanyName}</span></div>
                    <p class="itsJobTitle">${app.myJobTitle}</p>
                </div>
                <div class="actions">
                    <button class="editBtn" onclick="editButton(${index})"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="deleteBtn" onclick="deleteButton(${index})"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>
            
            <div class="second-thing">
                <span class="itsStatus">${app.myStatus}</span> 
                <span class="itsJobType">${app.myJobType}</span>
                <i class="fa-regular fa-calendar"></i><span class="itsDate">${app.myApplicationDate || ""}</span>
            </div> 
            <div class="third-thing">
                <div><p>Notes:</p><span class="itsNotes">${app.myNotes || ""}</span></div>
                <div><p>Resume Used:</p><span class="itsResume">${app.myResumeUsed || ""}</span></div>
            </div>   
        `;
        mainSection.appendChild(card);
    });

    updateStats();
}

function updateStats(){
    const user = JSON.parse(localStorage.getItem('userStoredData'));
    const firstBlock = document.querySelector('.block1 h2');
    const secondBlock = document.querySelector('.block2 h2');
    const thirdBlock = document.querySelector('.block3 h2');
    const fourthBlock = document.querySelector('.block4 h2');
    const recentBlock = document.querySelector('.app-header p');

    if (!user || !Array.isArray(user.myApplications)) return;

    let pCount = 0, iCount = 0, rCount = 0;
    user.myApplications.forEach(function(app) {
        if(app.myStatus === "offer"){
            pCount++;
        }
        else if(app.myStatus === "interview"){
            iCount++;
        }
        else if(app.myStatus === "rejected"){
            rCount++;
        }
    });
    firstBlock.textContent = user.myApplications.length;
    recentBlock.textContent = `${user.myApplications.length} total applications`;
    secondBlock.textContent = pCount;
    thirdBlock.textContent = iCount;
    fourthBlock.textContent = rCount;
    
}

function deleteButton(index){
    const user = JSON.parse(localStorage.getItem('userStoredData'));
    user.myApplications.splice(index, 1);
    localStorage.setItem('userStoredData', JSON.stringify(user));
    renderApplications();
}

let editIndex = null;

function editButton(index){
    const modalHeader = document.querySelector('#modal-header h2');
    const user = JSON.parse(localStorage.getItem('userStoredData'));
    const app = user.myApplications[index];

    editIndex = index;

    modalHeader.textContent = "Edit Application";
    modall.classList.remove("hidden");

    document.querySelector('#companyName').value = app.myCompanyName;
    document.querySelector('#jobTitle').value = app.myJobTitle;
    document.querySelector('#jobType').value = app.myJobType;
    document.querySelector('#status').value = app.myStatus;
    document.querySelector('#applicationDate').value = app.myApplicationDate || "";
    document.querySelector('#resumeUsed').value = app.myResumeUsed || "";
    document.querySelector('#notes').value = app.myNotes || "";
}

addApp.addEventListener("submit", function(e){
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('userStoredData'));

    let inputCompanyName = document.querySelector('#companyName');
    let inputJobTitle = document.querySelector('#jobTitle');
    let inputJobType = document.querySelector('#jobType');
    let inputStatus = document.querySelector('#status');
    let inputApplicationDate = document.querySelector('#applicationDate');
    let inputResumeUsed = document.querySelector('#resumeUsed');
    let inputNotes = document.querySelector('#notes');

    if (!inputCompanyName || !inputJobTitle) {
        alert("Company name and job title are required");
        return;
    }

    const applicationData = {
        id: editIndex !== null ? user.myApplications[editIndex].id : Date.now(),
        myCompanyName: inputCompanyName.value.trim(),
        myJobTitle: inputJobTitle.value.trim(),
        myJobType: inputJobType.value.trim(),
        myStatus: inputStatus.value.trim(),
        myApplicationDate: inputApplicationDate.value.trim(),
        myResumeUsed: inputResumeUsed.value.trim(),
        myNotes: inputNotes.value.trim(),
    }

    if (editIndex !== null) {
        user.myApplications[editIndex] = applicationData;
        editIndex = null;
        document.querySelector('#modal-header h2').textContent = "Add New Application";
    } else {
        user.myApplications.push(applicationData);
    }

    localStorage.setItem("userStoredData", JSON.stringify(user));

    addApp.reset();
    modall.classList.add("hidden");
    renderApplications();
});

renderApplications();