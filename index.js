//#region Firebase Stuff  ========================================
//----------------------  initilize firebase ---------------------------/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { doc, getDoc, getFirestore, collection, query, where, getDocs, orderBy, addDoc,  setDoc} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getStorage, ref as sRef, getDownloadURL, uploadBytesResumable} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBlrRgg3dNUxipxaTiWiJy85mFgc5pclkE",
    authDomain: "bbbmenu.firebaseapp.com",
    databaseURL: "https://bbbmenu-default-rtdb.firebaseio.com",
    projectId: "bbbmenu",
    storageBucket: "bbbmenu.appspot.com",
    messagingSenderId: "1029157624980",
    appId: "1:1029157624980:web:384538337a57e97a7be881",
    measurementId: "G-QHVMCFNS0X"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
//#endregion


//#region Variables -----------------------------------------------
//Variables
const body = document.getElementById("body");
const divHome = document.getElementById("divHome");
const btnFood = document.getElementById("btnFood");
const btnDrinks = document.getElementById("btnDrinks");
const divFood = document.getElementById("divFood");
const divDrink = document.getElementById("divDrink");

//Food Variables
const btnFoodHome = document.getElementById("btnFoodHome");
const divFoodCat = document.getElementById("divFoodCat");
const divFoodItem = document.getElementById("divFoodItem");
const imgFood = document.getElementById("imgFood");
const divFoodDescr = document.getElementById("divFoodDescr");
const divFoodPrice = document.getElementById("divFoodPrice");


//Drink Variables 
const btnDrinkHome = document.getElementById("btnDrinkHome");
const divDrinkCat = document.getElementById("divDrinkCat");
const divDrinkBrand = document.getElementById("divDrinkBrand");
const divDrinkItem = document.getElementById("divDrinkItem");
const divDrinkImage = document.getElementById("divDrinkImage");
const imgDrink = document.getElementById("imgDrink");
const divDrinkDescr = document.getElementById("divDrinkDescr");
const divDrinkPrice = document.getElementById("divDrinkPrice");


//#endregion Variables --------------------------------------------
btnFood.onclick = function() {
    divHome.style.display = "none";
    divFood.style.display = "flex";
    body.style.backgroundImage="url(Images/leathWhite.jpg)";
    LoadFoodCategories();
}
btnDrinks.onclick = function() {
    divHome.style.display = "none";
    divDrink.style.display = "flex";
    body.style.backgroundImage="url(Images/leathWhite.jpg)";
    LoadDrinkCategories();
}
//#region Food Section --------------------------------------------
btnFoodHome.onclick = function() {
    divHome.style.display = "flex";
    divFood.style.display = "none";
    body.style.backgroundImage="url(Images/leathGreen.jpeg)";
}

async function LoadFoodCategories() {
    divFoodCat.innerHTML = ""
    const q = query(collection(db, "FoodCat"), orderBy("CatName"), where("Enabled", "==",  true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "categoryBtn";
        btn.onclick = function () {
            FoodCategoryBtnClicked(doc.data().CatName);
        };
        btn.innerHTML = doc.data().CatName;
        divFoodCat.appendChild(btn);
    });
}
async function FoodCategoryBtnClicked(catName) {
    //console.log(catName + " clicked")
    divFoodItem.innerHTML=""
    const q = query(collection(db, "FoodItem"), where("FoodCategory", "==" , catName), orderBy("FoodName"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        //console.log(doc.data().FoodName)
        if (doc.data().Enabled == true) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "itemBtn";
            btn.onclick = function() {
                FoodItemBtnClicked(doc.id)
            };
            btn.innerHTML = doc.data().FoodName;
            divFoodItem.appendChild(btn);
        }
    });
}
async function FoodItemBtnClicked(docID) {
   // console.log(docID);
    const docRef = doc(db, "FoodItem", docID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
    //console.log("Document data:", docSnap.data());
    divFoodDescr.innerHTML = "<h3>" +docSnap.data().FoodName + "</h3>";
    divFoodDescr.innerHTML += docSnap.data().FoodDescr;
    divFoodPrice.innerHTML = "$" + docSnap.data().FoodCost
    divFoodPrice.style.display = "flex";
    GetFoodImage(docSnap.data().FoodImage);
    } else {
        console.log("No such document!");
    }
}

async function GetFoodImage(imageName) {
   const q = query(collection(db, "Images"), where("ImageName", "==" , imageName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        imgFood.src = doc.data().ImageURL;        

    });
}
//#endregion Food Section-----------------------------------------

//#region Drink Section -------------------------------------------
btnDrinkHome.onclick = function() {
    divHome.style.display = "flex";
    divDrink.style.display = "none";
    body.style.backgroundImage="url(Images/leathGreen.jpeg)";
}
async function LoadDrinkCategories() {
    divDrinkCat.innerHTML = ""
    const q = query(collection(db, "DrinkCat"), orderBy("CatName"), where("Enabled", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)  => {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "categoryBtn";
        btn.onclick = function() {
            DrinkCategoryBtnClicked(doc.data().CatName);
        };
        btn.innerHTML = doc.data().CatName;
        divDrinkCat.appendChild(btn);
    })
}
async function DrinkCategoryBtnClicked(catName) {
    //LoadDrinkBrands
    divDrinkBrand.innerHTML = ""
    const q = query(collection(db, "DrinkBrand"), where("BrandCategory", "==", catName), orderBy("BrandName"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if (doc.data().Enabled == true) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "itemBtn";
            btn.onclick = function() {
                DrinkBrandBtnClicked(doc.data().BrandName);
            }
            btn.innerHTML = doc.data().BrandName;
            divDrinkBrand.appendChild(btn);
        };
    });
}

async function DrinkBrandBtnClicked(brandName) {
    //LoadDrinkItems
    divDrinkItem.innerHTML = ""
    const q = query(collection(db, "DrinkItem"), where("DrinkBrand", "==", brandName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        var btn= document.createElement("button");
        btn.type = "button";
        btn.className = "itemBtn";
        btn.onclick = function() {
            DrinkItemBtnClicked(doc.id)
        };
        btn.innerHTML = doc.data().DrinkName;
        divDrinkItem.appendChild(btn);
    });
}

async function DrinkItemBtnClicked(docID) {
    const docRef = doc(db, "DrinkItem", docID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        //console.log(docSnap.data());
        divDrinkDescr.innerHTML = "<h3>" + docSnap.data().DrinkName + "</h3>";
        divDrinkDescr.innerHTML += "<span>Color: </span>";
        divDrinkDescr.innerHTML += docSnap.data().DrinkColor + "</p>";
        divDrinkDescr.innerHTML += "<span>Taste: </span>";
        divDrinkDescr.innerHTML += docSnap.data().DrinkTaste + "</p>";
        divDrinkDescr.innerHTML += "<span>Aroma: </span>";
        divDrinkDescr.innerHTML += docSnap.data().DrinkAroma + "</p>";
        divDrinkDescr.innerHTML += "<span>Finish: </span>";
        divDrinkDescr.innerHTML += docSnap.data().DrinkFinish;
        divDrinkPrice.innerHTML = "$" + docSnap.data().DrinkCost;
        divDrinkPrice.style.display = "flex";
        GetDrinkImage(docSnap.data().DrinkImage)

    }

}
async function GetDrinkImage(imageName) {
    const q = query(collection(db, "Images"), where("ImageName", "==" , imageName));
     const querySnapshot = await getDocs(q);
     querySnapshot.forEach((doc) => {
         imgDrink.src = doc.data().ImageURL;        
 
     });
 }

//#endregion Drink Section------------------------------------------