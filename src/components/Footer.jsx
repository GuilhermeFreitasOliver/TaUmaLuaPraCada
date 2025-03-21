export function Footer() {
  return (
    <footer className="text-center text-white text-sm py-4">
      <p>
        Desenvolvido por Guizis | Dados fornecidos por{' '}
        <a 
          href="https://open-meteo.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:text-blue-200"
        >
          Open-Meteo
        </a>
      </p>
    </footer>
  )
}