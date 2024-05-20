import logo from './logo.svg';
import './App.css';
import UploadComponent from './ExportComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <UploadComponent />
      </header>
    </div>
  );
}

export default App;
