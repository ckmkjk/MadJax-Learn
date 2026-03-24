import { Routes, Route } from 'react-router-dom'
import ProfileSelect from './profiles/ProfileSelect'
import SubjectHub from './components/SubjectHub'
import RingCounter from './games/math/RingCounter'
import WordDash from './games/reading/WordDash'
import TailsWorkshop from './games/writing/TailsWorkshop'
import Layout from './components/Layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProfileSelect />} />
      <Route element={<Layout />}>
        <Route path="/hub" element={<SubjectHub />} />
        <Route path="/math" element={<RingCounter />} />
        <Route path="/reading" element={<WordDash />} />
        <Route path="/writing" element={<TailsWorkshop />} />
      </Route>
    </Routes>
  )
}
