import styles from "../styles/auth.module.css";
import { signUpRequest } from "@/api/index";
import { useRouter } from "next/navigation";

export default function SignUp() {
  var form = {
    name: "",
    email: "",
    password: "",
    document_number: "",
    birth_date: "",
  };

  const router = useRouter();

  const SignUp = () => {
    signUpRequest(form)
      .then((data) => {
        router.push("/home");
      })
      .catch((err) => {
        alert("Failed");
      });
  };

  return (
    <div className={styles.page}>
      <div className={styles.form}>
        <h1 className={styles.formTitle}>Cadastro</h1>
        <input
          type="text"
          placeholder="nome"
          className={styles.formInput}
          onChange={(e: any) => {
            form.name = e.currentTarget.value;
          }}
        />
        <input
          type="text"
          placeholder="cpf"
          className={styles.formInput}
          onChange={(e: any) => {
            form.document_number = e.currentTarget.value;
          }}
        />
        <input
          type="date"
          placeholder="birth date"
          className={styles.formInput}
          onChange={(e: any) => {
            form.birth_date = e.currentTarget.value;
          }}
        />
        <input
          type="text"
          placeholder="e-mail"
          className={styles.formInput}
          onChange={(e: any) => {
            form.email = e.currentTarget.value;
          }}
        />
        <input
          type="password"
          placeholder="senha"
          className={styles.formInput}
          onChange={(e: any) => {
            form.password = e.currentTarget.value;
          }}
        />
        <div className={styles.containerBtn}>
          <button className={styles.button} onClick={SignUp}>
            Criar conta!
          </button>
          <button className={styles.button}>Já possuo conta</button>
        </div>
      </div>
    </div>
  );
}
