// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCdOTkc2gUpPULSJrb8kKMRc5LF3NQozk0",
  authDomain: "chat-app-gs-a5eed.firebaseapp.com",
  projectId: "chat-app-gs-a5eed",
  storageBucket: "chat-app-gs-a5eed.appspot.com",
  messagingSenderId: "426178592678",
  appId: "1:426178592678:web:79f4951e7937668ada5967"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password) =>{
	try {
		const res = await createUserWithEmailAndPassword(auth,email,password);
		const user = res.user;
		await setDoc(doc(db,"users",user.uid),{
			id:user.uid,
			username:username.toLowerCase(),
			email,
			name:"",
			avatar:"",
			bio:"Hey, There i am using chat app",
			lastSeen:Date.now()
		})
		await setDoc(doc(db,"chats",user.uid),{
			chatsData:[]
		})
	} catch (error) {
		console.error(error);
		toast.error(error.code.split('/')[1].split('-').join(" "));
	}
}

const login = async (email,password) =>{
	try {
		await signInWithEmailAndPassword(auth,email,password);
	} catch (error) {
		console.error(error);
		toast.error(error.code.split('/')[1].split('-').join(" "));
	}
}

const logout = async () =>{
	try {
		await signOut(auth)
	} catch (error) {
		console.error(error);
		toast.error(error.code.split('/')[1].split('-').join(" "));
	}
}

const resetPass = async (email) =>{
	if(!email){
		toast.error("Enter your email");
		return null;
	}
	try {
		const userRef = collection(db,'users');
		const q = query(userRef,where("email","==",email));
		const querySnap = await getDocs(q);
		if(!querySnap.empty){
			await sendPasswordResetEmail(auth,email);
			toast.success("Reset Email Sent")
		}
		else{
			toast.error("Email doesn't exists")
		}
	} catch (error) {
		// console.log(error);
		toast.error(error.message);
	}
}
export {signup,login,logout,auth,db,resetPass}