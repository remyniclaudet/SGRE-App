import bcrypt from "bcrypt";

const password = "admin123"; // 👉 remplace par ton mot de passe

bcrypt.hash(password, 10).then(hash => {
  console.log("Mot de passe :", password);
  console.log("Hash bcrypt :", hash);
});
