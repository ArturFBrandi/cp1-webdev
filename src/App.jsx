import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";
import { Home } from "./pages/Home";
import { Detalhes } from "./pages/Detalhes";
import { Perfil } from "./pages/Perfil";
import { Estatisticas } from "./pages/Estatisticas";
import { Conquistas } from "./pages/Conquistas";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="detalhes/:tipo/:id" element={<Detalhes />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="estatisticas" element={<Estatisticas />} />
          <Route path="conquistas" element={<Conquistas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
