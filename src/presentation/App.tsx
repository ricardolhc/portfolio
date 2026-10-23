import { LazyMotion, domAnimation, MotionConfig } from 'motion/react';
import { usePreferences } from './preferences/PreferencesProvider';
import { Header } from './components/Header';
import {
  Hero,
  About,
  Experience,
  Projects,
  Technologies,
  Education,
  Certifications,
  Contact,
} from './components/PortfolioSections';
import { Icon } from './components/Icon';

export function App() {
  const { t } = usePreferences();

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <a className="skip-link" href="#main">
          {t.skip}
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Technologies />
          <Education />
          <Certifications />
          <Contact />
        </main>
        <footer className="container footer">
          <a className="footer-brand" href="#home">
            rc.
          </a>
          <div>
            <p>{t.footer.line}</p>
            <span>{t.footer.credit}</span>
          </div>
          <a className="back-top" href="#home">
            {t.footer.top}
            <Icon name="arrow" />
          </a>
        </footer>
      </LazyMotion>
    </MotionConfig>
  );
}
