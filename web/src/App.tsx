import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Experience } from './sections/Experience'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'

export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        {/* Section order is the page order; nav links in Header.tsx follow it (ADR-0016) */}
        <Projects />
        <Skills />
        <Experience />
      </main>
      <Footer />
    </>
  )
}
