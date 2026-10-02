import { MotionConfig } from 'framer-motion'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Problem } from '@/components/Problem'
import { Solutions } from '@/components/Solutions'
import { B2B, Logistics } from '@/components/Audiences'
import { Difference } from '@/components/Difference'
import { Process } from '@/components/Process'
import { QualificationForm } from '@/components/QualificationForm'
import { HonestFit, IdealClient } from '@/components/Fit'
import { Footer } from '@/components/Footer'

export function App() {
  return <MotionConfig reducedMotion="user"><Header /><main id="conteudo"><Hero /><Problem /><Solutions /><B2B /><Logistics /><Difference /><Process /><QualificationForm /><IdealClient /><HonestFit /></main><Footer /></MotionConfig>
}
