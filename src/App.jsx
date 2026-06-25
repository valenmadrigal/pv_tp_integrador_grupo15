import Header from "./components/layout/Header";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import Dashboard from "./views/Dashboard";

function App() {
  return (
    <>
      <Header />
      <Nav />
      <main>
        <Dashboard />
      </main>
      <Footer />
    </>
  );
}

export default App;