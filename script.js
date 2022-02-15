class Animal {
    name;
    breed;
    age;
    gender;
    ownerName;
    image;
    id;

    constructor(name, breed, age, gender, owner, image,id) {
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.gender = gender;
        this.ownerName = owner;
        this.image = image;
        this.id = id;
    }
}


class FirebaseWorker {
    firebaseRef;

    constructor() {
        this.firebaseRef = firebase.firestore();
    }

    async addAnimal(animalItem,resultCheckLogic){
        try {
            var json = JSON.stringify(animalItem);
            var result = await this.firebaseRef.collection("animals").add(JSON.parse(json));
            resultCheckLogic("Animal id : ", result);
        } catch (error) {
            console.log("Error", error);
        }
    }

    async readlAllAnimals(renderDataLogic){
        try{
            var allAnimals = [];
            var result = await this.firebaseRef.collection("animals").get();
            result.forEach(item => {
                var tmpObj = item.data();
                tmpObj.id = item.id;
                allAnimals.push(tmpObj);
            });
            renderDataLogic(allAnimals);
        }catch(error){
            console.log("Error ",error);
        }
    }

    async getAnimalById(id,resultCheckLogic){
        try{
            var result = await this.firebaseRef.collection("animals").doc(id).get();
            if(result.exists){
                var tmpObj = result.data();
                tmpObj.id = result.id;
                resultCheckLogic(tmpObj.id);
            }
        }catch(error){
            console.log("Error",error);
        }
    }

    async deleteAnimalById(id,resultCheckLogic){
        try{
            await this.firebaseRef.collection("animals").doc(id).delete();
            resultCheckLogic("success");
        }catch(error){
            console.log("Error",error);
        }
    }

    // async deleteAllAnimals(){
    //     try{
    //         await this.firebaseRef.collection("animals").delete();
    //         console.log("success");
    //     }catch(error){
    //         console.log("Error",error);
    //     }
    // }


//     async updateAnimal(id, updateAnimalInfo, resultCheck){
//         try{
//             var json = JSON.stringify();
//             var result = await this.firebaseRef.collection("animals").doc(id).update(JSON.parse());
//             resultCheck(result);
//             JSON.stringify(updateAnimalInfo);
//         }catch(error){
//             console.log("Error",error);
//         }
//     }

}

class HtmlWorker {
    firebaseWorker;

    constructor(firebaseWorker){
        this.firebaseWorker = firebaseWorker;
        this.initData();
        this.saveAnimalData();
    }
    initData() {
        var self = this;
        this.firebaseWorker.readlAllAnimals(function (data) {
            self.renderAnimalsDataOnView(data);
        });
    }


    getAnimalCardHtml(animalItem) {
        return `<div class="card" style="width: 18rem;">
        <img src="${animalItem.image}" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">ID: ${animalItem.id} </h5>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Name: ${animalItem.name}</li>
            <li class="list-group-item">Breed: ${animalItem.breed}</li>
            <li class="list-group-item">Age: ${animalItem.age}</li>
            <li class="list-group-item">Gender: ${animalItem.gender}</li>
            <li class="list-group-item">Owner name: ${animalItem.ownerName}</li>
        </ul>
        </div>
        <div class="action-btns">
            <button onclick="viewWorker.deleteAnimalById(this,'${animalItem.id}')" class="btn btn-danger">
                <i class="fas fa-times"></i>
            </button>
            <button onclick="viewWorker.updateAnimal('${animalItem.id}')" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                <i class="fas fa-marker"></i>
            </button>
        </div>
    </div>`
    }
    

    getAnimalUpdateFormHtml(animalItem) {
        return `
                <img src="${animalItem.image}"/>
                <div class="form-group">
                    <label for="">Enter animal name</label>
                    <input
                    id="nameUpdate"
                    value="${animalItem.name}"
                    type="text"
                    placeholder="Enter here"
                    class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label for="">Enter animal breed</label>
                    <input
                    id="breedUpdate"
                    value="${animalItem.breed}"
                    type="text"
                    placeholder="Enter here"
                    class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label for="">Enter animal age</label>
                    <input
                    id="ageUpdate"
                    value="${animalItem.age}"
                    type="text"
                    placeholder="Enter here"
                    class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label for="">Enter animal gender</label>
                    <input
                    id="genderUpdate"
                    value="${animalItem.gender}"
                    type="text"
                    placeholder="Enter here"
                    class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label for="">Enter animal owner Name</label>
                    <input
                    id="ownerNameUpdate"
                    value="${animalItem.ownerName}"
                    type="text"
                    placeholder="Enter here"
                    class="form-control"
                    />
                    <div class="form-group">
                    <label for="">Enter animal image</label>
                    <input
                    id="imageUpdate"
                    value="${animalItem.image}"
                    type="text"
                    placeholder="Enter here"
                    class="form-control"
                    />
                </div>
                </div>`
    }

    renderAnimalsDataOnView(animalData) {
        var animalsArea = document.querySelector(".animals-area");
        animalsArea.innerHTML = "";
        animalData.forEach(item => {
            animalsArea.innerHTML += this.getAnimalCardHtml(item);
        });
    }

    clearInputs() {
        var allInputs = document.querySelectorAll(".form-control");
        allInputs.forEach(inpItem => {
            inpItem.value = "";
        })
    }

    saveAnimalData() {
        var self = this;
        const nameInp = document.querySelector("#name");
        const breedInp = document.querySelector("#breed");
        const ageInp = document.querySelector("#age");
        const imageInp = document.querySelector("#image");
        const genderInp = document.querySelector("#gender")
        const ownerNameInp = document.querySelector("#ownerName")
        const saveAnimalBtn = document.querySelector("#save");

        saveAnimalBtn.addEventListener("click", function () {
            var animal = new Animal(
                nameInp.value,
                breedInp.value,
                ageInp.value,
                genderInp.value,
                ownerNameInp.value,
                imageInp.value,
            );

            self.firebaseWorker.addAnimal(animal, function (response) {
                if (response) {
                    self.showSuccessAlert();
                    self.initData();
                    self.clearInputs();
                }
            });
        })
    }

    deleteAnimalById(elem,id) {
        var self = this;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                self.firebaseWorker.deleteAnimalById(id, function (response) {
                    if (response) {
                        swal("Poof! Your imaginary file has been deleted!", {
                            icon: "success",
                        });
                        document.querySelector(".animals-area").removeChild(elem.parentNode);
                    }
                })
            } else {
                swal("Your imaginary file is safe!");
            }
        });
    }


    updateAnimal(animalId) {
        var self = this;
        self.firebaseWorker.getAnimalById(animalId, function (response) {
            var modalBody = document.querySelector(".modal-body");
            var htmlForm = self.getAnimalUpdateFormHtml(response);
            modalBody.innerHTML = htmlForm;
            const nameInp = document.querySelector("#nameUpdate");
            const breedInp = document.querySelector("#breedUpdate");
            const ageInp = document.querySelector("#ageUpdate");
            const imageInp = document.querySelector("#imageUpdate");
            const ownerNameInp = document.querySelector("#ownerNameUpdate");
            const updateAnimalBtn = document.querySelector("#updateAnimal");
            updateAnimalBtn.addEventListener("click", function () {
                var animal = new Animal(
                    nameInp.value,
                    breedInp.value,
                    ageInp.value,
                    genderInp.value,
                    ownerNameInp.value,
                    imageInp.value,
                );
                animal.id = animalId;

                self.firebaseWorker.updateAnimal(animalId, animal, function (response) {
                    if (response) {
                        document.querySelector("#closeModal").click();
                        self.showSuccessAlert();
                        self.initData();
                        self.clearInputs();
                    }
                })
            });
        });

    }
    
    showSuccessAlert() {
        swal("Good job!", "Success", "success");

    }

}
 
var animal = new Animal("","Loli","French",2,"Female","Giorgi","image.png");
var firebaseWorker = new FirebaseWorker();
var viewWorker = new HtmlWorker(new FirebaseWorker());

