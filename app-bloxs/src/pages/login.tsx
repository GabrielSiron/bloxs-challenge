import styles from "../styles/auth.module.css";
import { loginRequest } from "@/api/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  var form = {
    email: "",
    password: "",
  };

  const router = useRouter();

  const Login = () => {
    loginRequest(form)
      .then(async (response) => {
        await localStorage.setItem("token", response?.data?.token)
        router.push("/transactions");
      })
      .catch((err) => {
        alert("Failed");
      });
  };
  return (
    <div className={styles.page}>
      <div className={styles.form}>
        <h1 className={styles.formTitle}>Login</h1>
        <input
          type="text"
          placeholder="email"
          className={styles.formInput}
          onChange={(e: any) => {
            form.email = e.currentTarget.value;
          }}
        />
        <input
          type="password"
          placeholder="password"
          className={styles.formInput}
          onChange={(e: any) => {
            form.password = e.currentTarget.value;
          }}
        />
        <div className={styles.containerBtn}>
          <button className={styles.button} onClick={Login}>
            Faça Login!
          </button>
          <button className={styles.button}>Cadastrar-se</button>
        </div>
      </div>
    </div>
  );
}
