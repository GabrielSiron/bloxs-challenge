import styles from "../styles/about.module.css";
import Header from '../components/sidemenu/sidemenu';

export default function Home() {

  return (
    <>
      <title>Quem Somos</title>
      <Header tabIndex="0"></Header>
      <div className={styles.page}>
        <div className={styles.content}>
          <h2 className={styles.topic}>Sobre Nós</h2>
          <p className={styles.description}>
          Bem-vindo ao Desafio Bloxs, onde a excelência financeira encontra o serviço personalizado. 
          Estabelecidos com o compromisso com a integridade, inovação e satisfação do cliente, temos orgulho 
          de ser seu parceiro confiável em sua jornada financeira.
          </p>
          <h2 className={styles.topic}>Nossa Visão</h2>
          <p className={styles.description}>
          No Desafio Bloxs, nossa visão é capacitar indivíduos e empresas a alcançarem seus objetivos financeiros. 
          Aspiramos ser um farol de estabilidade e um catalisador para o crescimento nas comunidades que servimos.
          </p>
          <h2 className={styles.topic}>Valores Fundamentais</h2>
          <p className={styles.description}>
            <strong>Integridade</strong>: Operamos com os mais altos padrões éticos, garantindo transparência e confiança em cada interação.
            <br />
            <strong>Inovação</strong>: Abraçando a tecnologia de ponta, nos esforçamos para fornecer soluções modernas que simplificam e aprimoram sua experiência bancária.
            <br />
            <strong>Orientação ao Cliente</strong>: Sua satisfação é nossa prioridade. Estamos dedicados a compreender suas necessidades únicas e oferecer soluções personalizadas.
          </p>
          <h2 className={styles.topic}>Por que Escolher o Desafio Bloxs?</h2>
          <p className={styles.description}>
            <strong>Segurança</strong>: Sua segurança financeira é primordial. Empregamos medidas de segurança de última geração para proteger seus ativos e dados.
            <br />
            <strong>Expertise</strong>: Com uma equipe de profissionais experientes, oferecemos orientação especializada para ajudá-lo a tomar decisões financeiras informadas.
            <br />
            <strong>Foco na Comunidade</strong>: Acreditamos em retribuir. Através de várias iniciativas comunitárias, contribuímos para o bem-estar e desenvolvimento das comunidades que servimos.
          </p>
        </div>
      </div>
    </>
  )
}
