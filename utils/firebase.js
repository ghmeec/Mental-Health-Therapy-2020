import React, { createContext } from 'react'
import app from 'firebase/app'

const FirebaseContext = createContext(null)
export { FirebaseContext }


const Provider=({ children }) => {  if (!app.apps.length) {
    const firebaseConfig = {
        apiKey: "AIzaSyC4oKpL8g6PIMYZQWctzhBleqb0FulFWJg",
        authDomain: "uqsapp.firebaseapp.com",
        databaseURL: "https://uqsapp.firebaseio.com",
        projectId: "uqsapp",
        storageBucket: "uqsapp.appspot.com",
        messagingSenderId: "1092090054069",
        appId: "1:1092090054069:web:4574591bba04c55c6e45fc"
      };

    app.initializeApp(firebaseConfig)
  }  return (
    <FirebaseContext.Provider value={ app }>
      { children }
    </FirebaseContext.Provider>
  )}

  export default Provider