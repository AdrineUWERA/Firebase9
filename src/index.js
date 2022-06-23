import {initializeApp} from "firebase/app"
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, getDoc,
    doc, query, where, orderBy,
    serverTimestamp, updateDoc

} from "firebase/firestore"

import {
  getAuth, createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword, onAuthStateChanged

} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyA03eI3V6uEe_jdpEKqRapBYPaahMUsopw",
    authDomain: "fir-9basics.firebaseapp.com",
    projectId: "fir-9basics",
    storageBucket: "fir-9basics.appspot.com",
    messagingSenderId: "845164890612",
    appId: "1:845164890612:web:6ef00b80ae7e90d2e6d1a1"
};

// initialize firebase app
initializeApp(firebaseConfig);

// initialize services
const db = getFirestore()
const auth = getAuth()

//collection references
const colRef = collection(db, 'books');

//queries
// const q = query(colRef, where("author", "==", "Mufasa"), orderBy("title", "desc"))
const q = query(colRef, orderBy("createdAt"))


// get collection data
// getDocs(colRef)
//     .then((snapshot) => {
//         let books = [];
//         snapshot.forEach((doc) => {
//             books.push({ ...doc.data(), id: doc.id })
//         })

//         console.log(books);
//     })
//     .catch((err) => {
//         console.log(err);
//     })


// get realtime collection data
const unsubCol = onSnapshot(q, (snapshot)=> {
// onSnapshot(colRef, (snapshot)=> {
  let books = [];
  snapshot.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id })
  })

  console.log(books);
})


// adding documents
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
  })
  .then(() => {
    addBookForm.reset()
  })
})

// deleting documents
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })
})

//update a book
const updateBookForm = document.querySelector('.update')
updateBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const docRef = doc(db, 'books', updateBookForm.id.value)
  updateDoc( docRef, {
    title: 'update title'
  }).then(() => {
    updateBookForm.reset()
  })

})

// signing user up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = signupForm.email.value
  const password = signupForm.password.value
  createUserWithEmailAndPassword(auth, email,password)
    .then((cred) => {
      console.log('user created: ', cred.user)
      signupForm.reset()
    })
    .catch(err => {
      console.log(err)
    })
})

// login
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = loginForm.email.value
  const password = loginForm.password.value
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user logged in: ', cred.user)
      loginForm.reset()
    })
    .catch(err => {
      console.log(err)
    })
})

// logout
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', (e) => {
  signOut(auth)
    .then(() => {
      console.log("user signed out")
    })
    .catch(err => {
      console.log(err)
    })
})

//subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
   console.log('user status changed')
})

const docRef = doc(db, 'books', "2Qegd7mE4vwwbbuy0e1j")
// getDoc(docRef)
//   .then((doc) => {
//     console.log(doc.data(), doc.id)
//   })

const unsubDoc = onSnapshot(docRef, (doc)=>{
  console.log(doc.data(), doc.id)
})


const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click',(e) =>{
  console.log("Unsubscribing")
  unsubCol()
  unsubDoc()
  unsubAuth()
})
