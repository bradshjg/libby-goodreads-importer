import logo from './logo.svg';
import './App.css';
import ConversionFormComponent from './ConversionFormComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ConversionFormComponent />
      </header>
    </div>
  );
}

export default App;
