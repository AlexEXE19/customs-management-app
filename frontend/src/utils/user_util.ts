import Cookies from "js-cookie";

interface UserData {
  id: string;
  role: "admin" | "user";
}

const checkUserStatus = () => {
  // Cookies.get() returns string | undefined
  const userRole = Cookies.get("user_role") as UserData["role"] | undefined;

  if (userRole) {
    console.log(`User level: ${userRole.toUpperCase()}`);
  } else {
    console.log("No user data found in cookies.");
  }
};
