import { useEffect } from "react";

export default function Home(props) {
  return (
    <h1>index</h1>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    // recebe um numero de quanto em quanto tempo quero gerar uma nova versão da página
    // ex: a cada 8 hrs uma nova chamada da APi sera feita 
    revalidate: 60 * 60 * 8,
  }
}
